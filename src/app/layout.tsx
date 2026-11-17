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
    default: "PullUp.ng — Stop by for dinner",
    template: "%s · PullUp.ng",
  },
  description:
    "Invite-only small-group dinners in Lagos and Abuja. We pick the people. You show up. Not dating. Not networking. Just dinner.",
  openGraph: {
    title: "PullUp.ng — Stop by for dinner",
    description: "Curated tables of strangers in Lagos and Abuja. Invite-only.",
    type: "website",
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
