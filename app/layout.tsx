import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const display = Inter({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://africazk.io"),
  title: {
    default: "AfricaZK — ZK Identity Engine for Solana",
    template: "%s — AfricaZK",
  },
  description:
    "Africa's first Zero-Knowledge identity protocol. Verify Nigerian identity on Solana without storing personal data.",
  applicationName: "AfricaZK",
  keywords: [
    "AfricaZK",
    "Zero-Knowledge",
    "ZK Identity",
    "Solana",
    "Nigeria",
    "NIN",
    "BVN",
    "Groth16",
    "Anchor",
    "Web3 Identity",
  ],
  authors: [{ name: "AfricaZK" }],
  openGraph: {
    type: "website",
    title: "AfricaZK — ZK Identity Engine for Solana",
    description:
      "Verify once. Access everything. Africa's first Zero-Knowledge identity protocol on Solana.",
    url: "https://africazk.io",
    siteName: "AfricaZK",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AfricaZK — ZK Identity Engine for Solana",
    description:
      "Verify once. Access everything. Africa's first ZK identity protocol, built for Nigerian dApps on Solana.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#05080F" },
    { media: "(prefers-color-scheme: light)", color: "#F2F5FA" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Runs in the document <head> before React hydrates. Picks the saved
// preference (or system default) and writes data-theme on <html>, so the
// page never flashes the wrong theme. Kept tiny and dependency-free.
const THEME_INIT = `(function(){try{var s=localStorage.getItem('azk-theme');var t=s==='light'||s==='dark'?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${display.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
