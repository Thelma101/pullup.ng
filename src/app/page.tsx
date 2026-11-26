import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Full-bleed hero — one composition */}
      <section className="relative min-h-[100svh] overflow-hidden bg-void text-white">
        <Image
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2400&q=80"
          alt="A warmly lit restaurant table set for dinner"
          fill
          priority
          className="anim-zoom object-cover"
          sizes="100vw"
        />
        <div className="hero-scrim absolute inset-0" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-14 pt-28 md:justify-end md:px-8 md:pb-20">
          <p className="anim-rise font-display text-[clamp(4.2rem,13vw,8.75rem)] font-extrabold leading-[0.86] tracking-[-0.045em]">
            PullUp
          </p>

          <p className="anim-rise-2 mt-5 max-w-md text-[1.05rem] leading-relaxed text-white/82 md:text-xl">
            Pull up for dinner with people you haven&apos;t met. We build the table.
            You show up.
          </p>

          <div className="anim-rise-3 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link href="/apply" className="btn-primary sm:min-w-[12rem]">
              Create account
            </Link>
            <Link href="/nights" className="btn-ghost-light sm:min-w-[10rem]">
              See nights
            </Link>
          </div>
        </div>
      </section>

      {/* Problem — one job */}
      <section className="page-shell border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <p className="max-w-3xl font-display text-3xl font-semibold leading-tight tracking-tight text-void md:text-5xl md:leading-[1.12]">
            Every weekend you realise you have nowhere to go — and nobody to randomly go with.
          </p>
          <p className="mt-6 max-w-xl text-lg text-steel">
            So we made somewhere to pull up. Small tables. New faces. No performance.
          </p>
        </div>
      </section>

      {/* Rules of the room */}
      <section className="bg-void text-chalk">
        <div className="mx-auto grid max-w-6xl gap-0 md:grid-cols-3">
          {[
            ["Everyone arrives alone", "No plus-ones. The table starts even."],
            ["Not a dating night", "Chemistry happens or it doesn’t. We don’t sell it."],
            ["Not a networking mixer", "Leave the pitch. Bring curiosity."],
          ].map(([title, body], i) => (
            <div
              key={title}
              className={`px-5 py-12 md:px-8 md:py-16 ${
                i < 2 ? "border-b border-line-light md:border-b-0 md:border-r" : ""
              }`}
            >
              <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/55">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How */}
      <section className="page-shell">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">How it works</p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
                Three moves.
              </h2>
            </div>
            <Link href="/how" className="text-sm font-semibold text-void underline underline-offset-4">
              Full walkthrough
            </Link>
          </div>

          <ol className="mt-14 divide-y divide-line border-y border-line">
            {[
              {
                n: "01",
                t: "Create account",
                d: "Short form with your email. You’re in.",
              },
              {
                n: "02",
                t: "Book & pay",
                d: "Pick a hangout. Pay the seat on Paystack — or use a Pass credit.",
              },
              {
                n: "03",
                t: "Show up",
                d: "Exact venue by email 24 hours before. Food & drinks from ₦15,000 — on you at the venue.",
              },
            ].map((step) => (
              <li
                key={step.n}
                className="grid gap-3 py-8 transition hover:bg-white/40 md:grid-cols-[6rem_14rem_1fr] md:items-baseline md:gap-8 md:px-2"
              >
                <span className="font-display text-sm font-bold text-clay">{step.n}</span>
                <h3 className="font-display text-2xl font-semibold">{step.t}</h3>
                <p className="max-w-xl text-steel">{step.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Cities with imagery */}
      <section className="bg-fog">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Two cities. Separate rooms.
          </h2>
          <p className="mt-4 max-w-xl text-steel">
            We alternate weekends so each night gets real attention — not a thin copy-paste calendar.
          </p>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {[
              {
                city: "Lagos",
                line: "Lekki to Ikeja. Island heat, mainland pace.",
                img: "/lagos-ikoyi.jpg",
                alt: "Bright Lagos waterfront and Civic Centre skyline",
              },
              {
                city: "Abuja",
                line: "Wuse to Gwarinpa. Capital calm.",
                img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1400&q=80",
                alt: "City boulevard at twilight",
              },
            ].map((c) => (
              <article
                key={c.city}
                className="group relative min-h-[22rem] overflow-hidden rounded-2xl bg-void"
              >
                <Image
                  src={c.img}
                  alt={c.alt}
                  fill
                  className="object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-80"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                  <h3 className="font-display text-4xl font-bold">{c.city}</h3>
                  <p className="mt-2 max-w-xs text-sm text-white/70">{c.line}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="bg-void text-chalk">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-5 py-24 md:flex-row md:items-end md:justify-between md:px-8 md:py-28">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl md:leading-[1.05]">
              Pull up for one night.
            </h2>
            <p className="mt-5 text-lg text-white/55">
              If the table’s good, you’ll want the next one.
            </p>
          </div>
          <Link href="/apply" className="btn-primary shrink-0">
            Create account
          </Link>
        </div>
      </section>
    </div>
  );
}
