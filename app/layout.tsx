import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dhyan Yog Kendra Evam Prakratik Chikitsa Shodh Sansthan | Dhyan Yog Kendra Evam Prakratik Chikitsa Shodh Sansthan",
  description:
    "Dhyan Yog Kendra Evam Prakratik Chikitsa Shodh Sansthan offers yoga, meditation, and natural wellness programs designed to help you feel calmer, lighter, stronger, and more balanced. Contact: dhyanvedaglobal@gmail.com",
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
