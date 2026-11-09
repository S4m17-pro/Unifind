import type { Metadata } from "next";
import { Inter, Schibsted_Grotesk } from "next/font/google";
import AppFooter from "@/components/layout/AppFooter";
import AppHeader from "@/components/layout/AppHeader";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const display = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
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
    <html lang="es" className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-screen bg-canvas font-sans text-slate-900 antialiased">
        <AppHeader />
        {children}
        <AppFooter />
      </body>
    </html>
  );
}
