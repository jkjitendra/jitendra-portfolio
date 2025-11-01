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
      var savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        // If user has a saved preference, use it
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        // No saved theme, apply default based on screen size
        // (767px is just under the 'md' breakpoint of 768px)
        var isMobile = window.matchMedia("(max-width: 767px)").matches;
        var defaultTheme = isMobile ? 'sapphire' : 'emerald';
        document.documentElement.setAttribute('data-theme', defaultTheme);
      }
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

        {/* Register the service worker for image caching */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('SW registered:', reg.scope))
                    .catch(err => console.error('SW registration failed:', err));
                });
              }
            `,
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}