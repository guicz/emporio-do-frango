import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://emporiodofrango.com.br"),
  title: "Açougue, galeto temperado e frango assado em Santa Maria | Empório do Frango",
  description:
    "Açougue, galeto temperado, frango assado de fim de semana e marmitex no Centro de Santa Maria. Consulte o estoque pelo WhatsApp.",
  keywords: [
    "galeto temperado em Santa Maria",
    "galeto cru temperado em Santa Maria",
    "açougue em Santa Maria",
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
    title: "Empório do Frango | Açougue e rotisserie em Santa Maria",
    description:
      "Galeto temperado, opções do açougue e frango assado de fim de semana no Centro de Santa Maria.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Empório do Frango: açougue, galeto temperado e frango assado em Santa Maria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Empório do Frango | Açougue e rotisserie em Santa Maria",
    description: "Galeto temperado, opções do açougue, frango assado e marmitex no Centro de Santa Maria.",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f0e7" },
    { media: "(prefers-color-scheme: dark)", color: "#171415" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeScript = `
  (() => {
    try {
      const savedTheme = localStorage.getItem("emporio_theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const theme = savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : prefersDark ? "dark" : "light";
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch {
      document.documentElement.dataset.theme = "light";
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
