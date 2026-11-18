"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/how", label: "How it works" },
  { href: "/nights", label: "Hangouts" },
  { href: "/me", label: "My seat" },
  { href: "/fee", label: "Fee" },
  { href: "/safety", label: "Safety" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const onHome = pathname === "/";
  const inverted = onHome && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        inverted
          ? "bg-transparent"
          : "border-b border-line bg-chalk/90 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className={`font-display font-bold tracking-tight ${
            inverted ? "text-white" : "text-void"
          }`}
          aria-label="PullUp.ng home"
        >
          {inverted ? (
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/25 text-sm">
              P<span className="text-signal">.</span>
            </span>
          ) : (
            <span className="text-[1.35rem]">
              PullUp<span className="text-clay">.ng</span>
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[0.92rem] transition ${
                inverted
                  ? pathname === link.href
                    ? "text-white"
                    : "text-white/65 hover:text-white"
                  : pathname === link.href
                    ? "font-semibold text-void"
                    : "text-steel hover:text-void"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/apply"
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              inverted
                ? "bg-signal text-signal-ink hover:bg-[#14b8a6]"
                : "bg-void text-chalk hover:bg-void-soft"
            }`}
          >
            Join
          </Link>
        </nav>

        <button
          type="button"
          className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border md:hidden ${
            inverted ? "border-white/25 text-white" : "border-line text-void"
          }`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="flex w-4 flex-col gap-1.5">
            <span className={`h-px w-full bg-current transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-px w-full bg-current transition ${open ? "opacity-0" : ""}`} />
            <span className={`h-px w-full bg-current transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-chalk px-5 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-base font-medium text-void-soft">
                {link.label}
              </Link>
            ))}
            <Link href="/apply" className="btn-primary mt-2 w-full">
              Join
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
