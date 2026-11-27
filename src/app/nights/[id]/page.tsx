import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/BookingForm";
import { ShareButton } from "@/components/ShareButton";
import {
  cityLabel,
  formatLabel,
  formatNaira,
  formatNightDate,
  getNight,
  nights,
  seatsLeft,
} from "@/lib/nights";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return nights.map((n) => ({ id: n.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const night = getNight(id);
  if (!night) return { title: "Night" };
  return {
    title: `${formatLabel(night.format)} · ${cityLabel(night.city)}`,
  };
}

export default async function NightDetailPage({ params }: Props) {
  const { id } = await params;
  const night = getNight(id);
  if (!night) notFound();

  const left = seatsLeft(night);

  return (
    <div className="page-shell pt-[4.25rem]">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 md:grid-cols-2 md:px-8 md:py-20">
        <div>
          <div className="flex items-center justify-between">
            <Link href="/nights" className="text-sm font-semibold text-steel hover:text-void">
              ← All nights
            </Link>
            <ShareButton night={night} />
          </div>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-clay">
            {cityLabel(night.city)} · {night.area}
          </p>
          <h1 className="mt-4 font-display text-5xl font-bold tracking-tight">
            {formatLabel(night.format)}
          </h1>
          <p className="mt-4 text-lg text-void-soft">
            {formatNightDate(night.date)} · {night.time}
          </p>

          <dl className="mt-10 space-y-4 border-t border-line pt-8 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-steel">Seats</dt>
              <dd className="font-semibold">{left} of {night.seatsTotal} left</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-steel">Seat fee</dt>
              <dd className="font-semibold">{formatNaira(night.feeNaira)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-steel">Food &amp; drinks</dt>
              <dd className="max-w-[14rem] text-right font-semibold">
                from {formatNaira(night.minSpendNaira)} · on you at the venue
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-steel">Venue</dt>
              <dd className="max-w-[14rem] text-right font-semibold">24 hours before · area known now</dd>
            </div>
          </dl>

          <p className="mt-8 text-sm leading-relaxed text-steel">
            Table of {night.seatsTotal}. Everyone arrives alone. Seat fee is paid to PullUp; food
            &amp; drinks you settle yourself. Full refund until three days before. If the table
            doesn&apos;t fill, your seat fee comes back.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-chalk-hot p-5 md:p-8">
          {left === 0 ? (
            <p className="py-10 text-center text-steel">This table is full. Check another night.</p>
          ) : (
            <BookingForm night={night} />
          )}
        </div>
      </div>
    </div>
  );
}
