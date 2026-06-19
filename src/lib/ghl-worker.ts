import { prisma } from "@/lib/prisma";
import {
  getGhlAccess,
  addContactTags,
  addContactNote,
  updateContactCustomFields,
} from "@/lib/ghl";

// Worker da fila checkin_ghl_sync_jobs (Etapa 4 / D7): consome jobs pending,
// executa contra o GHL (add_tag | update_fields | add_note) e aplica retry com
// backoff exponencial. Não bloqueia o Checker — roda por trigger manual/cron.

const MAX_ATTEMPTS = 5;
// Backoff por nº de tentativas (minutos): 1, 5, 15, 60, 360.
const BACKOFF_MIN = [1, 5, 15, 60, 360];

function nextRetry(attempts: number): Date {
  const min = BACKOFF_MIN[Math.min(attempts, BACKOFF_MIN.length - 1)];
  return new Date(Date.now() + min * 60_000);
}

type JobResult = { done: number; failed: number; skipped: number };

export async function processSyncJobs(limit = 25): Promise<JobResult> {
  const access = await getGhlAccess();
  if (!access) return { done: 0, failed: 0, skipped: 0 };

  const now = new Date();
  const jobs = await prisma.ghlSyncJob.findMany({
    where: {
      status: "pending",
      OR: [{ nextRetryAt: null }, { nextRetryAt: { lte: now } }],
    },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  const result: JobResult = { done: 0, failed: 0, skipped: 0 };

  for (const job of jobs) {
    if (!job.ghlContactId) {
      // Sem contato no GHL (convidado de CSV): nada a sincronizar.
      await prisma.ghlSyncJob.update({
        where: { id: job.id },
        data: { status: "done", processedAt: new Date(), lastError: "sem ghl_contact_id" },
      });
      result.skipped++;
      continue;
    }
    try {
      const payload = job.payload as Record<string, unknown>;
      if (job.action === "add_tag") {
        await addContactTags(access, job.ghlContactId, [String(payload.tag)]);
      } else if (job.action === "add_note") {
        await addContactNote(access, job.ghlContactId, String(payload.note));
      } else if (job.action === "update_fields") {
        const values: Record<string, string> = {};
        for (const [k, v] of Object.entries(payload)) values[k] = String(v);
        const { missing } = await updateContactCustomFields(
          access,
          job.ghlContactId,
          values
        );
        if (missing.length) {
          // Campos D3 ainda não criados no GHL: registra mas não trava a fila.
          await prisma.ghlSyncJob.update({
            where: { id: job.id },
            data: {
              status: "done",
              processedAt: new Date(),
              lastError: `custom fields ausentes no GHL: ${missing.join(", ")}`,
            },
          });
          result.done++;
          continue;
        }
      }
      await prisma.ghlSyncJob.update({
        where: { id: job.id },
        data: { status: "done", processedAt: new Date(), lastError: null },
      });
      result.done++;
    } catch (e) {
      const attempts = job.attempts + 1;
      const failed = attempts >= MAX_ATTEMPTS;
      await prisma.ghlSyncJob.update({
        where: { id: job.id },
        data: {
          status: failed ? "failed" : "pending",
          attempts,
          nextRetryAt: failed ? null : nextRetry(attempts),
          lastError: (e as Error).message.slice(0, 500),
        },
      });
      result.failed++;
    }
  }

  return result;
}
