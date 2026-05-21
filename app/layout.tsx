import type { Metadata } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono, Caveat, Instrument_Sans, Newsreader, Inconsolata, Karla, Fraunces } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/ui/Navigation";
import CustomScrollbar from "@/components/ui/CustomScrollbar";
import { Analytics } from "@vercel/analytics/react";
import PostHogProvider from "@/components/analytics/PostHogProvider";

const GA_MEASUREMENT_ID = "G-3NC98CZMC6";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", display: "swap", preload: false });
// Used only inside the ProjectEstimator modal - keep it lazy so it doesn't block the LCP.
const instrumentSans = Instrument_Sans({ subsets: ["latin"], weight: ["700"], variable: "--font-instrument", display: "swap", preload: false });
// Display serif for headings, eyebrows, and editorial italic accents.
const newsreader = Newsreader({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-newsreader", display: "swap" });
const inconsolata = Inconsolata({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inconsolata", display: "swap", preload: false });
const karla = Karla({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-karla", display: "swap", preload: false });
const fraunces = Fraunces({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-fraunces", display: "swap", preload: false });

export const metadata: Metadata = {
  title: "efesop | Product Designer for Complex Systems",
  description: "Portfolio of George Efesopoulos, a Product Designer specializing in Web3, Fintech, and AI systems.",
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
            __html: `(function(){try{var t=localStorage.getItem('theme-preview');if(t&&t!=='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${caveat.variable} ${instrumentSans.variable} ${newsreader.variable} ${inconsolata.variable} ${karla.variable} ${fraunces.variable} font-sans bg-bg-primary text-text-primary antialiased`} suppressHydrationWarning>
        <PostHogProvider>
          <Navigation />
          {children}
          <CustomScrollbar />
          <Analytics />
        </PostHogProvider>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
