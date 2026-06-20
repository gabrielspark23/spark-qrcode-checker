# Spark Check-in — Handoff de Sessão

Documento para retomar o projeto em uma nova sessão sem perder contexto.
Última atualização: 20/06/2026.

## Como retomar (passo a passo)

1. Abra uma nova sessão do Claude Code **apontando para o repositório**
   `gabrielspark23/website-isabela` (também acessível como
   `gabrielspark23/spark-qrcode-checker` — o repo foi renomeado).
2. Trabalhe na branch **`claude/exciting-volta-3tzti6`** (toda a história está
   nela; último commit `201e9bb`). **Não há branch `main`.**
3. Rode localmente:
   ```bash
   npm install
   cp .env.example .env   # preencher com os valores entregues à parte (ver abaixo)
   npx prisma generate
   npm run dev
   ```
4. As variáveis de ambiente (com valores) foram entregues fora do Git, em
   arquivo separado (`spark-checkin-env.txt`). Os **nomes** estão em
   `.env.example`.

## Onde está cada coisa

- **Código + docs**: GitHub `gabrielspark23/website-isabela` @
  `claude/exciting-volta-3tzti6`. Inclui `docs/DECISOES.md`,
  `docs/DEPLOY.md`, `docs/GHL_EMAIL_WORKFLOW.md`, `README.md`.
- **Banco (produção)**: Supabase **spark-referral-hub** (`mumdhdiliejulkblwhuw`,
  região `us-east-1`). 9 tabelas `checkin_` + FKs + RLS. Acesso via Prisma
  (usuário `postgres`). **Pooler: `aws-1-us-east-1.pooler.supabase.com`**
  (transaction 6543 p/ `DATABASE_URL`, session 5432 p/ `DIRECT_URL`).
- **GHL / Spark**: subaccount/location `qz19EgcgJfyjdVg8krSz`. Acesso por
  **Private Integration Token** (`GHL_LOCATION_TOKEN`).
- **Vercel**: projeto `spark-qrcode-checker`, time `pedropoleza-2498s-projects`,
  domínio `https://spark-qrcode-checker.vercel.app`.

## Estado do projeto (Etapas do documento V1.1)

- ✅ **Etapa 0–1**: scaffold, schema/migration, CRUD de eventos, layout.
- ✅ **Etapa 2**: convidados (CSV/manual), QR token+HMAC, Checker Mode
  (link+PIN) com as 4 respostas visuais, `/api/checkin/validate` atômico.
  Validado ao vivo (verde/amarelo/vermelho/cinza + corrida de scans).
- ✅ **Etapa 3 (modelo Spark/GHL)**: `/api/events/:id/send` grava dados do QR
  no contato + tag-gatilho `qrcode-enviado-{slug}`; EmailLog; status email_sent.
- ✅ **Etapa 4 (núcleo)**: busca de contatos da location (`/api/ghl/contacts`,
  filtro por tag, "selecionar todos com a tag X"), visualização de QR por
  contato, e **worker** `/api/ghl/sync/process` (+ cron `*/10`) que aplica
  tags/notas/campos no contato com retry/backoff. **Validado ao vivo**: tags
  `convidado-` e `qrcode-enviado-` aplicadas no contato real do GHL.
- ✅ **UI CRM**: design system com tokens light/dark (paleta GHL), tema com
  toggle (next-themes), app wide (max-w-1600), cards otimizados, abas
  superiores (sem sidebar — o app roda como iframe no CRM).

## Pendências

### 🔴 Deploy (bloqueador atual)
A nova UI (commit `201e9bb`) **não está publicada** ainda. Causas:
- O token da Vercel usado perdeu acesso ao time (autentica como conta pessoal
  `sparkleads`, retorna 403 no projeto do time).
- O ambiente de sessão tem o git **travado** no repo `website-isabela` /
  branch `claude/exciting-volta-3tzti6` (não dá para criar `main` nem push em
  outro repo).

**Resolver com UMA destas opções:**
1. **(Recomendado)** Na Vercel → projeto → Settings → Git → conectar o repo
   **`gabrielspark23/website-isabela`** e definir **Production Branch =
   `claude/exciting-volta-3tzti6`**. Auto-deploy a cada push.
2. Gerar um **token da Vercel com escopo do time `pedropoleza-2498s-projects`**
   (não da conta pessoal) e publicar via CLI.

> Atenção: um repositório novo/vazio conectado na Vercel **não** funciona, pois
> o código não pode ser enviado para ele a partir da sessão (git travado).

### 🟡 Etapa 4 — para o e-mail sair de verdade (👤 Time, no painel do GHL)
- Criar os **custom fields D3** na location: `event_name`, `event_date`,
  `event_location`, `event_qr_link`, `event_qr_image`, `event_checkin_status`,
  `event_checked_in_at`. (Hoje o worker aplica tags/notas e registra os campos
  ausentes sem travar a fila.)
- Montar o **workflow** com gatilho na tag `qrcode-enviado-{slug}` enviando o
  e-mail com imagem do QR + botão (template em `docs/GHL_EMAIL_WORKFLOW.md`).

### 🔵 Próximos (opcionais)
- OAuth completo + `GHLConnection` criptografada (substitui o PIT quando houver
  app no GHL Developer Portal).
- Tela de **Conexão do Spark** (status/Disconnect) e refinamento de
  modais/drawers no padrão CRM.
- Etapa 5: UAT, Go-Live, Hypercare.

## Segurança
As chaves `service_role`/`sb_secret` do spark-referral-hub e a senha do banco
foram trafegadas em chat. **Recomendado rotacioná-las** após o handoff
(Supabase → Settings → API / Database). O app conecta via Postgres (Prisma),
não usa as chaves de API.
