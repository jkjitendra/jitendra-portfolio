# Jitendra Kumar Tiwari — Portfolio

A Next.js personal portfolio for **Jitendra Kumar Tiwari**, a Full-Stack Engineer specialising in Java, Spring Boot, React, reliable systems, and product-focused engineering.

The project has two complementary entry experiences:

- `/` — the original compact profile-card landing page.
- `/home` — the immersive, scroll-based editorial portfolio with project discovery, motion, and a terminal-inspired contact flow.

For an architectural guide and the reasoning behind the redesign, see [Project_Overview.md](Project_Overview.md).

## Highlights

- Single-page portfolio journey at `/home`: Intro, About, Experience, Selected Work, Engineering Systems, and Contact.
- Dark cyber-editorial visual language: technical grid/scanline texture, cyan and amber accents, oversized serif display type, and data-like labels.
- Direction-aware text decoding: headings scramble into their final copy on entry and replay when re-entered while scrolling down. It respects `prefers-reduced-motion`.
- Accessible fixed section navigation with active-section tracking, a mobile menu, skip link, and resume download.
- Project Index with category filtering, animated transitions, keyboard-dismissible project-detail dialogs, and GitHub/live links.
- Parchment-backed contact preview that mirrors form fields in real time, animates on submission, and supports a “send another message” action.
- Existing portfolio pages, resume, tech radar, blogs, and CodeBundle routes remain available.

## Technology

- Next.js 16 App Router + React 19
- TypeScript
- Tailwind CSS and custom CSS design tokens/utilities
- Framer Motion
- Next/Image optimisation
- Nodemailer contact API

## Run locally

```bash
npm install
npm run dev
```

Then visit:

- [http://localhost:3000](http://localhost:3000) for the original landing page.
- [http://localhost:3000/home](http://localhost:3000/home) for the redesigned portfolio.

## Environment variables

The contact endpoint works in simulation mode when credentials are absent. To send email through Gmail, add the following to `.env.local`:

```bash
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-gmail-app-password
```

Use a Gmail app password rather than an account password. The API sends to `EMAIL_USER` and sets the visitor’s email as the reply-to address.

## Validation

```bash
npx tsc --noEmit
npm run build
git diff --check
```

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Original profile-card landing page |
| `/home` | Immersive one-page portfolio redesign |
| `/contact` | Legacy standalone contact page with parchment preview |
| `/blogs` | Blog listing |
| `/tech-radar` | Technology radar |
| `/codebundle` | CodeBundle product page |

## Data and content

Portfolio content is intentionally data-driven. The main data files live in `data/`:

- `personal-projects.json` — Selected Work project rows and detail panels.
- `experience.json` — Experience timeline entries.
- `skills-matrix.json` and `tech-radar.json` — Engineering Systems section.
- `companies.json`, `testimonials.json`, `blogs.json`, and related files — existing routes and components.

Images, logos, project screenshots, and the resume PDF are in `public/`.

## Project map

```text
app/
  page.tsx                     Original landing page
  home/page.tsx                Immersive portfolio entry
  api/contact/route.ts         Contact email endpoint
  contact/, blogs/, tech-radar/, codebundle/

components/
  portfolio/                   Reusable /home sections and interactions
  ContactParchment.tsx         Live paper preview used by both contact experiences
  LandingPageClient.tsx        Original root landing experience

data/                          Portfolio content JSON
public/                        Images, logos, screenshots, resume, static assets
Project_Overview.md            Architecture and design-decision reference
```

## Deployment and SEO

The root metadata, canonical URLs, sitemap, robots file, manifest, favicons, and Open Graph setup are retained. The production site is available at [jkjitendra.in](https://www.jkjitendra.in).

## License

MIT License © 2026 Jitendra Kumar Tiwari
