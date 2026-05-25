import type { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import { Inter, JetBrains_Mono, Caveat, Instrument_Sans, Newsreader, Inconsolata, Karla, Fraunces, Figtree } from "next/font/google";
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
// Display font for the greg.efesop.com subtree only; efesop.com keeps Newsreader.
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // greg.efesop.com renders its own GregNav and uses a separate theme token
  // (`light-greg`) that the portfolio's ThemePreviewToggle does not recognise.
  // If Navigation rendered here it would paint a dark pill behind GregNav's
  // parallelogram clip-path AND its ThemePreviewToggle would strip the
  // light-greg data-theme on mount, snapping greg back to dark mode on
  // sub-page loads. Skip it entirely on the greg subdomain.
  const host = (await headers()).get('host') ?? '';
  const isGregHost = host.toLowerCase().startsWith('greg.');

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${caveat.variable} ${instrumentSans.variable} ${newsreader.variable} ${figtree.variable} ${inconsolata.variable} ${karla.variable} ${fraunces.variable} font-sans bg-bg-primary text-text-primary antialiased`} suppressHydrationWarning>
        <script src="/theme-init.js" />
        <PostHogProvider>
          {!isGregHost && <Navigation />}
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
