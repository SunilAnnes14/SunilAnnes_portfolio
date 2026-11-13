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

export const metadata: Metadata = {
  title: `The Interview · ${profile.name}`,
  description: `${profile.role}. A portfolio you have to survive: a turn-based game of nerve against a hostile recruiter.`,
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
