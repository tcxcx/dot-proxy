import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Loader } from "lucide-react";

import { Providers } from "@/providers/providers";

import { fontSans, fontMono } from "@/fonts";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import { ChainInfo } from "@/components/chain/chain-info";

import "./globals.css";

export const metadata: Metadata = {
  title: "DOT Proxy Gov - Polkadot Governance Proxy Manager",
  description: "Create and manage governance proxies for secure Polkadot OpenGov participation.",
  keywords: ["Polkadot", "Governance", "Proxy", "OpenGov", "DOT", "Staking", "dApp", "Self-Hosted"],
  authors: [{ name: "DOT Proxy Gov Team" }],
  creator: "DOT Proxy Gov Team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-[family-name:var(--font-sans)] antialiased`}
      >
        <Providers>
          <Nav />
          {children}
          <Footer />
          <ChainInfo />
          <Toaster position="bottom-center" icons={{ loading: <Loader /> }} />
        </Providers>
      </body>
    </html>
  );
}
