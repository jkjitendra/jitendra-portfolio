import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Jitendra · Portfolio",
  description:
    "Themes, Case Studies, Tech Radar, Resume, Testimonials, Blogs",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
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
      var t = localStorage.getItem('theme') || 'emerald';
      document.documentElement.setAttribute('data-theme', t);
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Provide a stable default and suppress hydration warnings for this element.
    <html lang="en" data-theme="emerald" suppressHydrationWarning>
      <head>
        {/* This sets data-theme from localStorage BEFORE React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}