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

import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Toaster position="bottom-right" />
        {children}
      </body>
    </html>
  );
}
