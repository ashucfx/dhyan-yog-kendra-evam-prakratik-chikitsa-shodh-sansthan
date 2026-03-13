import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dhyan Yog Kendra Sansthan",
  description:
    "Online yoga and meditation classes designed to help you feel calmer, lighter, stronger, and more balanced."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
