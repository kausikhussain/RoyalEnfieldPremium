import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Royal Enfield | Crafted In Motion",
  description:
    "A cinematic Royal Enfield flagship experience built around premium motion, immersive storytelling, and interactive motorcycle chapters.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
