import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tectome AI Judge | Premium Coding Platform",
  description: "Master algorithms with AI-powered insights and a world-class coding environment.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-outfit bg-white dark:bg-black transition-colors duration-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
