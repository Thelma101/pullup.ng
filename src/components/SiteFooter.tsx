import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-chalk">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 md:grid-cols-[1.5fr_1fr_1fr] md:px-8">
        <div>
          <p className="font-display text-2xl font-bold tracking-tight">
            PullUp<span className="text-clay">.ng</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-steel">
            Pull up for dinner in Lagos or Abuja. Invite-only tables, built on purpose.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-steel">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link className="hover:text-clay" href="/">Home</Link></li>
            <li><Link className="hover:text-clay" href="/how">How it works</Link></li>
            <li><Link className="hover:text-clay" href="/nights">Upcoming hangouts</Link></li>
            <li><Link className="hover:text-clay" href="/fee">Pricing &amp; Pass</Link></li>
            <li><Link className="hover:text-clay" href="/community">WhatsApp community</Link></li>
            <li><Link className="hover:text-clay" href="/safety">Safety</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-steel">Contact</p>
          <ul className="mt-4 space-y-2.5 text-sm text-void-soft">
            <li>
              <a className="hover:text-clay" href="mailto:hello@pullup.ng">
                hello@pullup.ng
              </a>
            </li>
            <li>Lagos · Abuja</li>
            <li>Ages 21+</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-steel md:flex-row md:justify-between md:px-8">
          <p>© 2026 PullUp.ng</p>
          <p>Not dating. Not networking. Just dinner.</p>
        </div>
      </div>
    </footer>
  );
}
