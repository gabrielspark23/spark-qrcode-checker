import Link from "next/link";
import { getCurrentOrgId } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { CreateEventDialog } from "@/components/events/create-event-dialog";
import { EVENT_STATUS_LABEL, EVENT_STATUS_VARIANT } from "@/components/events/status";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const organizationId = await getCurrentOrgId();
  const events = await prisma.event.findMany({
    where: { organizationId },
    orderBy: { date: "desc" },
    include: {
      _count: { select: { guests: true } },
      tickets: { where: { status: "checked_in" }, select: { id: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Crie eventos, gere os QR Codes e valide a entrada no modo Checker.
          </p>
        </div>
        <CreateEventDialog />
      </div>

      {events.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-2xl py-16 text-center">
          <span className="bg-brand-gradient mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white shadow-lg shadow-indigo-500/30">
            ✦
          </span>
          <p className="text-lg font-semibold">Nenhum evento ainda</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Crie o seu primeiro evento para começar a gerar QR Codes e credenciar
            convidados.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, i) => {
            const checkins = event.tickets.length;
            return (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="glass fluid fluid-lift animate-rise group block rounded-2xl p-5"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold leading-tight tracking-tight group-hover:text-brand">
                    {event.name}
                  </h2>
                  <Badge variant={EVENT_STATUS_VARIANT[event.status] ?? "secondary"}>
                    {EVENT_STATUS_LABEL[event.status] ?? event.status}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {event.date.toISOString().slice(0, 10)}
                  {event.startTime ? ` · ${event.startTime}` : ""}
                  {event.locationName ? ` · ${event.locationName}` : ""}
                </p>
                <div className="mt-5 flex gap-6">
                  <div>
                    <p className="text-2xl font-bold tabular-nums">{event._count.guests}</p>
                    <p className="text-xs text-muted-foreground">Convidados</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold tabular-nums text-brand">{checkins}</p>
                    <p className="text-xs text-muted-foreground">Check-ins</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
