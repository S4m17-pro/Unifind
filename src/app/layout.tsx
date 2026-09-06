import type { Metadata } from "next";
import AppFooter from "@/components/layout/AppFooter";
import AppHeader from "@/components/layout/AppHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniFind - Sistema de Gestión de Objetos Perdidos",
  description:
    "Plataforma de Universidad Libre Barranquilla para la custodia, reclamo y entrega de objetos perdidos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <AppHeader />
        {children}
        <AppFooter />
      </body>
    </html>
  );
}
