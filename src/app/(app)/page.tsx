import Link from "next/link";
import { getCurrentOrgId } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { MetricCard } from "@/components/ui/metric-card";

export const dynamic = "force-dynamic";

const I = {
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
  ),
  activity: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
  qr: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3h-3zM21 14v7M14 21h7" /></svg>
  ),
  check: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
  ),
};

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
    { label: "Eventos", value: events, hint: "no total", tone: "primary" as const, icon: I.calendar },
    { label: "Eventos ativos", value: activeEvents, hint: "recebendo check-in", tone: "success" as const, icon: I.activity },
    { label: "Convidados", value: guests, hint: "na lista", tone: "sky" as const, icon: I.users },
    { label: "QR Codes", value: qrGenerated, hint: "gerados", tone: "violet" as const, icon: I.qr },
    { label: "Check-ins", value: checkedIn, hint: "confirmados", tone: "amber" as const, icon: I.check },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral do credenciamento dos seus eventos."
        actions={
          <Button asChild>
            <Link href="/events">Ver eventos</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {metrics.map((m, i) => (
          <MetricCard
            key={m.label}
            label={m.label}
            value={m.value}
            hint={m.hint}
            tone={m.tone}
            icon={m.icon}
            delay={i * 60}
          />
        ))}
      </div>
    </div>
  );
}
