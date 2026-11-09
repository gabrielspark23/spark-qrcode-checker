# Redesign global — auditoria (Etapa 1)

Base: preview `vincit-site-eight.vercel.app` (commit `41bdf84`). Escopo: direção "Architectural Minimalism +
Editorial Luxury + Geometric Brand Language + Scroll-Driven Storytelling".

## 1. Fonte geométrica da marca

| Item | Situação encontrada | Decisão |
| --- | --- | --- |
| SVG oficial | Não está no `vincit-os/vincit-os` nem em vincitfinancial.com, mas **existe em vincitcapital.com.br**: `escudo-vincit.svg`. | **Usado sem alteração** como marca; silhueta do escudo extraída do mesmo SVG → `src/lib/brand-geometry.ts`. |
| Lockup "VINCIT CAPITAL" | Publicado só em bitmap (`logo-vincit-capital-negativo.webp`, vincitcapital.com.br). | Wordmark vetorizado fielmente desse arquivo. **Trocar pelo vetor master se a agência enviar.** |
| `BrandMark` do site (escudo "V" desenhado à mão) | Aproximação: escudo pontudo simétrico, sem o círculo "C" da marca real. | **Removido.** Substituído pelo traçado oficial. |
| Wordmark "VINCIT / CAPITAL" em Newsreader | Letras inventadas pelo site. | **Removido.** Usa o lockup oficial "VINCIT CAPITAL" (resolve o nome de D6 a favor de "Vincit Capital", como no site brasileiro). |
| Medidas | — | Conferidas no SVG oficial: V a 66°, ombros a 66,0°, base a 41,4° (usamos 42°), proporção 1,16, círculo deslocado à direita. |

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
| Brasil | vincitcapital.com.br lista escritórios em **Porto Alegre** (Rua Mostardeiro, 322 – Moinhos de Vento) e **Caxias do Sul** | Entram no globo com foco e zoom. **Confirmar com o Ricardo que seguem atuais.** Serviços próprios do Brasil (crédito, consórcio, câmbio, holding) **não** entram no site americano. |

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

## 6. Referência vincitcapital.com.br (site brasileiro)

- Efeito principal: página inteira em rolagem horizontal fixada (GSAP ScrollTrigger com `pin`). **Não adotado**
  — o cliente pediu rolagem vertical e o briefing proíbe scroll hijacking.
- Aproveitado: escudo SVG oficial, lockup "VINCIT CAPITAL", escritórios de Porto Alegre e Caxias do Sul
  (padrão "seletor de escritório" → foco no globo).
- Para avaliar com o Ricardo: o manifesto "Vencer é investir em você" como assinatura em PT.

## 7. Rodada de ajustes (header, globo, estilhaços, equipe)

- Foto da equipe: `concept-partners.webp`, publicada em vincitcapital.com.br → `public/images/team-vincit.webp`.
  Alt sem nomes (o site não identifica quem é quem). **Confirmar com o Ricardo o uso no site americano.**
- Marca em estilhaços: escudo, V e círculo separados do `escudo-vincit.svg` oficial (`MARK_PARTS`).
- Header muda de tom conforme a seção por baixo (clara/grafite).
- Globo gira continuamente (4°/s), inclusive no celular e na página de Contato.

## 8. Rodada de ajustes (liderança, globo, manifesto)

- Cartões da liderança: no hover/foco do LinkedIn, um círculo claro nasce do link e cobre o cartão; o texto
  troca de cor acompanhando a borda.
- Globo: enquadramento e zoom mantidos. Porto Alegre e Caxias do Sul (~95 km) ganham rótulos com filete e,
  no foco, uma lente ampliada com as duas cidades e a distância.
- Sobre: seção "Nosso manifesto" com o vídeo oficial do YouTube (`wVIGLRQBq4U`, canal Vincit Capital).
  Capa servida pelo site; o player (youtube-nocookie) só carrega no clique. **Confirmar com o Ricardo** o
  uso no site americano.
