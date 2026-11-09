import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Container({ children, className, narrow }: { children: ReactNode; className?: string; narrow?: boolean }) {
  return <div className={cn("mx-auto w-full px-5 sm:px-8", narrow ? "max-w-4xl" : "max-w-7xl", className)}>{children}</div>;
}

type Tone = "light" | "muted" | "dark" | "dark-soft" | "white";

const toneCls: Record<Tone, string> = {
  light: "bg-app text-ink",
  white: "bg-surface text-ink",
  muted: "bg-surface-muted text-ink",
  dark: "on-dark bg-navy text-on-dark",
  "dark-soft": "on-dark bg-navy-soft text-on-dark",
};

export function Section({
  children,
  tone = "light",
  className,
  id,
  labelledBy,
  bordered,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  id?: string;
  labelledBy?: string;
  bordered?: boolean;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "py-20 sm:py-28",
        toneCls[tone],
        bordered && (tone.startsWith("dark") ? "border-t border-navy-line" : "border-t border-line"),
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Eyebrow({ children, onDark, className }: { children: ReactNode; onDark?: boolean; className?: string }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3", onDark ? "text-brass" : "text-ink-2", className)}>
      <span className={cn("h-px w-6", onDark ? "bg-brass" : "bg-line-rule")} aria-hidden />
      {children}
    </p>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  id,
  onDark,
  align = "left",
  as: Tag = "h2",
  aside,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  id?: string;
  onDark?: boolean;
  align?: "left" | "center";
  as?: "h1" | "h2";
  aside?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-6 sm:mb-16 lg:flex-row lg:items-end lg:justify-between",
        align === "center" && "items-center text-center lg:flex-col lg:items-center",
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? <Eyebrow onDark={onDark} className={cn("mb-5", align === "center" && "justify-center")}>{eyebrow}</Eyebrow> : null}
        <Tag id={id} className={Tag === "h1" ? "h1" : "h2"}>
          {title}
        </Tag>
        {intro ? <p className={cn("lead mt-5", onDark ? "text-on-dark-2" : "text-ink-2")}>{intro}</p> : null}
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  );
}

/** Marca de pendência visível só no preview (decisão aberta do PRD). */
export function DraftNote({ children, code, onDark, className }: { children: ReactNode; code?: string; onDark?: boolean; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-start gap-2 rounded-[2px] border border-dashed px-2.5 py-1.5 text-xs leading-snug",
        onDark ? "border-on-dark-3/60 text-on-dark-2" : "border-line-rule text-ink-2",
        className,
      )}
    >
      {code ? <span className="font-semibold tracking-wide">{code}</span> : null}
      <span>{children}</span>
    </p>
  );
}

/** Texto com **negrito** simples. */
export function Rich({ text, strongClass }: { text: string; strongClass?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") ? (
          <strong key={i} className={cn("font-medium", strongClass)}>
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}
