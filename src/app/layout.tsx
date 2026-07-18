import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "The AI Herbologist: Botanical Integrity & Yield Trust Portal",
  description: "Ensuring botanical purity and yield trust through AI-driven auditing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="p-4 text-center text-gray-500 text-xs border-t border-gray-800 bg-[#0a1f0c]">
              © 2026 The AI Herbologist Portal • Botanical Integrity Framework v1.0
            </footer>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
