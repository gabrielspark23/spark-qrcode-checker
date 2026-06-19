import Link from "next/link";
import { getCurrentOrgId } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const organizationId = await getCurrentOrgId();
  const orgFilter = { event: { organizationId } };

  const [events, activeEvents, guests, checkedIn, qrGenerated] = await Promise.all([
    prisma.event.count({ where: { organizationId } }),
    prisma.event.count({ where: { organizationId, status: "active" } }),
    prisma.guest.count({ where: { ...orgFilter, status: { not: "canceled" } } }),
    prisma.ticket.count({ where: { ...orgFilter, status: "checked_in" } }),
    prisma.ticket.count({ where: { ...orgFilter, status: { not: "canceled" } } }),
  ]);

  const metrics = [
    { label: "Eventos", value: events, hint: "no total", accent: "from-indigo-500 to-violet-500" },
    { label: "Eventos ativos", value: activeEvents, hint: "recebendo check-in", accent: "from-emerald-500 to-teal-500" },
    { label: "Convidados", value: guests, hint: "na lista", accent: "from-sky-500 to-cyan-500" },
    { label: "QR Codes", value: qrGenerated, hint: "gerados", accent: "from-fuchsia-500 to-pink-500" },
    { label: "Check-ins", value: checkedIn, hint: "confirmados", accent: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visão geral do credenciamento dos seus eventos.
          </p>
        </div>
        <Button asChild size="lg" className="rounded-full shadow-lg shadow-indigo-500/20">
          <Link href="/events">Ver eventos</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className="glass fluid fluid-lift animate-rise overflow-hidden rounded-2xl p-5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span
              className={`mb-4 block h-1.5 w-10 rounded-full bg-gradient-to-r ${m.accent}`}
            />
            <p className="text-4xl font-bold tracking-tight tabular-nums">{m.value}</p>
            <p className="mt-1 text-sm font-medium">{m.label}</p>
            <p className="text-xs text-muted-foreground">{m.hint}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
