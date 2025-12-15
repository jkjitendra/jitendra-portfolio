import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Dancing_Script } from "next/font/google";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Jitendra · Portfolio",
  description:
    "Projects, Tech Radar, Resume",
  metadataBase: new URL("https://www.jkjitendra.in"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Jitendra · Portfolio",
    description: "Projects, Tech Radar, Resume",
    url: "https://www.jkjitendra.in",
    siteName: "Jitendra Portfolio",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logos/jk_favicon.png", type: "image/png" },
    ],
    apple: "/logos/jk_favicon.png",
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0b5fff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b5fff" },
  ],
};

// Runs before React hydration to ensure SSR/CSR match for data-theme.
const themeInit = `
  (function() {
    try {
      var savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        // If user has a saved preference, use it
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        // No saved theme, apply default based on screen size
        // (767px is just under the 'md' breakpoint of 768px)
        var isMobile = window.matchMedia("(max-width: 767px)").matches;
        var defaultTheme = isMobile ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', defaultTheme);
      }
    } catch (e) {}
  })();
`;

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-handwriting",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Provide a stable default and suppress hydration warnings for this element.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* This sets data-theme from localStorage BEFORE React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />

        {/* Register the service worker for image caching */}

      </head>
      <body className={`antialiased ${dancingScript.variable}`} suppressHydrationWarning>
        <Header />
        {children}
      </body>
    </html>
  );
}