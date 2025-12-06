import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Jitendra · Portfolio",
  description:
    "Themes, Case Studies, Tech Radar, Resume, Testimonials, Blogs",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Provide a stable default and suppress hydration warnings for this element.
    <html lang="en" suppressHydrationWarning>
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
                    .catch(err => {
                      const errString = err.toString() + (err.message || '') + (err.stack || '');
                      if (errString.includes('wrsParams')) {
                        console.warn('Service Worker registration blocked by Webroot/Security extension. This is local to your machine and safe to ignore.');
                      } else {
                        console.error('SW registration failed:', err);
                      }
                    });
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