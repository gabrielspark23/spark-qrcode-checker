import type { Metadata } from "next";
import { Button, LinkArrow, ModuleButton } from "@/components/ui/Button";
import { Container, DraftNote, Section, SectionHeader } from "@/components/ui/Layout";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { ShieldLine, VLines } from "@/components/brand/Shapes";
import { PageHero } from "@/components/sections/PageHero";
import { BRAND_GEOMETRY } from "@/lib/brand-geometry";

export const metadata: Metadata = { title: "Design system", robots: { index: false, follow: false } };

const palette = [
  { name: "--bg-app", hex: "#fafaf9", use: "Fundo principal" },
  { name: "--bg-surface-muted", hex: "#f5f5f4", use: "Superfícies claras" },
  { name: "--color-navy", hex: "#16181d", use: "Grafite institucional" },
  { name: "--color-navy-soft", hex: "#23262e", use: "Superfície sobre grafite" },
  { name: "--color-gold", hex: "#c2a263", use: "Latão" },
  { name: "--color-gold-soft", hex: "#d4bc8b", use: "Latão — hover" },
  { name: "--text-primary", hex: "#1c1917", use: "Texto sobre claro" },
  { name: "--text-secondary", hex: "#57534e", use: "Texto secundário" },
  { name: "--border-soft", hex: "#cbc9c7", use: "Divisórias" },
];

const motion = [
  ["--dur-fast", "120 ms", "cor, opacidade"],
  ["--dur-base", "180 ms", "contornos (V-Notch), módulos (Exploded)"],
  ["--dur-panel", "420 ms", "máscaras e troca de painel por clique"],
  ["--dur-draw", "900 ms", "linhas que se desenham ao entrar (uma vez)"],
  ["--ease-out", "cubic-bezier(.2,.7,.2,1)", "entradas e hovers"],
  ["--ease-in-out", "cubic-bezier(.65,0,.35,1)", "planos e máscaras"],
  ["--shift", "3 px", "deslocamento máximo de um módulo"],
];

function Spec({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 font-mono text-xs leading-relaxed text-ink-3">{children}</p>;
}

export default function StyleguidePage() {
  const g = BRAND_GEOMETRY;
  return (
    <>
      <PageHero
        eyebrow="Vincit · Design system v1 (interno)"
        title="Architectural Minimalism, Editorial Luxury."
        intro="Fonte única dos tokens, da geometria da marca, das duas famílias de botões e do sistema de movimento. Página interna, fora do sitemap."
      />

      <nav aria-label="Seções" className="sticky top-[4.5rem] z-40 border-b border-line bg-app/95 backdrop-blur-sm">
        <Container>
          <ul className="flex gap-1 overflow-x-auto py-2 text-sm">
            {[
              ["marca", "Marca"],
              ["cores", "Cores"],
              ["tipografia", "Tipografia"],
              ["vnotch", "V-Notch"],
              ["exploded", "Exploded Modules"],
              ["movimento", "Movimento"],
              ["pendencias", "Pendências"],
            ].map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="vn-link whitespace-nowrap">{label}</a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>


      <Section id="c-variantes" tone="white" bordered labelledBy="sg-cvar">
        <Container>
          <SectionHeader
            id="sg-cvar"
            eyebrow="Decisão"
            title="C no botão — escolha a variação"
            intro="Todas já no estado de hover. Diga a letra (A, B, C ou D)."
          />
          <div className="grid gap-8 md:grid-cols-2">
            {[
              { k: "A", d: "Faixa fina perto da borda, nasce no alto e corta a base (versão anterior).", st: { "--c-cx": "9px", "--c-cy": "0.64", "--c-k": "1.1", "--vn-x": "2.3rem" } },
              { k: "B", d: "Faixa fina centrada na altura: o C atravessa o topo e a base, aberto para a direita (borda).", st: { "--c-cx": "2px", "--c-cy": "0.5", "--c-k": "1.25", "--vn-x": "2.75rem" } },
              { k: "C", d: "C inteiro dentro do cartão, menor, abertura para a direita; o V à esquerda dele.", st: { "--c-cx": "26px", "--c-cy": "0.55", "--c-k": "0.95", "--vn-x": "3.4rem" } },
              { k: "D", d: "C maior dentro do cartão com o V sobre o centro (a versão de que você não gostou).", st: { "--c-cx": "calc(6px + var(--vn-h) * 0.315 * 1.1)", "--c-cy": "0.62", "--c-k": "1.1", "--vn-x": "calc(6px + var(--vn-h) * 0.346)" } },
            ].map((v) => (
              <div key={v.k} className="border border-line bg-app p-8">
                <p className="eyebrow text-ink-3">Variação {v.k}</p>
                <div className="mt-6 flex flex-col items-start gap-6">
                  <span className="btn btn-shield btn-lg vn vn-strong is-demo" style={v.st as React.CSSProperties}>
                    <span>Schedule a conversation</span>
                  </span>
                  <span className="on-dark inline-flex bg-navy p-4">
                    <span className="btn btn-brass vn vn-strong is-demo" style={v.st as React.CSSProperties}>
                      <span>Schedule a conversation</span>
                    </span>
                  </span>
                </div>
                <p className="mt-6 text-sm text-ink-2">{v.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="marca" tone="light" labelledBy="sg-brand">
        <Container>
          <SectionHeader
            id="sg-brand"
            eyebrow="01 · Marca"
            title="Geometria oficial"
            intro="Marca do SVG oficial (escudo-vincit.svg, vincitcapital.com.br) e wordmark vetorizado do lockup oficial. Todas as formas derivadas leem as medidas abaixo."
          />
          <div className="grid gap-6 md:grid-cols-3">
            <div className="on-dark flex h-44 items-center justify-center border border-navy-line bg-navy"><Logo onDark /></div>
            <div className="flex h-44 items-center justify-center border border-line bg-surface"><Logo /></div>
            <div className="flex h-44 items-center justify-center gap-8 border border-line bg-surface">
              <LogoMark className="h-24 w-auto" />
              <LogoMark className="h-12 w-auto" tone="ink" />
            </div>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="border border-line bg-surface p-8">
              <svg viewBox="0 0 400 300" className="h-56 w-full" fill="none" aria-hidden>
                <ShieldLine x={40} y={30} width={200} stroke="var(--text-primary)" opacity={0.6} />
                <VLines ax={300} ay={250} h={200} stroke="var(--text-primary)" opacity={0.6} />
                <circle cx="300" cy="250" r="4" fill="var(--color-gold)" />
                <text x="250" y="44" fill="var(--text-muted)" fontSize="11" fontFamily="var(--font-sans)">V · {g.vAngle}°</text>
                <text x="40" y="292" fill="var(--text-muted)" fontSize="11" fontFamily="var(--font-sans)">escudo · base {g.shieldBaseAngle}° · ombro {g.shieldShoulderAngle}°</text>
              </svg>
            </div>
            <dl className="grid content-start gap-px border border-line bg-line text-sm">
              {[
                ["Braços do V", `${g.vAngle}° da horizontal`],
                ["Base do escudo", `${g.shieldBaseAngle}° da horizontal`],
                ["Ombros do escudo", `${g.shieldShoulderAngle}° da horizontal`],
                ["Proporção do escudo", `altura = largura × ${g.shieldRatio}`],
                ["Círculo (“C”)", "deslocado à direita do eixo do escudo"],
                ["Fonte", "src/lib/brand-geometry.ts"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 bg-surface px-5 py-3">
                  <dt className="text-ink-2">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </Section>

      <Section id="cores" tone="white" bordered labelledBy="sg-cores">
        <Container>
          <SectionHeader id="sg-cores" eyebrow="02 · Cor" title="Paleta" intro="Latão nunca como texto ou botão sobre fundo claro (≈ 2,4:1). Sobre grafite passa (≈ 8,7:1)." />
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {palette.map((c) => (
              <li key={c.name} className="overflow-hidden border border-line bg-surface">
                <div className="h-20 border-b border-line" style={{ background: c.hex }} />
                <div className="p-3">
                  <p className="font-mono text-xs">{c.hex}</p>
                  <p className="mt-1 text-xs text-ink-2">{c.use}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section id="tipografia" tone="light" bordered labelledBy="sg-type">
        <Container>
          <SectionHeader id="sg-type" eyebrow="03 · Tipografia" title="Newsreader + Inter" />
          <p className="display text-[clamp(2.75rem,1.6rem+4.2vw,5.25rem)]">Built around your life.</p>
          <Spec>display · Newsreader 400 · até 84 px · -0.02em</Spec>
          <p className="h1 mt-10 font-serif">Six disciplines, one plan.</p>
          <Spec>.h1 · clamp(36 → 52 px)</Spec>
          <p className="lead measure mt-10 text-ink-2">Independent, bilingual wealth and protection planning for families and business owners between Brazil and the United States.</p>
          <Spec>.lead · Inter 17–19 px · corpo Inter 16 px / 1.6</Spec>
        </Container>
      </Section>

      <Section id="vnotch" tone="white" bordered labelledBy="sg-vn">
        <Container>
          <SectionHeader
            id="sg-vn"
            eyebrow="04 · Família 1"
            title="V-Notch — Vincit Shield"
            intro="O contorno muda na extremidade direita: entalhe em V no topo (braços a 66°) e corte da base do escudo (42°). Sem mudança de largura, texto parado, 180 ms. Foco reproduz o hover; no touch, o recorte aparece durante o toque."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="border border-line bg-surface p-8">
              <Button notch="strong">Schedule a conversation</Button>
              <Spec>notch=&quot;strong&quot; · CTA principal (header, herói, fechamento)</Spec>
            </div>
            <div className="border border-line bg-surface p-8">
              <Button notch="soft" icon="none">Schedule</Button>
              <Spec>notch=&quot;soft&quot; · versões compactas</Spec>
            </div>
            <div className="on-dark border border-navy-line bg-navy p-8">
              <Button variant="brass" notch="strong">Schedule a conversation</Button>
              <Spec><span className="text-on-dark-3">variant=&quot;brass&quot; · sobre grafite</span></Spec>
            </div>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="border border-line bg-surface p-8">
              <div className="flex flex-wrap gap-1">
                <a href="#vnotch" className="vn-link">Services</a>
                <a href="#vnotch" className="vn-link" aria-current="page">Who We Serve</a>
                <a href="#vnotch" className="vn-link">Team</a>
              </div>
              <Spec>.vn-link · links do header: placa que ganha o contorno do escudo (menor intensidade)</Spec>
            </div>
            <div className="on-dark border border-navy-line bg-navy p-8">
              <div className="flex flex-wrap gap-1">
                <a href="#vnotch" className="vn-link">Services</a>
                <a href="#vnotch" className="vn-link" aria-current="page">Who We Serve</a>
              </div>
              <Spec><span className="text-on-dark-3">.vn-link sobre grafite</span></Spec>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="exploded" tone="light" bordered labelledBy="sg-xm">
        <Container>
          <SectionHeader
            id="sg-xm"
            eyebrow="05 · Família 2"
            title="Exploded Modules"
            intro="Três placas com junções a 66° (a placa central é um V). No hover, afastam-se até 3 px em direções diferentes e as junções em latão aparecem. Texto fixo. Para CTAs secundários e exploração — nunca no header."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="border border-line bg-surface p-8">
              <ModuleButton href="#exploded">Talk to our team</ModuleButton>
              <Spec>tone=&quot;light&quot;</Spec>
            </div>
            <div className="border border-line bg-surface p-8">
              <ModuleButton href="#exploded" tone="ink">Explore financial planning</ModuleButton>
              <Spec>tone=&quot;ink&quot;</Spec>
            </div>
            <div className="on-dark border border-navy-line bg-navy p-8">
              <ModuleButton href="#exploded" tone="dark">Meet the team</ModuleButton>
              <Spec><span className="text-on-dark-3">tone=&quot;dark&quot;</span></Spec>
            </div>
          </div>
          <div className="mt-6 border border-line bg-surface p-8">
            <LinkArrow href="#exploded">All services</LinkArrow>
            <Spec>.link-arrow · links de texto</Spec>
          </div>
        </Container>
      </Section>

      <Section id="movimento" tone="white" bordered labelledBy="sg-motion">
        <Container>
          <SectionHeader
            id="sg-motion"
            eyebrow="06 · Movimento"
            title="Um só sistema"
            intro="Geométrico e preciso, sem elasticidade. Controles ≤ 200 ms. Scroll nunca é sequestrado: o círculo do “Our Perspective”, a linha de planejamento e as linhas de entrada seguem a rolagem. Sem JS ou com movimento reduzido, tudo aparece completo."
          />
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line-rule text-ink-3">
                <th className="py-3 pr-4 font-medium">Token</th>
                <th className="py-3 pr-4 font-medium">Valor</th>
                <th className="py-3 font-medium">Uso</th>
              </tr>
            </thead>
            <tbody>
              {motion.map(([k, v, u]) => (
                <tr key={k} className="border-b border-line">
                  <td className="py-3 pr-4 font-mono text-xs">{k}</td>
                  <td className="py-3 pr-4">{v}</td>
                  <td className="py-3 text-ink-2">{u}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Container>
      </Section>

      <Section id="pendencias" tone="light" bordered labelledBy="sg-pend">
        <Container>
          <SectionHeader id="sg-pend" eyebrow="07 · Interno" title="Pendências da Vincit" intro="Não aparecem no site público; os componentes somem até haver dado real." />
          <div className="flex flex-wrap gap-3">
            <DraftNote code="D6">Vetor master do wordmark</DraftNote>
            <DraftNote code="D1">Texto regulatório aprovado</DraftNote>
            <DraftNote code="D8">Endereço, telefone e e-mail novos</DraftNote>
            <DraftNote code="D9">Link de agenda</DraftNote>
            <DraftNote code="D10">Número do WhatsApp</DraftNote>
            <DraftNote code="OS">Capturas aprovadas do Vincit OS</DraftNote>
          </div>
        </Container>
      </Section>
    </>
  );
}
