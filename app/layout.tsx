import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Galeto, almoço e espetinhos em Santa Maria | Empório do Frango",
  description:
    "Galeto assado, marmitex, espetinhos, açougue e acompanhamentos no Centro de Santa Maria. Consulte o cardápio e faça seu pedido pelo WhatsApp.",
  keywords: [
    "frango assado em Santa Maria",
    "galeto assado em Santa Maria",
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
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Empório do Frango",
    title: "Empório do Frango | Galeto e almoço em Santa Maria",
    description:
      "Tudo para sua refeição, com a qualidade que você já conhece. Consulte o cardápio e peça pelo WhatsApp.",
    images: [
      {
        url: "/images/hero-frango.jpg",
        width: 893,
        height: 1190,
        alt: "Frango assado do Empório do Frango",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Empório do Frango | Santa Maria",
    description: "Galeto, almoço, espetinhos, açougue e acompanhamentos.",
    images: ["/images/hero-frango.jpg"],
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
  other: {
    "codex-preview": "development",
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
