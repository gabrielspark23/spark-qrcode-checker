"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Controle da fila de sincronização com o Spark/GHL (tags, campos e notas no
// contato). Mostra o tamanho da fila e permite drenar manualmente; o cron faz
// isso periodicamente de forma automática.
export function SparkSync() {
  const [pending, setPending] = useState<number | null>(null);
  const [failed, setFailed] = useState<number>(0);
  const [running, setRunning] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/ghl/sync/status");
      if (!res.ok) return;
      const d = await res.json();
      setPending(d.pending ?? 0);
      setFailed(d.failed ?? 0);
    } catch {
      /* silencioso */
    }
  }, []);

  useEffect(() => {
    // Busca o tamanho da fila ao montar; setState ocorre após o fetch (assíncrono).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  async function syncNow() {
    setRunning(true);
    const res = await fetch("/api/ghl/sync/process", { method: "POST" });
    setRunning(false);
    const d = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(d.error ?? "Falha ao sincronizar");
      return;
    }
    toast.success(
      `Sincronizado: ${d.done} aplicado(s)` +
        (d.failed ? `, ${d.failed} com erro` : "") +
        (d.skipped ? `, ${d.skipped} sem contato` : "")
    );
    refresh();
  }

  return (
    <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
      <div className="flex-1 text-sm">
        <p className="font-medium">Sincronização com o Spark</p>
        <p className="text-muted-foreground">
          {pending === null
            ? "—"
            : `${pending} ação(ões) na fila${failed ? ` · ${failed} com erro` : ""}`}{" "}
          (tags, campos e notas nos contatos)
        </p>
      </div>
      <Button variant="outline" onClick={syncNow} disabled={running}>
        {running ? "Sincronizando..." : "Sincronizar agora"}
      </Button>
    </div>
  );
}
