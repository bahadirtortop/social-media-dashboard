import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import Footer from '../components/footer'; // Footer bileşenini içeri aktar

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Social Media Admin Dashboard",
  description: "AI-powered content management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
        <Footer />
      </body>
    </html>
  );
}