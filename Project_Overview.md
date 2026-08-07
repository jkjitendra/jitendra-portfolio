# Project Overview — Jitendra Portfolio

## Purpose

This document is a compact architectural and design reference for contributors and coding agents. It explains the project’s structure, the current portfolio redesign, and the decisions behind it so readers do not need to inspect every source file before making a scoped change.

The project is a personal portfolio for **Jitendra Kumar Tiwari**, a Full-Stack Engineer focused on Java, Spring Boot, React, scalable APIs, performance, reliability, and product engineering.

## Current product shape

There are two intentionally separate homepage experiences:

| URL | Experience | Preserve when changing |
| --- | --- | --- |
| `/` | Original teal profile-card landing page | Existing visual, social links, and entry behaviour |
| `/home` | New immersive cyber-editorial portfolio | Section narrative, data reuse, accessibility, and motion behaviour |

The original site routes are not removed. `/contact`, `/blogs`, `/tech-radar`, and `/codebundle` remain meaningful routes. The new `/home` is the primary in-depth portfolio experience, not a replacement that discards the older content.

## `/home` information architecture

`components/portfolio/PortfolioExperience.tsx` assembles this order:

1. **Intro** — name, role, availability, calls to action.
2. **About** — developer dossier, portrait, summary, personal statement, and metrics.
3. **Experience** — technical mission-log timeline from `data/experience.json`.
4. **Selected Work** — filterable project index from `data/personal-projects.json`.
5. **Engineering Systems** — skills and technology clusters from `data/skills-matrix.json` and `data/tech-radar.json`.
6. **Contact** — terminal form paired with a live parchment preview and footer links.

The fixed `SectionNav` links to these anchors, updates its active state through `IntersectionObserver`, links directly to the resume PDF, and becomes a compact, keyboard-operable menu below the `1024px` laptop breakpoint. Escape and selecting a destination close the menu.

## Component reference

| Component | Responsibility | Important notes |
| --- | --- | --- |
| `PortfolioExperience.tsx` | `/home` shell, skip link, short preloader, section composition | Hide the preloader for reduced-motion users |
| `SectionNav.tsx` | Fixed anchor navigation and active-section state | Uses the IDs `intro`, `about`, `experience`, `work`, `stack`, and `contact` |
| `IntroSection.tsx` | Hero copy, visual circuit field, primary CTAs | Name, technical kicker, and role use stable word-aware decoding where needed |
| `AboutSection.tsx` | Dossier, portrait, profile narrative, metrics | Uses `/public/logos/image.jpg` |
| `ExperienceTimeline.tsx` | Data-driven vertical experience timeline | Maps `experience.json`; retain readable impact points |
| `ProjectIndex.tsx` | Filtered project rows and accessible modal details | Escape closes the dialog; use existing project images/data |
| `StackSection.tsx` | Technology clusters and engineering narrative | Uses skills/radar data as source of truth |
| `ContactTerminal.tsx` | `/home` contact form, success/error state, footer links, and floating back-to-top control | The accessible up-arrow scrolls to `#intro` and respects reduced motion |
| `ContactParchment.tsx` | Reusable paper preview and submit/success animation | Used by both `/home` and legacy `/contact`; the `portfolio` variant is scoped to `/home` |
| `ScrambleText.tsx` | Reusable heading decode effect | Preserves fixed text dimensions, supports opt-in word-aware wrapping, and respects reduced motion |
| `SectionDivider.tsx` | Decorative SVG scroll handoff cue | Present on all `/home` sections except Contact |

## Design system and visual direction

The `/home` experience uses a dark cyber-editorial system rather than standard rounded-card portfolio styling.

### Core tokens

The relevant custom properties live under `.portfolio-site` in `app/globals.css`:

- Near-black/deep navy backgrounds: `--ink`, `--ink-soft`
- Off-white reading text: `--paper`
- Muted interface text and technical borders: `--muted`, `--line`
- Electric cyan: `--cyan`
- Amber and orange emphasis: `--amber`, `--orange`

The global CSS also supplies faint grid, scanline, and noise-like texture utilities. These are CSS-only and deliberately lightweight; do not replace them with continuous 3D or video backgrounds.

### Section contrast

- Intro, Experience, Stack, and Contact use dark technical backgrounds.
- About uses amber/orange for an editorial dossier effect.
- Work uses a pale paper-like background to create a clear visual reset before the dark Stack/Contact close.

Oversized Georgia-based display typography is paired with Courier-like technical labels. Small labels and form controls have been enlarged from the initial revision for readability.

## Motion and interaction decisions

### Text decoding

`ScrambleText` animates random characters into supplied text. It was designed to avoid the common layout-shift issue caused by variable-width temporary glyphs:

- A hidden final-text layer reserves the final width and line height.
- The animated text is absolutely positioned over that reserved layer.
- Default output remains `white-space: nowrap`, so existing intentional phrase-level composition stays intact.
- `wrapByWords` is an opt-in mode for phrases that must wrap on narrow screens. It renders complete final-word layout boxes and overlays the matching scrambled word in each box; spaces remain between boxes, so wrapping occurs only between complete words.
- The final words alone determine width, line height, and browser-selected line breaks. Temporary glyphs never change layout, though they may paint slightly beyond their reserved word width.
- Glyph overflow is visible so ascenders and descenders are not clipped.
- The animation runs on first entry, then can replay when a section is exited and re-entered while scrolling down.
- `prefers-reduced-motion` keeps the final text without the effect.

When adding a new decoded heading, first preserve deliberate phrase-sized `ScrambleText` calls and explicit `<br />` elements. Use `wrapByWords` only when the phrase must be responsive (the hero name, hero technical copy, and first Contact line are current examples). Do not rely on temporary glyph wrapping for layout.

### Section dividers

`SectionDivider` is decorative (`aria-hidden`) and alternates position by section:

| Section | Position |
| --- | --- |
| Intro | bottom-left |
| About | bottom-right |
| Experience | bottom-left |
| Work | bottom-right |
| Stack | bottom-left |
| Contact | none |

The three SVG chevrons pulse sequentially from muted grey to the appropriate contrast colour. Keep the Contact section free of this cue because it is the end state of the narrative.

### General motion principles

- Framer Motion handles entrance, filter, dialog, preloader, parchment, and form animations.
- Motion is supplementary, not the only way content is conveyed.
- Native anchor scrolling and `IntersectionObserver` are used instead of a heavy smooth-scroll dependency.
- `prefers-reduced-motion` disables/reduces continuous animation.

## Contact flow

The `/home` contact form collects:

- name (required)
- email (required)
- phone (optional)
- subject (required)
- message (required)

### Live preview

`ContactParchment` mirrors these values on the parchment in real time. The paper animates in from the right while the form animates in from the left. The parchment has deliberate top padding so the sender line sits below the ornamental header.

`/home` passes `variant="portfolio"` so its parchment can match the responsive form panel without changing the existing `/contact` dimensions, typography, or image sizing. The component default remains the legacy standalone-contact treatment.

### Submission states

1. **Idle**: live parchment and form remain visible.
2. **Submitting**: parchment moves through a mailbox animation.
3. **Success**: a Message Sent card appears in the right preview panel. The acknowledgement and **Send Another Message** control appear directly below that card, not inside the form.
4. **Error**: an inline error remains near the relevant contact interface.

`/api/contact` accepts the same form shape. It sends mail using Gmail/Nodemailer if `EMAIL_USER` and `EMAIL_PASS` are configured; otherwise it returns a simulated success response for local development. The subject is preserved in the email subject and message body.

## Data ownership

Avoid hardcoding portfolio facts in components if they already belong in `data/`.

| File | Used for |
| --- | --- |
| `data/personal-projects.json` | Work index rows, detail dialog content, stack tags, external project links |
| `data/experience.json` | Experience timeline |
| `data/skills-matrix.json` | Core proficiency list |
| `data/tech-radar.json` | Technology count/inventory context |
| `data/companies.json` | Existing company/orbit experience |
| `data/testimonials.json`, `data/blogs.json`, `data/case-studies.json`, `data/performance.json` | Existing and future route content |

Project screenshots and branded assets are in `public/projects/`, `public/logos/`, and `public/codebundle/`. The resume is `public/jitendra_resume.pdf`.

## Routing, layout, and SEO

- `app/page.tsx` renders the original landing page.
- `app/home/page.tsx` renders `PortfolioExperience` and declares the `/home` canonical URL.
- `components/Header.tsx` is hidden for `/home`; `SectionNav` is its dedicated navigation system.
- `app/layout.tsx` retains global metadata, theme initialisation, manifest/favicons, and body setup.
- `app/sitemap.ts`, `public/robots.txt`, and canonical metadata should remain in sync with route changes.

When adding an SEO-relevant route, include metadata and consider the sitemap/canonical impact.

## Responsive and accessibility requirements

`/home` uses a mobile-first responsive cascade scoped below `.portfolio-site`:

| Tier | Viewport | Behaviour |
| --- | --- | --- |
| Compact mobile | `320–479px` | Single-column content, reduced hero decoration, wrapped project/filter controls, stacked Contact form and parchment |
| Mobile | `480–767px` | Fluid type/spacing refinement while keeping touch-friendly single-column layouts |
| Tablet | `768–1023px` | About and Stack retain readable two-column compositions; Contact stacks for legibility; compact navigation remains active |
| Laptop | `1024–1439px` | Horizontal navigation, desktop timeline/project index, and Form \| Parchment Contact layout return |
| Large desktop | `1440px+` | Preserves the established `85rem` content cap and desktop proportions |

Use intrinsic Grid/Flex sizing, `minmax()`, `clamp()`, and dynamic viewport units rather than JavaScript viewport branching. Do not reintroduce the former `/home` `max-width: 760px` responsive system.

- Keep semantic sections and meaningful `aria-labelledby` relationships.
- Preserve the `/home` skip-to-content link.
- All controls must remain keyboard-operable: nav links/menu, filter buttons, dialog close, contact controls, and the floating back-to-top link.
- The mobile navigation and project details must be dismissible with Escape. Dialog focus returns to its opening control after close.
- Do not make any required information dependent on animation, hover, colour alone, or audio.
- Use Next/Image for local raster media and supply suitable `sizes` values.
- Keep menus and dialogs within dynamic viewport constraints (`dvh`) and safe-area insets. Their own content, not the page behind them, must scroll when needed.
- Test compact phone, phone, tablet, laptop, large desktop, short-height, and breakpoint-edge viewports before delivery. Fix the offending element when overflow occurs; do not hide it globally.
- Word-aware decoded phrases may wrap only at complete word boundaries, with stable line positions throughout the animation.

## Development workflow

```bash
npm install
npm run dev
npx tsc --noEmit
npm run build
git diff --check
```

The `next build` command is the required production-level verification. Build warnings about stale browser compatibility datasets are informational and unrelated to portfolio functionality.

## Change guidelines for future agents

1. Inspect the affected route, component, data file, and relevant CSS block before editing.
2. Reuse existing data/assets whenever practical; do not copy assets or content from design references.
3. Keep `/` and `/home` distinct unless the user explicitly requests otherwise.
4. For `/home`, make focused reusable components rather than adding a monolithic page file.
5. Maintain the contact form API payload, including `subject`.
6. Preserve footer direct-contact links and the fixed accessible up-arrow back-to-top control unless asked to change them.
7. Respect reduced motion and validate with TypeScript, production build, and `git diff --check`.
8. Treat existing uncommitted changes as user work unless they are clearly part of the assigned task.

## Historical redesign summary

The current `/home` redesign translated the interaction language of an editorial cyber portfolio into Jitendra’s engineering identity without copying reference content, assets, or exact compositions. It introduced the one-page information architecture, fixed navigation, technical texture, decode typography, vertical experience log, project index/dialogs, system-oriented technology grouping, parchment-driven contact experience, floating up-arrow return control, and alternating scroll handoff cues while retaining legacy routes and existing content sources.
