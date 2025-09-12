import type { Metadata } from "next";
import { Gabarito } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/custom/index/nav";
const gabarito = Gabarito({
  variable: "--font-gabarito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DisCode",
  description:
    "DisCode. A web application wherein you can run & compile your code script.",
  openGraph: {
    type: "website",
    url: "http://localhost:3000",
    title: "DisCode",
    description:
      "DisCode. A web application wherein you can run & compile your code script.",
    images: [
      {
        url: "/discode-banner.png",
        width: 1200,
        height: 630,
        alt: "DisCode",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "http://localhost:3000", //locally muna
    title: "DisCode",
    description:
      "DisCode. A web application wherein you can run & compile your code script.",
    images: ["/discode-banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${gabarito.className} antialiased`}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
