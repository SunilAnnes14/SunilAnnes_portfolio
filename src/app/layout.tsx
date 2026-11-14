import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Special_Elite, VT323 } from "next/font/google";
import { profile } from "@/content/portfolio";
import "./globals.css";

const mono = IBM_Plex_Mono({
  variable: "--font-mono-ui",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const display = Special_Elite({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: "400",
});

const vt = VT323({
  variable: "--font-vt",
  subsets: ["latin"],
  weight: "400",
});

/** Absolute base for share-image URLs: set NEXT_PUBLIC_SITE_URL, or let Vercel provide its production URL. */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${profile.name} · ${profile.role}`,
  description: `${profile.headline} Portfolio of ${profile.name}, featuring The Interview: a portfolio you have to survive.`,
  openGraph: { type: "website", siteName: profile.name },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#060708",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${mono.variable} ${display.variable} ${vt.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#060708] font-mono text-stone-200">{children}</body>
    </html>
  );
}
