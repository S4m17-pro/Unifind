import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import AppFooter from "@/components/layout/AppFooter";
import AppHeader from "@/components/layout/AppHeader";
import InPageNav from "@/components/layout/InPageNav";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "UniFind — Objetos perdidos | Universidad Libre Barranquilla",
    template: "%s | UniFind",
  },
  description:
    "Plataforma de Universidad Libre Barranquilla para la custodia, reclamo y entrega de objetos perdidos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${sourceSerif.variable}`}>
      <body className="min-h-screen bg-canvas font-sans text-ink antialiased">
        <AppHeader />
        <InPageNav />
        {children}
        <AppFooter />
      </body>
    </html>
  );
}
