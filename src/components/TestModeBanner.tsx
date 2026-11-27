"use client";

export function TestModeBanner() {
  const isTest = process.env.NEXT_PUBLIC_TEST_MODE === "true";
  
  if (!isTest) return null;

  return (
    <div className="bg-signal/90 px-4 py-2 text-center text-sm font-semibold text-white">
      🧪 TEST MODE: All bookings are ₦2,000 for testing
    </div>
  );
}
