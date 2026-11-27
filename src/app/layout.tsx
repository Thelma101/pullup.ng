import type { Metadata } from "next";
import { Bricolage_Grotesque, Outfit } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PullUp — Stop by for dinner",
    template: "%s · PullUp",
  },
  description:
    "Invite-only hangouts in Lagos and Abuja. Book a seat, meet new people. Not dating. Not networking.",
  openGraph: {
    title: "PullUp — Stop by for dinner",
    description: "Curated hangouts in Lagos and Abuja. Book your seat and PullUp.",
    type: "website",
    images: [{ url: "/brand/pullup-mark.jpg", width: 512, height: 512, alt: "PullUp" }],
  },
  icons: {
    icon: [{ url: "/brand/pullup-mark.svg", type: "image/svg+xml" }],
    apple: [{ url: "/brand/pullup-mark.jpg" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bricolage.variable} ${outfit.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
