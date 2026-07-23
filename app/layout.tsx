import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://emporiodofrango.com.br"),
  title: "Galeto temperado e frango assado em Santa Maria | Empório do Frango",
  description:
    "Galeto cru temperado, frango assado de fim de semana e marmitex no Centro de Santa Maria. Faça seu pedido pelo WhatsApp.",
  keywords: [
    "galeto temperado em Santa Maria",
    "galeto cru temperado em Santa Maria",
    "frango assado em Santa Maria",
    "frango inteiro assado em Santa Maria",
    "almoço em Santa Maria",
    "marmitex em Santa Maria",
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
    url: "https://emporiodofrango.com.br/",
    title: "Empório do Frango | Galeto temperado em Santa Maria",
    description:
      "Galeto cru já temperado para preparar em casa e frango assado de fim de semana no Centro de Santa Maria.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Empório do Frango: galeto temperado e frango assado em Santa Maria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Empório do Frango | Galeto temperado em Santa Maria",
    description: "Galeto cru temperado, frango assado e marmitex no Centro de Santa Maria.",
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
      <body>{children}</body>
    </html>
  );
}
