import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Playfair_Display, Lora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import MobileDock from "@/components/MobileDock";
import { getSiteContent } from "@/lib/cms";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  return {
    title: `${content.brand.name} | ${content.brand.tagline}`,
    description: content.footer.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getSiteContent();

  return (
    <html lang="tr" className={`${inter.variable} ${cormorant.variable} ${playfair.variable} ${lora.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="theme-smooth min-h-full flex flex-col text-slate-800 bg-cream-50 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar brandName={content.brand.name} />
          <main className="flex-1 flex flex-col pb-28 md:pb-0">{children}</main>
          <Footer content={content} />
          <MobileDock />
        </ThemeProvider>
      </body>
    </html>
  );
}