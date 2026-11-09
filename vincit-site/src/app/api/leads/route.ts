import { validateLead, normalizePhone, type LeadPayload } from "@/lib/lead";

/**
 * Recebe o formulário, valida e repassa ao endpoint da firma (OS ou GHL — D3).
 * Sem LEADS_ENDPOINT configurado, responde 202 em modo de teste (nada é gravado).
 * Nunca loga o corpo (PII).
 */
export async function POST(req: Request) {
  let body: Partial<LeadPayload>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: robô preencheu o campo invisível → finge sucesso, descarta.
  if (body.website) return Response.json({ ok: true, id: "discarded" }, { status: 202 });

  const errors = validateLead(body);
  if (Object.keys(errors).length) return Response.json({ ok: false, errors }, { status: 400 });

  const payload = { ...body, phone: body.phone ? normalizePhone(body.phone) : undefined };
  delete (payload as { website?: string }).website;

  const endpoint = process.env.LEADS_ENDPOINT;
  if (!endpoint) {
    return Response.json({ ok: true, id: crypto.randomUUID(), mode: "test" }, { status: 202 });
  }

  // TODO(D3): verificar o Turnstile aqui antes de repassar.
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Site-Key": process.env.LEADS_SITE_KEY ?? "" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return Response.json({ ok: false, error: "upstream" }, { status: res.status === 429 ? 429 : 502 });
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return Response.json({ ok: true, id: data.id ?? null }, { status: 202 });
  } catch {
    return Response.json({ ok: false, error: "upstream" }, { status: 502 });
  }
}
