import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://emporio-do-frango.dg5i.chatgpt.site"),
  title: "Frango assado, almoço e espetinhos em Santa Maria | Empório do Frango",
  description:
    "Frango assado, marmitex, espetinhos, açougue, acompanhamentos e entrega até Camobi no Centro de Santa Maria. Peça pelo WhatsApp ou iFood.",
  keywords: [
    "frango assado em Santa Maria",
    "frango inteiro assado em Santa Maria",
    "almoço em Santa Maria",
    "marmitex em Santa Maria",
    "espetinho em Santa Maria",
    "açougue em Santa Maria",
    "rotisserie em Santa Maria",
  ],
  applicationName: "Empório do Frango",
  authors: [{ name: "Empório do Frango" }],
  creator: "Empório do Frango",
  publisher: "Empório do Frango",
  formatDetection: {
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Empório do Frango",
    url: "https://emporio-do-frango.dg5i.chatgpt.site/",
    title: "Empório do Frango | Frango assado e almoço em Santa Maria",
    description:
      "Tudo para sua refeição, com a qualidade que você já conhece. Consulte o cardápio e peça pelo WhatsApp.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Empório do Frango: frango assado, almoço e espetinhos em Santa Maria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Empório do Frango | Santa Maria",
    description: "Frango assado, almoço, espetinhos, açougue e acompanhamentos.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/emporio-seal.svg",
    shortcut: "/emporio-seal.svg",
    apple: "/emporio-seal.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#231f20",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
