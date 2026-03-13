import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dhyan Yog Kendra Evam Prakratik Chikitsa Shodh Sansthan | ध्यान योग केंद्र एवं प्राकृतिक चिकित्सा शोध संस्थान",
  description:
    "Dhyan Yog Kendra Evam Prakratik Chikitsa Shodh Sansthan offers yoga, meditation, and natural wellness programs designed to help you feel calmer, lighter, stronger, and more balanced.",
  icons: {
    icon: "/logo-icon.png",
    shortcut: "/logo-icon.png",
    apple: "/logo-icon.png"
  }
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
