import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniFind - Sistema de Gestión de Objetos Perdidos",
  description: "Plataforma universitaria para la gestión y trazabilidad de objetos perdidos y encontrados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
