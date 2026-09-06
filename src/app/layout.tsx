import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carteles Cachito y Jose",
  description: "Generador de carteles de precios - Cachito y Jose",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
