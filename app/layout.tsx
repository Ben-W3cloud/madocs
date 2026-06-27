import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Black_Ops_One, Oswald } from "next/font/google";
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

const blackOpsOne = Black_Ops_One({
  variable: "--font-black-ops-one",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
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
  themeColor: { color: "#05080F" },
  width: "device-width",
  initialScale: 1,
};

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
      className={`${inter.variable} ${jetbrainsMono.variable} ${blackOpsOne.variable} ${oswald.variable} ${display.variable}`}
    >
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
