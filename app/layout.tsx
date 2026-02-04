import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google"; // ❌ SUDAH BENAR DIMATIKAN
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "SMK3 Monitoring",
  description: "Sistem Manajemen K3 Telkom Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* PERBAIKAN DI SINI:
         Hapus '${geistSans.variable} ${geistMono.variable}' 
         karena variabelnya sudah tidak ada. 
         Sisakan 'antialiased' saja atau string kosong.
      */}
      <body className="antialiased">{children}</body>
    </html>
  );
}
