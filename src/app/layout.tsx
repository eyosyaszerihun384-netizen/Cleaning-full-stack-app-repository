import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrightNest Cleaning | A brighter kind of clean",
  description:
    "Explore home, deep, commercial, and move-in cleaning services and request a personalized estimate.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
