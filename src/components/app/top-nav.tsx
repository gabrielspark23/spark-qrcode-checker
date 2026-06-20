"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/app/theme-toggle";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/events", label: "Eventos" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="glass-strong sticky top-0 z-40">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="bg-brand-gradient flex h-9 w-9 items-center justify-center rounded-xl text-base font-black text-white shadow-sm">
            S
          </span>
          <span className="hidden text-[15px] font-bold tracking-tight text-foreground sm:block">
            Spark Check-in
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`fluid rounded-lg px-3.5 py-2 text-sm font-medium ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground sm:flex">
            <span className="h-2 w-2 rounded-full bg-[var(--success-color)] shadow-[0_0_8px] shadow-emerald-500/50" />
            Conectado ao Spark
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
