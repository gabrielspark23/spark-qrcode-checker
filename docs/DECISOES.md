# Spark Check-in — Registro de Decisões (D1–D7)

Decisões da seção 2.5 do documento de implementação V1.1, registradas em
13/06/2026. D4, D5 e a infraestrutura de banco foram confirmadas pelo Time;
as demais seguem a recomendação explícita do próprio documento e podem ser
revistas antes da Etapa 3/4.

| # | Decisão | Status |
|---|---------|--------|
| D1 | **Híbrida (C) com disparo pela automação do GHL** — o app prepara o contato (grava link/imagem do QR + dados do evento) e aplica a tag-gatilho; o **workflow nativo do HighLevel envia o e-mail**. O app não usa provedor próprio. | ✅ Confirmada pelo Time |
| D2 | **Imagem do QR + botão** no e-mail: imagem embedada (`event_qr_image`) E botão para a página do ingresso `/q/{token}` (`event_qr_link`). | ✅ Confirmada pelo Time |
| D3 | Custom fields no contato GHL: `event_name`, `event_date`, `event_location`, `event_qr_link`, `event_qr_image`, `event_checkin_status`, `event_checked_in_at`. | Sugestão do documento — Time cria no GHL na Etapa 4 |
| D4 | **Link + PIN temporário por evento** para o Checker (`/checker/{token}` + PIN de 6 dígitos). Sem login do organizador e sem acesso a dados sensíveis. | ✅ Confirmada pelo Time |
| D5 | Capacity atingida: **alerta e libera** — o check-in é efetuado e o Checker vê aviso de capacidade excedida. | ✅ Confirmada pelo Time |
| D6 | **Multi-tenant desde a V1** — `organization_id` em todo o schema, escopo no JWT e em toda query. | Recomendação do documento |
| D7 | Fila de sincronização GHL: **tabela `checkin_ghl_sync_jobs` no próprio Postgres**, processada por cron (Vercel Cron na Etapa 4). Retry sugerido: 5 tentativas com backoff exponencial (1min, 5min, 15min, 1h, 6h). | Padrão adotado — confirmar provider/retry antes da Etapa 4 |

## HighLevel (Etapa 4)

- **Subaccount / Location ID**: `qz19EgcgJfyjdVg8krSz` (fornecida pelo Time em 13/06/2026).
  É a location onde serão criados os custom fields (D3), o workflow de envio do QR
  (ver `GHL_EMAIL_WORKFLOW.md`) e contra a qual o OAuth/worker irão operar.

## Infraestrutura

- **Banco**: projeto Supabase **spark-referral-hub** (`mumdhdiliejulkblwhuw`, região
  us-east-1). Tabelas com prefixo `checkin_` (9 tabelas, FKs e RLS), aplicadas em
  19/06/2026. Acesso do app é server-side via Prisma (usuário `postgres`).
  - Pooler (Supavisor) deste projeto: host **`aws-1-us-east-1.pooler.supabase.com`**
    (atenção: projetos mais novos usam `aws-1`, não `aws-0`). `DATABASE_URL` usa o
    transaction pooler (6543, `pgbouncer=true`); `DIRECT_URL` usa o session pooler (5432).
  - Histórico: o schema chegou a ser aplicado no Sparkleads OS, mas foi **removido**
    de lá (tabelas e role dedicada) ao migrar para o banco dedicado.
- **Hospedagem**: Vercel — projeto **spark-qrcode-checker**
  (https://spark-qrcode-checker.vercel.app), deploy de produção ativo.
- **Autenticação**: o app roda **embutido como iframe no CRM** (sem tela de login);
  CSP `frame-ancestors` liberado. Escopo de organização resolvido por uma org padrão
  (multi-tenant futuro via location/SSO do CRM).

## Pendências 👤 Time (bloqueadores das próximas etapas)

- [x] Banco de produção provisionado (spark-referral-hub) e `DATABASE_URL`/`DIRECT_URL` na Vercel.
- [x] `JWT_SIGNING_KEY`, `TICKET_TOKEN_SECRET`, `APP_BASE_URL` configurados na Vercel.
- [ ] Rotacionar as chaves `service_role`/`sb_secret` do spark-referral-hub (foram expostas no chat; o app não as usa).
- [x] Token de acesso à location configurado (`GHL_LOCATION_TOKEN` = Private Integration Token; `GHL_LOCATION_ID`).
- [ ] **Criar os custom fields D3 no HighLevel** (`event_name`, `event_date`, `event_location`, `event_qr_link`, `event_qr_image`, `event_checkin_status`, `event_checked_in_at`). Enquanto não existirem, o worker aplica tags/notas normalmente e registra os campos como "ausentes" sem travar a fila.
- [ ] **Montar o workflow no HighLevel** com gatilho na tag `qrcode-enviado-{slug}` para o e-mail do QR sair de verdade (ver `GHL_EMAIL_WORKFLOW.md`).
- [ ] OAuth completo (`GHL_CLIENT_ID`/`SECRET` + redirect URI) — substitui o Private Integration Token quando houver multi-location/refresh.

## Etapa 4 — estado (19/06/2026)

- ✅ Busca de contatos e tags da location (`/api/ghl/contacts`), filtro por tag e "selecionar todos com a tag X" na tela Add Guests.
- ✅ Worker da fila `checkin_ghl_sync_jobs` (`/api/ghl/sync/process` + cron `*/10`) com retry/backoff; aplica `add_tag`, `add_note` e `update_fields` (idempotente).
- ✅ Validado ao vivo: contato adicionado → tags `convidado-{slug}` e `qrcode-enviado-{slug}` aplicadas no contato real do GHL.
- ⏳ Disparo do e-mail depende do workflow no HighLevel (👤 Time) e os valores de custom field dependem dos campos D3 criados (👤 Time).
- Auth via Private Integration Token (interim); OAuth/`GHLConnection` fica para quando o app do Developer Portal existir.
