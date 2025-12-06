import type { Config } from 'tailwindcss'
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      screens: {
        '360-380': { 'min': '360px', 'max': '380px' },
        '400-420': { 'min': '400px', 'max': '420px' },
      },
    }
  },
  plugins: []
} satisfies Config
