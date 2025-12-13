import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Web3Wrapper } from "@/components/providers/Web3Wrapper";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/providers/CartProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/ToastProvider";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SwenAutos - CAMP Network Marketplace",
  description: "Decentralized marketplace for auto spare parts on CAMP blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${manrope.className} antialiased bg-background text-foreground`}
      >
        <Web3Wrapper>
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
                <div className="relative flex min-h-screen flex-col">
                  <Navbar />
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </div>
              </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </Web3Wrapper>
        <Analytics />
      </body>
    </html>
  );
}
