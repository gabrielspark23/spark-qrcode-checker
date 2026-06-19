import { NextRequest, NextResponse } from "next/server";
import { getCurrentOrgId, jsonError } from "@/lib/api";
import { getGhlAccess, listContacts, listTags } from "@/lib/ghl";

// Busca de contatos e tags da location conectada (seção 3.3 / Etapa 4).
// Query params: ?search=texto  &tag=nome-da-tag
export async function GET(req: NextRequest) {
  const organizationId = await getCurrentOrgId();
  const access = await getGhlAccess(organizationId);
  if (!access) {
    return jsonError(
      400,
      "Spark/GHL não conectado. Configure o token da location (GHL_LOCATION_TOKEN/ID)."
    );
  }

  const search = req.nextUrl.searchParams.get("search") ?? undefined;
  const tag = req.nextUrl.searchParams.get("tag") ?? undefined;

  try {
    const [contacts, tags] = await Promise.all([
      listContacts(access, { search, tag, limit: 100 }),
      listTags(access),
    ]);
    return NextResponse.json({ contacts, tags, locationId: access.locationId });
  } catch (e) {
    return jsonError(502, `Falha ao consultar o Spark/GHL: ${(e as Error).message}`);
  }
}
