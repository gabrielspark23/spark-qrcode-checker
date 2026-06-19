"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type GhlContact = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  tags: string[];
};

const ALL_TAGS = "__all__";

// Add Guests a partir dos contatos do Spark/GHL (Etapa 4): busca, filtro por
// tag e "selecionar todos com a tag X".
export function ImportGhlDialog({
  eventId,
  onChange,
}: {
  eventId: string;
  onChange: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<GhlContact[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string>(ALL_TAGS);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (tag !== ALL_TAGS) params.set("tag", tag);
    const res = await fetch(`/api/ghl/contacts?${params.toString()}`);
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Falha ao buscar contatos");
      setContacts([]);
      return;
    }
    setContacts(data.contacts ?? []);
    if (data.tags?.length) setTags(data.tags);
  }, [search, tag]);

  useEffect(() => {
    // Busca contatos ao abrir o diálogo; setState ocorre após o fetch (assíncrono).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) fetchContacts();
  }, [open, fetchContacts]);

  const selectedIds = Object.keys(selected).filter((id) => selected[id]);
  const allShownSelected =
    contacts.length > 0 && contacts.every((c) => selected[c.id]);

  function toggle(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  function toggleAllShown() {
    setSelected((s) => {
      const next = { ...s };
      const target = !allShownSelected;
      for (const c of contacts) next[c.id] = target;
      return next;
    });
  }

  async function addSelected() {
    const chosen = contacts.filter((c) => selected[c.id]);
    if (chosen.length === 0) return;
    setAdding(true);
    const res = await fetch(`/api/events/${eventId}/guests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "ghl",
        guests: chosen.map((c) => ({
          name: c.name,
          email: c.email ?? undefined,
          phone: c.phone ?? undefined,
          ghlContactId: c.id,
        })),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setAdding(false);
    if (!res.ok) {
      toast.error(data.error ?? "Erro ao adicionar contatos");
      return;
    }
    toast.success(`${data.created} contato(s) adicionado(s) ao evento`);
    setSelected({});
    setOpen(false);
    onChange();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Importar contatos do Spark</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Contatos do Spark</DialogTitle>
          <DialogDescription>
            Busque, filtre por tag e selecione os contatos da sua conta para
            enviar o QR Code deste evento.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Buscar por nome, e-mail ou telefone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchContacts()}
            className="w-64"
          />
          <Select value={tag} onValueChange={setTag}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Filtrar por tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_TAGS}>Todas as tags</SelectItem>
              {tags.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="secondary" onClick={fetchContacts} disabled={loading}>
            {loading ? "Buscando..." : "Buscar"}
          </Button>
        </div>

        {error ? (
          <div className="rounded-md bg-amber-50 p-4 text-sm text-amber-700">
            {error}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={toggleAllShown}
                className="text-neutral-600 underline-offset-2 hover:underline"
                disabled={contacts.length === 0}
              >
                {allShownSelected ? "Limpar seleção" : "Selecionar todos os exibidos"}
                {tag !== ALL_TAGS ? ` (tag: ${tag})` : ""}
              </button>
              <span className="text-neutral-500">{selectedIds.length} selecionado(s)</span>
            </div>

            <div className="max-h-80 overflow-y-auto rounded-lg border">
              {contacts.length === 0 && !loading && (
                <p className="p-6 text-center text-sm text-neutral-500">
                  Nenhum contato encontrado.
                </p>
              )}
              {contacts.map((c) => (
                <label
                  key={c.id}
                  className="flex cursor-pointer items-center gap-3 border-b px-3 py-2 last:border-b-0 hover:bg-neutral-50"
                >
                  <input
                    type="checkbox"
                    checked={!!selected[c.id]}
                    onChange={() => toggle(c.id)}
                    className="h-4 w-4"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <p className="truncate text-xs text-neutral-500">
                      {c.email ?? "sem e-mail"}
                      {c.phone ? ` · ${c.phone}` : ""}
                    </p>
                  </div>
                  <div className="flex max-w-[40%] flex-wrap justify-end gap-1">
                    {c.tags.slice(0, 3).map((t) => (
                      <Badge key={t} variant="outline" className="text-[10px]">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={addSelected}
                disabled={adding || selectedIds.length === 0}
              >
                {adding
                  ? "Adicionando..."
                  : `Adicionar ${selectedIds.length} ao evento`}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
