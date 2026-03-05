import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* =========================
   VIEWPORT (REQUIRED)
========================= */
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

/* =========================
   GLOBAL SEO METADATA
========================= */
export const metadata: Metadata = {
  metadataBase: new URL("https://rhfpakistan.com"), // 🔥 use your REAL domain

  title: {
    default:
      "Regional Heritage & Food of Pakistan | Culture, Cuisine, Travel & Traditions",
    template: "%s | Regional Heritage of Pakistan",
  },

  description:
    "Discover Pakistan’s regional heritage, traditional foods, authentic restaurants, highway cafés, regional products, health insights, and cultural travel destinations across the country.",

  applicationName: "Regional Heritage & Food of Pakistan",
  authors: [{ name: "Muhammad Awais" }],
  generator: "Next.js",

  keywords: [
    "regional heritage food Pakistan",
    "traditional pakistani food",
    "homemade recipes",
    "desi cooking",
    "traditional food Pakistan",
    "pakistani culture",
    "traditional restaurants Pakistan",
    "highway cafes Pakistan",
    "regional products Pakistan",
    "pakistani cuisine",
    "tourist places Pakistan",
    "cultural travel Pakistan",
    "health and food Pakistan",
    "recipes",
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Regional Heritage & Food of Pakistan | Culture, Cuisine & Travel",
    description:
      "Explore Pakistan’s rich heritage including traditional foods, regional restaurants,authentic Pakistani recipes including traditional, homemade regional dishes, highway cafés , cultural products, health insights, and travel destinations.",
    url: "https://rhfpakistan.com",
    siteName: "Regional Heritage & Food of Pakistan",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Regional Heritage & Food of Pakistan",
      },
    ],
    locale: "en_PK",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Regional Heritage & Food of Pakistan | Culture & Traditions",
    description:
      "Discover traditional foods, regional culture, restaurants, travel destinations, and heritage of Pakistan.",
    images: ["/og-image.png"],
  },

  category: "Culture, Food & Travel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50  text-gray-800`}
      >
        <Providers>
          <Navbar />
          <main className="pt-20">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
