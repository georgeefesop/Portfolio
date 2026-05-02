import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Caveat, Instrument_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/ui/Navigation";
import CustomScrollbar from "@/components/ui/CustomScrollbar";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", display: "swap", preload: false });
// Used only inside the ProjectEstimator modal - keep it lazy so it doesn't block the LCP.
const instrumentSans = Instrument_Sans({ subsets: ["latin"], weight: ["700"], variable: "--font-instrument", display: "swap", preload: false });
// Display serif for headings, eyebrows, and editorial italic accents.
const newsreader = Newsreader({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-newsreader", display: "swap" });

export const metadata: Metadata = {
  title: "efesop | Product Designer for Complex Systems",
  description: "Portfolio of George Efesop, a Product Designer specializing in Web3, Fintech, and AI systems.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme-preview');if(!t){document.documentElement.setAttribute('data-theme','light-olive');}else if(t!=='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){document.documentElement.setAttribute('data-theme','light-olive');}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${caveat.variable} ${instrumentSans.variable} ${newsreader.variable} font-sans bg-bg-primary text-text-primary antialiased`} suppressHydrationWarning>
        <Navigation />
        {children}
        <CustomScrollbar />
        <Analytics />
      </body>
    </html>
  );
}
