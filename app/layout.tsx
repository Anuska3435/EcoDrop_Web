import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Ensures Tailwind styles are applied globally

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EcoDrop - E-Waste Management System",
  description: "Recycle your electronic waste responsibly and sustainably.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-gray-900 antialiased`}>
        {/* The children prop renders the active page (login, register, home, etc.) */}
        <main>{children}</main>
      </body>
    </html>
  );
}