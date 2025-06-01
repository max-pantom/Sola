'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect } from 'react';
import { metadata } from "./metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    fetch('/api/collect', {
      method: 'POST',
      body: JSON.stringify({
        path: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
  }, []);

  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title> {/* Example usage of metadata */}
        <meta name="description" content={metadata.description}/> {/* Example usage of metadata */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
