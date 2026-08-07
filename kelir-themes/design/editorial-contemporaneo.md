---
version: "alpha"
name: "Editorial Contemporâneo"
description: "Design an artistic and immersive editorial landing page for a contemporary culture and art digital magazine. Ideal for landing pages, modern websites. AI-ready template."
colors:
  primary: "#FFFFFF"
  secondary: "#000000"
  tertiary: "#800000"
  neutral: "#333333"
  surface: "#FFD700"
  accent: "#000080"
typography:
  h1:
    fontFamily: Playfair Display
    fontSize: 2.25rem
    fontWeight: 700
  body-md:
    fontFamily: Playfair Display
    fontSize: 1rem
    fontWeight: 400
  label-caps:
    fontFamily: Playfair Display
    fontSize: 0.75rem
    fontWeight: 500
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    padding: 12px
---

## Overview

Design an artistic and immersive editorial landing page for a contemporary culture and art digital magazine. Ideal for landing pages, modern websites. AI-ready template. For years, digital magazines were just PDFs with ambition. Flipbooks, page-curl animations, the whole embarrassing theater of pretending a screen was paper. It took until roughly 2013-2015 for editorial design online to find its own voice — and that voice belonged largely to the NYT's digital features team and Bloomberg Businessweek's web presence.

The NYT's Snow Fall wasn't the first longform interactive piece, but it broke something open in the industry's imagination. Suddenly editorial meant scroll-driven narrative, typographic drama at viewport scale, and imagery that breathed between paragraphs rather than sitting trapped in columns. Bloomberg took a different angle — irreverent, almost confrontational layouts where type became illustration and whitespace became editorial stance.

What emerged from this era is contemporary editorial: design that treats the browser as a first-class publishing medium. Not print nostalgia. Not blog minimalism. A third thing — where the layout itself carries opinion, where typographic hierarchy does the work that art direction once monopolized in print.

- Density: 5/10 — Balanced
- Variance: 8/10 — Expressive
- Motion: 4/10 — Subtle

- **Style:** Artistic, Content-Rich, Immersive
- **Keywords:** magazine, culture, art, editorial, immersive, visual, sophisticated, engaging, curated, modern
- **Era:** 2026+ Visual Journalism
- **Light/Dark:** ✓ Full / ✗ No

## Colors

- **White** (#FFFFFF) — Light surface, card backgrounds
- **Black** (#000000) — Dark surface, primary background
- **Wine Red** (#800000) — Error states, destructive actions
- **Dark Grey** (#333333) — Dark surface, primary background
- **Gold** (#FFD700) — Premium accent, decorative highlights
- **Navy Blue** (#000080) — Secondary accent
- **Emerald Green** (#2ECC40) — Success states, positive indicators
- **Beige** (#F5F5DC) — Extended palette, decorative use

## Typography

- **Display / Hero:** Playfair Display — Weight 700, tight tracking, used for headline impact
- **Body:** Playfair Display — Weight 400, 16px/1.6 line-height, max 72ch per line
- **UI Labels / Captions:** Playfair Display — 0.875rem, weight 500, slight letter-spacing
- **Monospace:** JetBrains Mono — Used for code, metadata, and technical values

Scale:
- Hero: clamp(2.5rem, 5vw, 4rem)
- H1: 2.25rem
- H2: 1.5rem
- Body: 1rem / 1.6
- Small: 0.875rem

## Layout

- **Grid:** CSS Grid primary. Max-width: 1280px centered with 1.5rem side padding.
- **Spacing rhythm:** Balanced. Base unit: 0.5rem (8px).
- **Section vertical gaps:** clamp(4rem, 8vw, 8rem).
- **Hero layout:** Asymmetric composition.
- **Feature sections:** Asymmetric grid with varied card sizes. No 3-equal-columns.
- **Mobile collapse:** All multi-column layouts collapse below 768px. No horizontal overflow.
- **z-index contract:** base (0) / sticky-nav (100) / overlay (200) / modal (300) / toast (500).

## Elevation & Depth

Contrasting typographic hierarchy, a layered composition of text and image, high-quality visual content focus, decorative accents (lines, frames), micro-interactions on article focus, magazine-flip page transitions.

- **Physics:** Ease-out curves, 200-300ms duration. Smooth and predictable.
- **Entry animations:** Fade + translate-Y (16px to 0) over 420ms ease-out. Staggered cascades for lists: 80ms between items.
- **Hover states:** Subtle color shift + shadow adjustment over 200ms.
- **Page transitions:** Fade only (200ms).
- **Performance:** Only transform and opacity animated.

## Shapes

Base corner radius: 8px. See the front-matter rounded tokens for the full scale.

## Components

- **Primary Button:** Subtly rounded (0.5rem) shape. Accent color fill. Hover: 8% darken + subtle lift shadow. Active: -1px translate tactile press. Font weight 600. No outer glows.
- **Secondary / Ghost Button:** Outline variant. 1.5px border in muted color. Text in primary color. Hover: subtle background fill.
- **Cards:** Subtly rounded (0.5rem) corners. Surface background. Subtle shadow. 1px border.
- **Inputs:** Label above input. 1px border stroke. Focus ring: 2px accent color offset 2px. Error text below in semantic red. No floating labels.
- **Navigation:** Primary surface background. Active item: accent color indicator. Weight 500 when active.
- **Skeletons:** Shimmer animation matching component dimensions. No circular spinners.
- **Empty states:** Icon-based composition with descriptive text and action button.

## Do's and Don'ts

- No emojis in UI — use icons only (Lucide, Heroicons)
- No pure black (#000000) — use off-black or charcoal variants
- No over-saturation (saturation cap: 80%)
- No 3-column equal-width feature layout — use a grid or symmetric
- No `h-screen` — use `min-h-[100dvh]`
- No AI writing clichés
- No broken external images — use picsum.photos or a reminder
- No lorem ipsum placeholders in demos

## Use Case

Landing pages, Modern websites, magazines, cultural publications.