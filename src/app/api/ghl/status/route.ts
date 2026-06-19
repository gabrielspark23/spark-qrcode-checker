import { NextResponse } from "next/server";
import { getCurrentOrgId } from "@/lib/api";
import { getGhlAccess } from "@/lib/ghl";

// Status da conexão com o Spark/GHL (tela HighLevel Connection — Etapa 4).
export async function GET() {
  const organizationId = await getCurrentOrgId();
  const access = await getGhlAccess(organizationId);
  return NextResponse.json({
    connected: !!access,
    locationId: access?.locationId ?? null,
  });
}
