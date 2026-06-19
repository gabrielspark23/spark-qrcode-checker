import { prisma } from "@/lib/prisma";

// Integração com o HighLevel / LeadConnector (Etapa 4).
// Autorização: a V1 completa prevê OAuth com GHLConnection (tokens
// criptografados). Enquanto o app OAuth do GHL Developer Portal não existe
// (bloqueador do Time), usamos um Private Integration Token da location,
// configurado em GHL_LOCATION_TOKEN + GHL_LOCATION_ID. O resolvedor abaixo já
// prioriza a GHLConnection (OAuth) quando ela existir.

const GHL_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

export type GhlContact = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  tags: string[];
};

export type GhlAccess = { token: string; locationId: string };

export async function getGhlAccess(
  organizationId?: string
): Promise<GhlAccess | null> {
  // 1) OAuth (Etapa 4 completa) — quando houver conexão salva.
  if (organizationId) {
    const conn = await prisma.ghlConnection.findFirst({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });
    // TODO(Etapa 4 OAuth): descriptografar accessToken e tratar refresh.
    if (conn?.accessToken && conn.locationId) {
      return { token: conn.accessToken, locationId: conn.locationId };
    }
  }
  // 2) Private Integration Token da location (interim).
  const token = process.env.GHL_LOCATION_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (token && locationId) return { token, locationId };
  return null;
}

async function ghlFetch(access: GhlAccess, path: string, init?: RequestInit) {
  const res = await fetch(`${GHL_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${access.token}`,
      Version: GHL_VERSION,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GHL ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

function normalizeContact(c: Record<string, unknown>): GhlContact {
  const first = (c.firstName as string) ?? "";
  const last = (c.lastName as string) ?? "";
  const name =
    (c.contactName as string) ||
    (c.name as string) ||
    `${first} ${last}`.trim() ||
    (c.email as string) ||
    "(sem nome)";
  const rawTags = (c.tags as unknown[]) ?? [];
  const tags = rawTags
    .map((t) => (typeof t === "string" ? t : String((t as { name?: string })?.name ?? "")))
    .filter(Boolean);
  return {
    id: String(c.id),
    name,
    email: (c.email as string) || null,
    phone: (c.phone as string) || null,
    tags,
  };
}

// Lista contatos da location. Filtro por tag é aplicado sobre o resultado
// (a busca textual usa o parâmetro query do GHL).
export async function listContacts(
  access: GhlAccess,
  opts: { search?: string; tag?: string; limit?: number } = {}
): Promise<GhlContact[]> {
  const limit = Math.min(opts.limit ?? 100, 100);
  const params = new URLSearchParams({
    locationId: access.locationId,
    limit: String(limit),
  });
  if (opts.search) params.set("query", opts.search);
  const data = await ghlFetch(access, `/contacts/?${params.toString()}`);
  let contacts: GhlContact[] = ((data.contacts as Record<string, unknown>[]) ?? []).map(
    normalizeContact
  );
  if (opts.tag) {
    const tag = opts.tag.toLowerCase();
    contacts = contacts.filter((c) => c.tags.some((t) => t.toLowerCase() === tag));
  }
  return contacts;
}

// Tags cadastradas na location (para o filtro "selecionar todos com a tag X").
export async function listTags(access: GhlAccess): Promise<string[]> {
  try {
    const data = await ghlFetch(access, `/locations/${access.locationId}/tags`);
    const tags = ((data.tags as Record<string, unknown>[]) ?? [])
      .map((t) => String(t.name ?? ""))
      .filter(Boolean);
    return tags.sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}
