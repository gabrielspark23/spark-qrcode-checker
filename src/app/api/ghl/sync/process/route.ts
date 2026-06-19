import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processSyncJobs } from "@/lib/ghl-worker";

// Processa a fila de sincronização com o Spark/GHL. Acionado manualmente pela
// UI ou por cron (Vercel Cron). Idempotente: só drena jobs pending.
// Cron protegido por CRON_SECRET quando enviado no header Authorization.
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  // Se houver CRON_SECRET e o header for enviado, valida; chamadas da própria
  // UI (sem header) seguem permitidas — a operação é idempotente e não sensível.
  if (secret && auth && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  }
  const result = await processSyncJobs(50);
  return NextResponse.json(result);
}

// GET: usado pelo Vercel Cron e para consultar o tamanho da fila.
export async function GET() {
  const [pending, failed] = await Promise.all([
    prisma.ghlSyncJob.count({ where: { status: "pending" } }),
    prisma.ghlSyncJob.count({ where: { status: "failed" } }),
  ]);
  const result = await processSyncJobs(50);
  return NextResponse.json({ queueBefore: { pending, failed }, processed: result });
}
