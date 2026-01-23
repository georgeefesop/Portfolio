import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/ui/Navigation";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: "efesop | Product Designer for Complex Systems",
  description: "Portfolio of George Efesop, a Product Designer specializing in Web3, Fintech, and AI systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${caveat.variable} font-sans bg-bg-primary text-text-primary antialiased`} suppressHydrationWarning>
        <Navigation />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
