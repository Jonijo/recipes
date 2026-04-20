import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Recipes — a warm little cookbook",
    template: "%s · Recipes",
  },
  description:
    "A modern cookbook for everyday cooking. Seasonal recipes, slow dinners, weekend bakes — browse, search, and save the ones you'll cook again.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">
        <Nav />
        {children}
      </body>
    </html>
  );
}
