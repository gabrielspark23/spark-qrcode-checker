import { cn } from "@/lib/cn";

/**
 * Escudo "V" (marca de produto do Vincit OS, PRD §8.4). Latão chapado, sem degradê.
 * Provisório até o SVG oficial (D6).
 */
export function BrandMark({
  className,
  tone = "brass",
  title,
}: {
  className?: string;
  tone?: "brass" | "ink" | "light";
  title?: string;
}) {
  const color = tone === "brass" ? "var(--color-gold)" : tone === "ink" ? "var(--text-primary)" : "var(--text-on-dark)";
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path
        d="M24 3.5 40.5 9v13.2c0 10.3-6.9 18.2-16.5 22.3C14.4 40.4 7.5 32.5 7.5 22.2V9L24 3.5Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M15.5 15.5 24 33l8.5-17.5" stroke={color} strokeWidth="2.25" strokeLinecap="square" strokeLinejoin="miter" />
      <path d="M19.75 15.5 24 24.25l4.25-8.75" stroke={color} strokeWidth="1" strokeOpacity="0.55" />
    </svg>
  );
}
