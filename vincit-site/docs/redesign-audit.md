# Redesign global — auditoria (Etapa 1)

Base: preview `vincit-site-eight.vercel.app` (commit `41bdf84`). Escopo: direção "Architectural Minimalism +
Editorial Luxury + Geometric Brand Language + Scroll-Driven Storytelling".

## 1. Fonte geométrica da marca

| Item | Situação encontrada | Decisão |
| --- | --- | --- |
| SVG oficial | **Não existe** no repositório `vincit-os/vincit-os` nem no site atual. O único arquivo oficial é o PNG `vincit financial 2.png` (1569×490) em vincitfinancial.com. | Vetorizado com potrace a partir do PNG oficial (sem redesenho) → `src/lib/brand-geometry.ts`. **Trocar pelo SVG master quando chegar (D6).** |
| `BrandMark` do site (escudo "V" desenhado à mão) | Aproximação: escudo pontudo simétrico, sem o círculo "C" da marca real. | **Removido.** Substituído pelo traçado oficial. |
| Wordmark "VINCIT / CAPITAL" em Newsreader | Letras inventadas pelo site. | **Removido.** Usa as letras "VINCIT" do logotipo oficial. O descritor ("Financial" no logo × "Capital" no site) segue aberto em D6 e não é exibido. |
| Medidas | — | V a 66°, ombros do escudo a 66°, base a 42°, proporção 1,16, círculo deslocado à direita. Tudo derivado daqui. |

## 2. Componentes

| Componente | Decisão | Motivo |
| --- | --- | --- |
| Tokens de cor e tipografia (`globals.css`) | **Reaproveitar** | Já seguem o briefing. Ganharam tokens de movimento. |
| `Button` (sweep + seta) | **Reconstruir** | Vira base de duas famílias: **V-Notch** (header e CTAs principais) e **Exploded Modules** (CTAs secundários). |
| `SiteHeader` (grafite, filete de latão) | **Reconstruir** | Header claro sobre o herói claro; links e CTA em V-Notch. Folha mobile mantida. |
| `SiteFooter` (cartão grafite) | **Reaproveitar** | Aprovado na rodada anterior. Remove a nota "D8" exposta. |
| `Hero` (grafite + índice de serviços) | **Reconstruir** | Herói claro, assimétrico, peça geométrica autoral. |
| `WhoWeAre` | **Remover** da Home | Conteúdo absorvido por "Our Perspective". |
| `GeometrySection` ("Our geometry") | **Remover** | O briefing pede a geometria integrada, sem seção explicativa. |
| `CircleReveal` | **Reaproveitar e ajustar** | Sem fixar a página (mantido); começa em ~80% do raio; usado só uma vez na Home. |
| `Convergence` / `FinalCtaConverge` | **Remover** | CTA final passa a retomar círculo e escudo do herói. |
| `ServicesGrid` (6 cartões iguais) | **Reconstruir** | Composição modular assimétrica com revelação por máscara. |
| `SegmentCards` + `ImageSlot` | **Remover** | Placeholders de foto expostos. Vira painel editorial interativo com composição geométrica. |
| `ProcessSteps` | **Reconstruir** (Home) / reaproveitar (About) | Linha de planejamento com segmentos em V revelada pelo scroll. |
| `CustodyBand` | **Remover** como seção | A frase de custódia vai para Tecnologia; a nota interna "§11.4" sai. |
| `TechBlock` (moldura com escudo no lugar da captura) | **Reconstruir** | Não há captura aprovada do OS: apresentação tipográfica, sem tela inventada. |
| `DraftNote` | **Remover do site público** | Anotações internas (D1, D7, D8, D9, D10, §11.4) estavam visíveis. Ficam só no styleguide interno. |
| `LeadForm`, `/api/leads`, rotas, i18n, SEO, 404 | **Manter** | Funcionam; nada a recriar. |

## 3. Conteúdo (comparado ao PRD e ao briefing)

| Ponto | Encontrado | Ação |
| --- | --- | --- |
| Nome da marca | "Vincit Capital" no site; logo oficial diz "VINCIT FINANCIAL" | Mantido "Vincit Capital" no texto (PRD); D6 continua aberta. |
| Público | Famílias, profissionais e empresários entre Brasil e EUA | Correto, mantido. |
| Seis serviços | Coerentes com o PRD | Mantidos; nota "D1" sai da página pública. |
| Contato | Endereço/telefone novos não confirmados (D8) | Mostra só "San Diego, CA". Nada inventado. |
| Agenda (D9) e WhatsApp (D10) | Sem link e sem número | Botões e cartões **ocultos** até haver dado (antes: botão desabilitado + nota). |
| Equipe | Bios aprovadas no site atual; sem retratos autorizados | Cartões tipográficos, sem placeholders de foto. Seção "Advisory team" (vazia, D7) removida. |
| Páginas legais | Caixa "Pending compliance approval" e trechos "Pending D1" visíveis | Removidos do público. Ficam só os trechos factuais (custódia, seguros, conteúdo educacional, privacidade básica). **Texto final continua dependendo da Ana.** |
| Números, depoimentos, selos, "Featured In", notícias | Nenhum no site novo | Mantido assim. "Featured In" omitido (não há imprensa verificável). |
| Tecnologia | Texto descreve só o que existe | Mantido; sem captura até haver imagem aprovada. |
| Brasil | Não há cidade/endereço confirmado | O globo destaca o **país**, não uma cidade. San Diego é a única localização pontual. |

## 4. Pendências que só a Vincit resolve

1. **SVG master do logotipo** (D6) — substituir o traçado em `src/lib/brand-geometry.ts`.
2. Endereço, telefone e e-mail novos (D8); link de agenda (D9); número do WhatsApp (D10).
3. Texto regulatório aprovado pela Ana (D1).
4. Capturas aprovadas do Vincit OS/portal para a seção de tecnologia.
5. Retratos autorizados da liderança (opcional — o layout tipográfico funciona sem eles).

## 5. Validação (Etapa 6)

- Home reduzida a uma narrativa conceitual (pedido do cliente): cada seção tem título + uma frase + o
  elemento visual; o texto completo vive nas páginas internas.
- Lighthouse mobile (build de produção, local): Home 96 · /pt 92 · /services 98 · /contact 98 em
  performance; acessibilidade 100; boas práticas 100. SEO 66 apenas por `is-crawlable` — o preview
  bloqueia indexação de propósito (`NEXT_PUBLIC_ALLOW_INDEX=1` libera na virada de DNS).
- LCP: 2,3–2,7 s; /pt 3,3 s (título mais longo). CLS 0.
- Fontes: Newsreader instanciado em peso 400 / opsz 40 e subset latino (≈20 kB cada, era ≈140 kB);
  servido via `next/font/local` com preload.
- Sem JS: reveal vira seção grafite comum, os quatro públicos aparecem, globo estático, linha inteira.
- Movimento reduzido: sem máscara, sem 3D, linhas já desenhadas.
