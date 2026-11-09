import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "brass" | "brass-invert" | "secondary" | "ghost-dark" | "shield";
type Size = "sm" | "md" | "lg";
type Icon = "arrow" | "external" | "none";

type Common = {
  variant?: Variant;
  size?: Size;
  icon?: Icon;
  leading?: ReactNode;
  className?: string;
  children: ReactNode;
  /** Nome do evento de analytics (PRD §7.6), ex.: cta_schedule_click */
  event?: string;
  /** V-Notch — Vincit Shield: o contorno ganha o recorte do escudo no hover/foco. */
  notch?: "soft" | "strong";
};

type AsLink = Common & { href: string; external?: boolean; type?: never; disabled?: never; onClick?: never };
type AsButton = Common & {
  href?: undefined;
  external?: never;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

function Passage({ icon }: { icon: Icon }) {
  if (icon === "none") return null;
  const I = icon === "external" ? ArrowUpRight : ArrowRight;
  return (
    <span className="btn-icon" data-dir={icon === "external" ? "diag" : undefined} aria-hidden>
      <I strokeWidth={1.75} />
      <I strokeWidth={1.75} />
    </span>
  );
}

/**
 * Botão da casa. Animação: varredura de preenchimento + seta em "passagem" + pressão de 1 px.
 * - primary: tinta sobre claro · brass: latão sobre grafite (nunca sobre claro)
 * - secondary: contorno sobre claro · ghost-dark: contorno sobre grafite
 */
export function Button(props: AsLink | AsButton) {
  const { variant = "primary", size = "md", icon = "arrow", leading, className, children, event, notch } = props;
  const cls = cn(
    "btn",
    `btn-${variant}`,
    notch && "vn",
    notch === "strong" && "vn-strong",
    size === "sm" && "btn-sm",
    size === "lg" && "btn-lg",
    className,
  );
  const inner = (
    <>
      {leading ? <span className="inline-flex h-4 w-4 items-center justify-center" aria-hidden>{leading}</span> : null}
      <span>{children}</span>
      <Passage icon={icon} />
    </>
  );

  if (props.href !== undefined) {
    const external = props.external ?? /^https?:/.test(props.href);
    if (external) {
      return (
        <a href={props.href} className={cls} data-event={event} target="_blank" rel="noopener noreferrer">
          {inner}
        </a>
      );
    }
    return (
      <Link href={props.href} className={cls} data-event={event}>
        {inner}
      </Link>
    );
  }
  return (
    <button
      type={props.type ?? "button"}
      className={cls}
      data-event={event}
      disabled={props.disabled}
      aria-disabled={props.disabled || undefined}
      onClick={props.onClick}
    >
      {inner}
    </button>
  );
}

export function LinkArrow({
  href,
  children,
  className,
  event,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  event?: string;
}) {
  return (
    <Link href={href} className={cn("link-arrow", className)} data-event={event}>
      <span>{children}</span>
      <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
    </Link>
  );
}

/**
 * Exploded Modules — três placas que se afastam no hover revelando as junções em V.
 * Para CTAs secundários e links de exploração. Nunca no header.
 */
export function ModuleButton({
  href: to,
  children,
  tone = "light",
  className,
  event,
  external,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  tone?: "light" | "dark" | "ink";
  className?: string;
  event?: string;
  external?: boolean;
  /** Nome acessível quando o texto visível é genérico. */
  ariaLabel?: string;
}) {
  const cls = cn("xm", tone === "dark" && "xm-dark", tone === "ink" && "xm-ink", className);
  const inner = (
    <>
      <span className="xm-base" aria-hidden />
      <span className="xm-seam xm-seam-1" aria-hidden />
      <span className="xm-seam xm-seam-2" aria-hidden />
      <span className="xm-plate xm-p1" aria-hidden />
      <span className="xm-plate xm-p2" aria-hidden />
      <span className="xm-plate xm-p3" aria-hidden />
      <span>{children}</span>
      <ArrowRight className="xm-arrow h-4 w-4" strokeWidth={1.75} aria-hidden />
    </>
  );
  if (external || /^https?:/.test(to)) {
    return (
      <a href={to} className={cls} data-event={event} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={to} className={cls} data-event={event} aria-label={ariaLabel}>
      {inner}
    </Link>
  );
}
