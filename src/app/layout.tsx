import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "../../components/ReactQueryProvider";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sachdeva Diagnostics",
  description: "A trusted name in diagnostic services in North West Delhi for the past 30 years, proudly collaborates with LifeCell diagnostics to extend our commitment to comprehensive healthcare.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
       <ReactQueryProvider><Header/>{children}<Footer/></ReactQueryProvider> 
      </body>
    </html>
  );
}
