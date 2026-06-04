import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import CommandPalette from "./components/CommandPalette";
import CustomCursor from "./components/CustomCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://ben-eliyahu.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ben Eliyahu — Full Stack Developer & AI Engineer",
    template: "%s · Ben Eliyahu",
  },
  description:
    "Full Stack Developer & AI Engineer with 3+ years building scalable web apps with React, Next.js, Node.js, ASP.NET Core, and deep LLM integration. Explore projects, skills, and chat with an AI assistant.",
  keywords: [
    "Ben Eliyahu", "Full Stack Developer", "AI Engineer", "Next.js", "React",
    "Node.js", "TypeScript", "ASP.NET Core", "LLM", "OpenAI", "portfolio",
  ],
  authors: [{ name: "Ben Eliyahu" }],
  creator: "Ben Eliyahu",
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Ben Eliyahu — Full Stack Developer & AI Engineer",
    description:
      "Interactive 3D portfolio: projects, skills, and an AI assistant you can chat with.",
    siteName: "Ben Eliyahu",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ben Eliyahu — Full Stack Developer & AI Engineer",
    description:
      "Interactive 3D portfolio: projects, skills, and an AI assistant you can chat with.",
  },
};

export const viewport: Viewport = {
  themeColor: "#020817",
  colorScheme: "dark",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#020817] text-slate-200">
        <Preloader />
        <CustomCursor />
        <Navbar />
        <CommandPalette />
        {children}
      </body>
    </html>
  );
}
