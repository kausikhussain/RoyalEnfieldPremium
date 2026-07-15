import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Royal Enfield | Pure Motorcycling",
  description: "A cinematic, immersive showcase of classic heritage and modern engineering. Experience the timeless machinery.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
