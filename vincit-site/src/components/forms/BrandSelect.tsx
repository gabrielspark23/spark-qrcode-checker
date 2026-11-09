"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

type Option = { value: string; label: string; disabled?: boolean };

/**
 * Dropdown com a identidade da Vincit (substitui o <select> nativo, cuja lista não aceita estilo).
 * Padrão "select-only combobox" da WAI-ARIA: botão com role=combobox + listbox; teclado completo
 * (setas, Home/End, Enter/Espaço, Esc, Tab, busca por letra). O valor vai no formulário por um input oculto.
 */
export function BrandSelect({
  id,
  name,
  options,
  defaultValue = "",
  placeholder = "—",
  invalid,
  describedBy,
  required,
}: {
  id: string;
  name: string;
  options: Option[];
  defaultValue?: string;
  placeholder?: string;
  invalid?: boolean;
  describedBy?: string;
  required?: boolean;
}) {
  const listId = useId();
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const typed = useRef({ q: "", t: 0 });

  const choices = options.filter((o) => !o.disabled);
  const current = options.find((o) => o.value === value);

  const show = (index?: number) => {
    const i = index ?? Math.max(0, choices.findIndex((o) => o.value === value));
    setActive(i);
    setOpen(true);
  };
  const pick = (i: number) => {
    const o = choices[i];
    if (o) setValue(o.value);
    setOpen(false);
    btn.current?.focus();
  };

  // fecha ao clicar fora
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // mantém a opção ativa visível
  useEffect(() => {
    if (!open) return;
    list.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = choices.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) show();
        else setActive((a) => Math.min(last, a + 1));
        return;
      case "ArrowUp":
        e.preventDefault();
        if (!open) show();
        else setActive((a) => Math.max(0, a - 1));
        return;
      case "Home":
        if (open) { e.preventDefault(); setActive(0); }
        return;
      case "End":
        if (open) { e.preventDefault(); setActive(last); }
        return;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) pick(active);
        else show();
        return;
      case "Escape":
        if (open) { e.preventDefault(); setOpen(false); }
        return;
      case "Tab":
        if (open) pick(active);
        return;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const now = Date.now();
          typed.current.q = (now - typed.current.t > 700 ? "" : typed.current.q) + e.key.toLowerCase();
          typed.current.t = now;
          const i = choices.findIndex((o) => o.label.toLowerCase().startsWith(typed.current.q));
          if (i >= 0) {
            if (open) setActive(i);
            else setValue(choices[i].value);
          }
        }
    }
  };

  return (
    <div ref={wrap} className="bsel relative">
      <input type="hidden" name={name} value={value} />
      <button
        ref={btn}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        className={cn("field bsel-btn", !current?.value && "text-ink-3")}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKey}
      >
        <span className="truncate">{current?.value ? current.label : placeholder}</span>
        <svg className="bsel-chev" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <ul
        ref={list}
        id={listId}
        role="listbox"
        tabIndex={-1}
        aria-labelledby={id}
        className="bsel-list"
        data-open={open || undefined}
        hidden={!open}
      >
        {choices.map((o, i) => (
          <li
            key={o.value}
            id={`${listId}-${i}`}
            data-i={i}
            role="option"
            aria-selected={o.value === value}
            data-active={i === active || undefined}
            className="bsel-opt"
            onPointerMove={() => setActive(i)}
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => pick(i)}
          >
            <span>{o.label}</span>
            {o.value === value ? (
              <svg className="bsel-v" viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden>
                <path d="M2 3 8 13.5 14 3" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
