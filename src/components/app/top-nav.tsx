"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <header className="sticky top-0 z-40">
      <div className="glass-strong border-b border-white/40">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
          {/* Marca */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="bg-brand-gradient flex h-9 w-9 items-center justify-center rounded-xl text-base font-black text-white shadow-lg shadow-indigo-500/30">
              S
            </span>
            <span className="hidden text-[15px] font-bold tracking-tight sm:block">
              Spark <span className="text-brand">Check-in</span>
            </span>
          </Link>

          {/* Abas superiores */}
          <nav className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`fluid relative rounded-full px-4 py-2 text-sm font-medium ${
                    active
                      ? "bg-white/70 text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-white/40 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-white/50 bg-white/40 px-3 py-1.5 text-xs font-medium text-muted-foreground sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px] shadow-emerald-500/60" />
              Conectado ao Spark
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
