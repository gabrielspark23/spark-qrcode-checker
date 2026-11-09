# Vincit — site institucional (Fase 1)

Base de UI do site novo da Vincit, conforme o PRD `01-prd-site-institucional.md` e o briefing do Gabriel.
Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript strict. Sem CMS: o conteúdo fica em `src/content/`.

> Projeto independente dentro deste repositório (o PRD recomenda um repo próprio `vincit-site` — D4).
> Pode ser movido inteiro depois, sem alterações.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3100
```

- `/` e `/pt` — Home EN/PT · `/styleguide` — design system ao vivo (tokens, botões, estados)
- `npm run build` · `npm run lint` · `npm run typecheck`

## Estrutura

```
src/app/(en)/...         rotas em inglês (root layout com lang="en")
src/app/(pt)/pt/...      rotas em português (root layout com lang="pt-BR")
src/app/api/leads        recebe o formulário, valida e repassa (LEADS_ENDPOINT) — sem env, modo teste
src/views/               uma view por página, compartilhada pelos dois idiomas
src/components/          brand · ui (Button, Layout, ImageSlot) · layout (header/footer) · sections · forms
src/content/en.ts, pt.ts textos v0 (Ricardo edita, Ana aprova)
src/lib/site.ts          dados da firma — campos vazios = decisão aberta (D5, D8, D9, D10)
src/app/globals.css      tokens do Vincit OS + sistema de botões/links/cartões/campos
```

## Variáveis de ambiente

| Nome | Para quê |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | domínio canônico (D5) |
| `NEXT_PUBLIC_OS_LOGIN_URL` | destino do Client Login e de `/login` |
| `NEXT_PUBLIC_SCHEDULE_URL` | link de horários do GHL (D9) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | número da firma, E.164 sem `+` (D10) |
| `LEADS_ENDPOINT` / `LEADS_SITE_KEY` | endpoint do OS ou do GHL (D3) |
| `NEXT_PUBLIC_ALLOW_INDEX=1` | libera indexação (só depois da virada de DNS) |

## Regras de craft (PRD §8.6)

Sem degradê, glow ou `transition: all`; elevação por borda de 1 px; latão nunca como texto ou botão sobre fundo
claro; movimento ≤ 200 ms, só em entrada e hover, desligado em `prefers-reduced-motion`; um H1 por página.
Marcas tracejadas (`DraftNote`) mostram no preview o que depende de decisão aberta.
