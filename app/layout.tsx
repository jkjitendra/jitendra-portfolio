import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jitendra · Portfolio",
  description:
    "Themes, Case Studies, Tech Radar, Resume, Testimonials, Blogs",
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
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {/* This sets data-theme from localStorage BEFORE React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}