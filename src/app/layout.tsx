import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stop Feeding Brokers | Free Toolkit for Trucking Carriers",
  description:
    "See what your broker kept on every load, then get the exact scripts and tools to build direct shipper relationships. Free toolkit for small trucking carriers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} antialiased min-h-full`}>
        {children}
      </body>
    </html>
  );
}
