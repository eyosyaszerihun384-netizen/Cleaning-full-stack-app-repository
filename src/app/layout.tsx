import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crown Cleaning Solutions | Cleaning in Aurora & Denver",
  description:
    "Explore regular and deep cleaning services in the Aurora and Denver, Colorado area.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
