"use client";

import { useMemo } from "react";
import { formatNaira } from "@/lib/nights";

type Booking = {
  id: string;
  ref: string;
  fullName: string;
  email: string;
  nightId: string;
  feeNaira: number;
  paymentStatus: string;
  createdAt: string;
};

type Pass = {
  id: string;
  fullName: string;
  email: string;
  plan: string;
  amountNaira: number;
  paymentStatus: string;
  createdAt: string;
};

type AnalyticsProps = {
  bookings: Booking[];
  passes: Pass[];
};

export function OpsAnalytics({ bookings, passes }: AnalyticsProps) {
  const analytics = useMemo(() => {
    const paidBookings = bookings.filter((b) => b.paymentStatus === "paid");
    const totalBookingRevenue = paidBookings.reduce((sum, b) => sum + b.feeNaira, 0);
    
    const paidPasses = passes.filter((p) => p.paymentStatus === "paid");
    const totalPassRevenue = paidPasses.reduce((sum, p) => sum + p.amountNaira, 0);
    
    const totalRevenue = totalBookingRevenue + totalPassRevenue;
    
    const bookingsByNight = paidBookings.reduce(
      (acc, b) => {
        acc[b.nightId] = (acc[b.nightId] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    
    const topNights = Object.entries(bookingsByNight)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    
    const bookingsByMonth = paidBookings.reduce(
      (acc, b) => {
        const month = new Date(b.createdAt).toLocaleDateString("en-NG", {
          month: "short",
          year: "numeric",
        });
        acc[month] = (acc[month] || 0) + b.feeNaira;
        return acc;
      },
      {} as Record<string, number>,
    );
    
    const conversionRate = bookings.length > 0 
      ? (paidBookings.length / bookings.length) * 100 
      : 0;

    return {
      totalRevenue,
      totalBookingRevenue,
      totalPassRevenue,
      avgBookingValue: paidBookings.length > 0 ? totalBookingRevenue / paidBookings.length : 0,
      topNights,
      bookingsByMonth: Object.entries(bookingsByMonth),
      conversionRate,
    };
  }, [bookings, passes]);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-2xl font-semibold">Revenue</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-signal/30 bg-signal/10 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">Total Revenue</p>
            <p className="mt-2 font-display text-3xl font-bold text-signal">
              {formatNaira(analytics.totalRevenue)}
            </p>
          </div>
          
          <div className="rounded-2xl border border-line bg-chalk-hot px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">Bookings</p>
            <p className="mt-2 font-display text-3xl font-bold">{formatNaira(analytics.totalBookingRevenue)}</p>
          </div>
          
          <div className="rounded-2xl border border-line bg-chalk-hot px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">Passes</p>
            <p className="mt-2 font-display text-3xl font-bold">{formatNaira(analytics.totalPassRevenue)}</p>
          </div>
          
          <div className="rounded-2xl border border-line bg-chalk-hot px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">Avg Booking</p>
            <p className="mt-2 font-display text-3xl font-bold">{formatNaira(analytics.avgBookingValue)}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold">Performance</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-chalk-hot px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">Conversion Rate</p>
            <p className="mt-2 font-display text-3xl font-bold">{analytics.conversionRate.toFixed(1)}%</p>
            <p className="mt-1 text-xs text-steel">Paid vs Total Bookings</p>
          </div>
          
          <div className="rounded-2xl border border-line bg-chalk-hot px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">Top Night</p>
            {analytics.topNights[0] ? (
              <>
                <p className="mt-2 font-display text-2xl font-bold">{analytics.topNights[0][0]}</p>
                <p className="mt-1 text-xs text-steel">{analytics.topNights[0][1]} bookings</p>
              </>
            ) : (
              <p className="mt-2 text-steel">No data yet</p>
            )}
          </div>
        </div>
      </section>

      {analytics.bookingsByMonth.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-semibold">Monthly Trends</h2>
          <div className="mt-4 rounded-2xl border border-line bg-chalk-hot p-5">
            <div className="space-y-2">
              {analytics.bookingsByMonth.map(([month, revenue]) => {
                const maxRevenue = Math.max(...analytics.bookingsByMonth.map(([, r]) => r));
                const width = (revenue / maxRevenue) * 100;
                
                return (
                  <div key={month} className="flex items-center gap-3">
                    <div className="w-20 text-sm font-semibold text-steel">{month}</div>
                    <div className="flex-1">
                      <div className="h-8 rounded-lg bg-fog">
                        <div
                          className="h-full rounded-lg bg-signal transition-all duration-300"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-28 text-right text-sm font-semibold">{formatNaira(revenue)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {analytics.topNights.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-semibold">Top Nights</h2>
          <div className="mt-4 divide-y divide-line rounded-2xl border border-line">
            {analytics.topNights.map(([nightId, count], index) => (
              <div key={nightId} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-4">
                  <span className="flex size-8 items-center justify-center rounded-full bg-signal/20 font-display text-sm font-bold text-signal">
                    {index + 1}
                  </span>
                  <span className="font-semibold">{nightId}</span>
                </div>
                <span className="text-sm font-semibold text-steel">{count} bookings</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
