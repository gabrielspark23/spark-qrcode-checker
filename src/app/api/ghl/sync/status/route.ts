import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Tamanho da fila de sincronização (não processa nada).
export async function GET() {
  const [pending, failed, done] = await Promise.all([
    prisma.ghlSyncJob.count({ where: { status: "pending" } }),
    prisma.ghlSyncJob.count({ where: { status: "failed" } }),
    prisma.ghlSyncJob.count({ where: { status: "done" } }),
  ]);
  return NextResponse.json({ pending, failed, done });
}
