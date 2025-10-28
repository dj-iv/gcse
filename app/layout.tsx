import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GCSE → Japan | Study Tracker",
  description: "Your journey to Japan starts with every study session",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
