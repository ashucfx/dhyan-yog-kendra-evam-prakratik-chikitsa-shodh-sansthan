import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yoga Naturopathy and Meditation | Dhyan Yog Kendra Sansthan",
  description:
    "Dhyan Yog Kendra Sansthan offers yoga, naturopathy, and meditation programs designed to help you feel calmer, lighter, stronger, and more balanced."
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
