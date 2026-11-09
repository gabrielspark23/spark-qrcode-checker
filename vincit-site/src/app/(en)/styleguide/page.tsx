import type { Metadata } from "next";
import { MessageCircle, Phone } from "lucide-react";
import { Button, LinkArrow } from "@/components/ui/Button";
import { Container, DraftNote, Eyebrow, Section, SectionHeader } from "@/components/ui/Layout";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Logo } from "@/components/brand/Logo";
import { BrandMark } from "@/components/brand/BrandMark";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { serviceIcons } from "@/components/sections/icons";
import { getDict } from "@/content";

export const metadata: Metadata = { title: "Design system", robots: { index: false, follow: false } };

const palette = [
  { name: "--bg-app", hex: "#fafaf9", use: "Fundo das páginas", dark: false },
  { name: "--bg-surface-muted", hex: "#f5f5f4", use: "Cartões, faixas claras", dark: false },
  { name: "--color-navy", hex: "#16181d", use: "Herói, faixas, rodapé", dark: true },
  { name: "--color-navy-soft", hex: "#23262e", use: "Cartão sobre grafite", dark: true },
  { name: "--color-gold", hex: "#c2a263", use: "Latão: logo, filete, botão escuro", dark: false },
  { name: "--color-gold-soft", hex: "#d4bc8b", use: "Hover do botão latão", dark: false },
  { name: "--text-primary", hex: "#1c1917", use: "Texto; botão sobre claro", dark: true },
  { name: "--text-secondary", hex: "#57534e", use: "Texto secundário", dark: true },
  { name: "--text-muted", hex: "#6f6863", use: "Muted (≥ 4,5:1)", dark: true },
  { name: "--border-soft", hex: "#cbc9c7", use: "Divisórias", dark: false },
  { name: "--border-rule", hex: "#8a8886", use: "Régua estrutural (≥ 3:1)", dark: true },
  { name: "--success", hex: "#3d6b4c", use: "Sucesso no formulário", dark: true },
  { name: "--danger", hex: "#9b4444", use: "Erro no formulário", dark: true },
];

function Spec({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 font-mono text-xs leading-relaxed text-ink-3">{children}</p>;
}

export default function StyleguidePage() {
  const t = getDict("en");
  return (
    <>
      <PageHero
        eyebrow="Vincit · Design system v0"
        title="Vincit, à luz do dia."
        intro="Base de UI do site institucional: tokens do Vincit OS, tipografia, botões com animação, componentes e estados. Página interna, fora do sitemap."
      />

      {/* Índice */}
      <nav aria-label="Seções" className="sticky top-[4.5rem] z-40 border-b border-line bg-app/95 backdrop-blur-sm">
        <Container>
          <ul className="flex gap-6 overflow-x-auto py-3 text-sm text-ink-2">
            {["cores", "tipografia", "botoes", "links", "marca", "cartoes", "formulario", "conteudo"].map((s) => (
              <li key={s}><a href={`#${s}`} className="nav-link whitespace-nowrap capitalize hover:text-ink">{s.replace("botoes", "botões").replace("formulario", "formulário").replace("cartoes", "cartões").replace("conteudo", "conteúdo")}</a></li>
            ))}
          </ul>
        </Container>
      </nav>

      {/* Cores */}
      <Section id="cores" tone="light" labelledBy="sg-cores">
        <Container>
          <SectionHeader id="sg-cores" eyebrow="01 · Tokens" title="Cores" intro="Grafite e latão no lugar de preto e ouro saturados. Latão em no máximo ~1% da tela." />
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {palette.map((c) => (
              <li key={c.name} className="card overflow-hidden">
                <div className="h-20 border-b border-line" style={{ background: c.hex }} />
                <div className="p-3">
                  <p className="font-mono text-xs">{c.hex}</p>
                  <p className="mt-1 text-xs text-ink-2">{c.use}</p>
                  <p className="mt-1 font-mono text-[0.6875rem] text-ink-3">{c.name}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10 border-l-2 border-danger bg-surface p-5 text-[0.9375rem]">
            <strong>Contraste, a regra que mais quebra.</strong> Latão <code>#c2a263</code> sobre branco ≈ 2,4:1 —
            nunca como texto nem botão sobre fundo claro. Sobre grafite passa (≈ 8,7:1). Texto sobre latão é grafite.
          </div>
        </Container>
      </Section>

      {/* Tipografia */}
      <Section id="tipografia" tone="white" bordered labelledBy="sg-type">
        <Container>
          <SectionHeader id="sg-type" eyebrow="02 · Tipografia" title="Newsreader + Inter" intro="Serifa editorial nos títulos (peso 400–500); Inter no corpo, 16–18 px, line-height 1,6, até ~70 caracteres." />
          <div className="space-y-10">
            <div><p className="display">Built around your life.</p><Spec>.display · Newsreader 400 · clamp(40px → 68px) · -0.02em</Spec></div>
            <div><p className="h1 font-serif">Financial planning, not just money.</p><Spec>.h1 · clamp(36px → 52px)</Spec></div>
            <div><p className="h2 font-serif">One plan. Every part of your life.</p><Spec>.h2 · clamp(30px → 40px)</Spec></div>
            <div><p className="h3 font-serif">Wealth &amp; Retirement</p><Spec>.h3 · 24px</Spec></div>
            <div><p className="lead measure text-ink-2">Independent, bilingual wealth and protection planning for families and business owners between Brazil and the United States.</p><Spec>.lead · Inter 17–19px · text-secondary</Spec></div>
            <div><p className="measure">Corpo em Inter 16 px. Aspas curvas “assim” e travessões corretos — nunca hífens duplos. Termos técnicos como IUL ou 401(k) ganham uma linha de explicação na primeira vez.</p><Spec>body · Inter 16px / 1.6</Spec></div>
            <div><Eyebrow>Eyebrow / rótulo</Eyebrow><Spec>.eyebrow · Inter 600 · 12px · tracking 0.14em · CAPS só em rótulos</Spec></div>
          </div>
        </Container>
      </Section>

      {/* Botões */}
      <Section id="botoes" tone="light" bordered labelledBy="sg-btn">
        <Container>
          <SectionHeader
            id="sg-btn"
            eyebrow="03 · Ações"
            title="Botões"
            intro="Passe o mouse: o preenchimento varre da esquerda (200 ms), a seta sai e outra entra, e o clique desce 1 px. Sem degradê, sem glow, sem transition: all. Desligado em prefers-reduced-motion."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="on-dark border border-navy-line bg-navy p-8">
              <Button variant="brass">Schedule a conversation</Button>
              <p className="mt-6 text-sm text-on-dark-2">Primário sobre grafite: latão com texto grafite. Hover: latão claro.</p>
              <Spec><span className="text-on-dark-3">.btn .btn-brass</span></Spec>
            </div>
            <div className="border border-line bg-surface p-8">
              <Button>Schedule a conversation</Button>
              <p className="mt-6 text-sm text-ink-2">Primário sobre claro: tinta com texto branco. Nunca latão aqui.</p>
              <Spec>.btn .btn-primary</Spec>
            </div>
            <div className="border border-line bg-surface p-8">
              <Button variant="secondary" icon="none" leading={<MessageCircle className="h-4 w-4" strokeWidth={1.75} />}>Talk on WhatsApp</Button>
              <p className="mt-6 text-sm text-ink-2">Secundário: contorno régua; hover preenche com tinta.</p>
              <Spec>.btn .btn-secondary</Spec>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="border border-line bg-surface p-8">
              <p className="eyebrow mb-5 text-ink-3">Tamanhos</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button>Medium</Button>
                <Button size="lg">Large</Button>
              </div>
              <p className="eyebrow mb-5 mt-8 text-ink-3">Ícones e estados</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="secondary" icon="external">Pick a time</Button>
                <Button variant="secondary" icon="none" leading={<Phone className="h-4 w-4" strokeWidth={1.75} />}>Call us</Button>
                <Button disabled>Disabled</Button>
              </div>
              <Spec>icon=&quot;arrow&quot; (padrão) · &quot;external&quot; (diagonal) · &quot;none&quot; · leading=&#123;ícone&#125; · disabled</Spec>
            </div>
            <div className="on-dark border border-navy-line bg-navy p-8">
              <p className="eyebrow mb-5 text-on-dark-3">Sobre grafite</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="brass" size="lg">Schedule a conversation</Button>
                <Button variant="ghost-dark" icon="none" leading={<MessageCircle className="h-4 w-4" strokeWidth={1.75} />}>WhatsApp</Button>
              </div>
              <p className="mt-6 text-sm text-on-dark-2">Secundário escuro: contorno claro; hover preenche grafite-suave e a borda vira latão.</p>
              <Spec><span className="text-on-dark-3">.btn .btn-ghost-dark · foco: anel latão 2 px</span></Spec>
            </div>
          </div>
        </Container>
      </Section>

      {/* Links */}
      <Section id="links" tone="white" bordered labelledBy="sg-links">
        <Container>
          <SectionHeader id="sg-links" eyebrow="04 · Navegação" title="Links" />
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <LinkArrow href="#links">See all services</LinkArrow>
              <Spec>.link-arrow · sublinhado se desenha + seta avança 3 px</Spec>
            </div>
            <div>
              <a href="#links" className="nav-link text-[0.9375rem]">Services</a>
              <Spec>.nav-link · filete de latão 2 px cresce no hover / página atual</Spec>
            </div>
            <div>
              <a href="#links" className="font-medium underline underline-offset-4 hover:text-ink-2">Privacy Policy</a>
              <Spec>link em texto corrido · sublinhado sempre visível</Spec>
            </div>
          </div>
        </Container>
      </Section>

      {/* Marca */}
      <Section id="marca" tone="light" bordered labelledBy="sg-brand">
        <Container>
          <SectionHeader id="sg-brand" eyebrow="05 · Marca" title="Logo e escudo" intro="Provisório até o SVG oficial (D6). Latão chapado, sem degradê. Versão clara sobre grafite, escura sobre claro." />
          <div className="grid gap-6 md:grid-cols-3">
            <div className="on-dark flex h-40 items-center justify-center border border-navy-line bg-navy"><Logo onDark /></div>
            <div className="flex h-40 items-center justify-center border border-line bg-surface"><Logo /></div>
            <div className="flex h-40 items-center justify-center gap-6 border border-line bg-surface">
              <BrandMark className="h-12 w-12" tone="ink" />
              <span className="on-dark inline-flex h-16 w-16 items-center justify-center bg-navy"><BrandMark className="h-10 w-10" /></span>
            </div>
          </div>
          <p className="eyebrow mb-4 mt-12 text-ink-3">Ícones de linha (Lucide, 1.25 px, monocromáticos)</p>
          <ul className="flex flex-wrap gap-8">
            {t.services.map((s) => {
              const I = serviceIcons[s.id];
              return (
                <li key={s.id} className="flex flex-col items-center gap-2 text-xs text-ink-3">
                  <I className="h-8 w-8 text-ink" strokeWidth={1.25} aria-hidden />
                  {s.id}
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* Cartões */}
      <Section id="cartoes" tone="white" bordered labelledBy="sg-cards">
        <Container>
          <SectionHeader id="sg-cards" eyebrow="06 · Superfícies" title="Cartões, passos e fotos" intro="Elevação por borda de 1 px, nunca sombra. Hover escurece a borda e desenha o filete de latão." />
          <div className="grid gap-6 md:grid-cols-3">
            <a href="#cartoes" className="card card-interactive block p-8">
              <span className="card-rule absolute inset-x-0 top-0 h-0.5 bg-brass" aria-hidden />
              <p className="eyebrow text-ink-3">Vincit Planning</p>
              <h3 className="h3 mt-2">Financial Planning</h3>
              <p className="mt-3 text-[0.9375rem] text-ink-2">Cartão interativo: passe o mouse.</p>
            </a>
            <div className="card p-8">
              <h3 className="h3">Cartão estático</h3>
              <p className="mt-3 text-[0.9375rem] text-ink-2">Borda faint, fundo surface, raio 4 px.</p>
            </div>
            <ImageSlot ratio="16/9" label="Foto 16:9 — a receber" caption="ImageSlot: proporção fixa até a foto real chegar." />
          </div>
          <div className="mt-16">
            <ProcessSteps t={t} />
          </div>
        </Container>
      </Section>

      {/* Formulário */}
      <Section id="formulario" tone="light" bordered labelledBy="sg-form">
        <Container>
          <SectionHeader id="sg-form" eyebrow="07 · Formulário" title="Campos e estados" intro="Rótulo sempre visível, erro descrito em texto (não só cor), foco com anel de 2 px. O formulário completo está em /contact." />
          <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="sg-a" className="mb-2 block text-sm font-medium">Default</label>
              <input id="sg-a" className="field" defaultValue="Ana Silva" />
            </div>
            <div>
              <label htmlFor="sg-b" className="mb-2 block text-sm font-medium">Com erro</label>
              <input id="sg-b" className="field" aria-invalid="true" aria-describedby="sg-b-e" defaultValue="ana@" />
              <p id="sg-b-e" className="mt-2 text-sm text-danger">Please enter a valid email address.</p>
            </div>
            <div>
              <label htmlFor="sg-c" className="mb-2 block text-sm font-medium">Select</label>
              <select id="sg-c" className="field" defaultValue="planning">
                <option value="planning">Financial planning</option>
                <option value="protection">Protection</option>
              </select>
            </div>
            <div>
              <label htmlFor="sg-d" className="mb-2 block text-sm font-medium">Desabilitado</label>
              <input id="sg-d" className="field" disabled defaultValue="—" />
            </div>
          </div>
        </Container>
      </Section>

      {/* Conteúdo pendente */}
      <Section id="conteudo" tone="white" bordered labelledBy="sg-pend">
        <Container>
          <SectionHeader id="sg-pend" eyebrow="08 · Preview" title="Marcas de pendência" intro="Enquanto as decisões do PRD (§14) não fecham, o preview mostra o que falta com uma marca tracejada. Some quando o dado entra em src/lib/site.ts ou no conteúdo." />
          <div className="flex flex-wrap gap-3">
            <DraftNote code="D1">Texto regulatório pendente</DraftNote>
            <DraftNote code="D8">Endereço e telefone novos</DraftNote>
            <DraftNote code="D10">Número do WhatsApp</DraftNote>
          </div>
        </Container>
      </Section>
    </>
  );
}
