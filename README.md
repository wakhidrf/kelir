<!-- kelir-doc: intro -->
# Project Kelir

Project Kelir is a multi-theme design system for Next.js and TypeScript: one set of accessible components that re-skins itself into eleven different design languages, so you ship a polished, consistent interface without writing CSS.

## Why teams pick Kelir

- **One codebase, eleven looks.** Move the whole app between eleven design languages - glassmorphism, neumorphism, spatial UI, and more - with a single choice. No forks, no duplicate components.
- **Accessible from day one.** Keyboard navigation, focus traps, screen-reader announcements, and labelled controls are built into every component, so you never retrofit accessibility later.
- **Nothing to style by hand.** You pass content and behaviour; colours, spacing, radius, shadows, and fonts come from the active theme, so the interface stays consistent as it grows.
- **Fonts that stay fast.** Theme fonts are hosted with the kit and preloaded only when a theme uses them - no third-party font CDN and no render-blocking request on a cold visit.
- **Static-friendly.** Serve the theme from a cookie for a server-rendered first paint, or from the browser so public pages stay cached on a CDN.

## Frequently asked questions

**Do I need to know CSS?** No. You pick from fixed, documented options - for example a button's variant - and the theme handles the visuals.

**Will it fit an existing app?** Kelir is built for Next.js with TypeScript and works best on a clean slate. Start by removing any other UI kit, such as Tailwind, so the two do not clash.

**Can I add my own branding?** The eleven themes are the supported set. You can set a brand font and two brand colours without touching component code.

## Support the project

Project Kelir is free and open source. If it saves you time, consider buying me a Ko-fi or starring it on GitHub - both links are in the site header.

<!-- kelir-doc: install -->

## Getting started

1. **Add the kit to your project** as a Git submodule under `src/views/kelir`.
2. **Wrap your app in the provider** so every component picks up the active theme.
3. **Drop components into a page** and flip the theme to watch the whole app re-skin at once.

## For developers

### Requirements

Next.js with TypeScript, plus these core packages:

```bash
npm install @emotion/react @emotion/styled @mui/material @mui/icons-material
```

### Add Kelir as a submodule

```bash
git submodule add https://github.com/wakhidrf/kelir.git src/views/kelir
git submodule update --init --recursive
```

The submodule is pinned to the commit you add. Pull newer kit versions later with `git submodule update --remote src/views/kelir`.

### Install the provider

Place `KelirProvider` in the root layout. By default the theme is server-driven: the layout reads the saved theme cookie and lays it onto `<html>` so the first paint is already themed - no flash, no client script, no localStorage.

```tsx
// src/app/layout.tsx (Server Component)
import { cookies } from "next/headers";
import { KelirProvider } from "@/views/kelir/kelir-provider";
import { THEME_COOKIE } from "@/views/kelir/kelir-styles";
import type { Theme } from "@/views/kelir/kelir-types";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const stored = cookieStore.get(THEME_COOKIE)?.value;
  const theme: Theme = stored ? (stored as Theme) : "neumorphism";

  return (
    <html lang="en" data-kelir-theme={theme} suppressHydrationWarning>
      <body>
        <KelirProvider defaultTheme={theme}>{children}</KelirProvider>
      </body>
    </html>
  );
}
```

Persist the choice with a Server Action that writes the cookie:

```tsx
// src/controllers/theme-actions.ts
"use server";

import { cookies } from "next/headers";
import { THEME_COOKIE } from "@/views/kelir/kelir-styles";
import type { Theme } from "@/views/kelir/kelir-types";

export async function persistThemeCookie(theme: Theme) {
  const cookieStore = await cookies();
  cookieStore.set(THEME_COOKIE, theme, {
    path: "/",
    sameSite: "lax",
    maxAge: 31536000,
  });
}
```

**Static public pages.** When the root layout must stay static (SSG/CDN) and cannot read cookies, pass `themeMode="client"`. The theme is then stored in the browser and applied before first paint by a tiny inline script - no cookie and no server round-trip.

**No switcher, no saved theme.** The theme cookie is kept only while a theme picker is mounted, so a shared origin never leaks a stale choice.

### Use components

Import straight from the kit and lay out with kit primitives instead of styled `div`s:

```tsx
import { Button } from "@/views/kelir/kelir-components/button";
import { Stack } from "@/views/kelir/kelir-components/stack";

export default function Example() {
  return (
    <Stack direction="row" gap="md">
      <Button variant="primary">Click me</Button>
    </Stack>
  );
}
```

### Rules of the road

- You provide content, options, data, and handlers; the theme owns every visual.
- Never style from the outside - no `style`/`sx`/`className`, no raw colours or sizes, no `slotProps`.
- Pass only the values shown on each component's card in the Showcase; an invented value will not render.
- Lay out with kit primitives (`Stack`, `Grid`, `Spacer`), not plain wrappers.

### Consistency gates

Kelir ships static checks that run from your project with `npm run kelir`: a contract guard, an anti-slop filter, an adoption check, and optional performance and data-fetching audits. Every check prints the same report table and pins a known-good version, so you always know which rules ran.

### Per-theme fonts

Each design language carries its own typography, and the fonts ship with the kit - never a third-party stylesheet. Four families cover all eleven themes: JetBrains Mono everywhere as the monospace face, plus Playfair Display, Poppins, and Exo 2 as the text face for one theme each. All four are under the SIL Open Font License 1.1; the licence text ships in `fonts/LICENSE.md`.

---

<!-- kelir-doc: components -->
## Complete List of 86 Project Kelir Components

Project Kelir has **86 components** organized into several main categories to make it easier to design structured and consistent user interfaces.

### 1. Inputs & Forms
Components that capture user interaction and data input with integrated controls.

1. **Button**: Displays an interactive button that follows the active theme, with the shared closed KitSize scale (xs = in-table row action; lg roomy; xl..3xl degrade to lg).
2. **Button Group**: A container for grouping related buttons with consistent rounded corners.
3. **Checkbox**: A binary choice with a label and check visualization.
4. **Combobox**: An auto-complete text input with a list of suggested options.
5. **Date Picker**: An interactive date picker in a popover calendar with inline month-grid and year-list navigation.
6. **Field**: Combines label, control, and helper text for an accessible form.
7. **Input**: A basic text input for forms with integrated styling.
8. **IconButton**: An icon-only button with a required accessible label, with the shared closed KitSize scale (xs tightest, lg..3xl share the lg frame).
9. **Input Group**: Combines a text input with additional icons or action buttons at the start/end (prefix/suffix).
10. **Input OTP**: A one-time password input component with user-friendly copy-paste functionality.
11. **Label**: An accessible text label directly connected to an input control element.
12. **Native Select**: A native HTML select element styled to match the Project Kelir design language.
13. **Radio Group**: A collection of single-choice options where only one option can be active at a time.
14. **Select**: Displays an interactive list of choices triggered by a trigger button. Opening it never shifts the page layout.
15. **Slider**: A horizontal drag control for determining a value within a given range.
16. **Switch**: A binary toggle with clear active transition visual feedback.
17. **Textarea**: A resizable multi-line text input field.
18. **Toggle**: A two-state binary button (on/off) for quick switching.
19. **Toggle Group**: A container holding multiple Toggle buttons for single or multiple selection.
20. **Questionnaire**: A multi-step questionnaire with single-choice, multiple-choice, freeform, and skippable questions, complete with a progress indicator and a completion screen.

### 2. Data Display
Components for displaying static data, visualizations, and message structures.

21. **Accordion**: A stacked vertical content panel that can be collapsed or expanded.
22. **Aspect Ratio**: A container that enforces the dimensional proportion of content (such as images or video).
23. **Attachment**: A file attachment viewer with metadata, upload status, and a remove button.
24. **Avatar**: A visual representation of a user profile as an image or an initials text fallback, with a framed variant for logos.
25. **Badge**: A small colored label used to mark a status or category.
26. **Bubble**: A conversation message bubble supporting sent/received variants, reactions, and collapse-expand.
27. **Calendar**: A monthly calendar for day navigation and single-date selection.
28. **Card**: An information container panel consisting of a header, sub-header, body, and footer.
29. **Carousel**: A horizontal content player with swipe effects and smooth transitions.
30. **Chart**: Graphical data visualizations (Bar, Line, Area) rendered as kit-owned SVG with an optional title.
31. **Code Block**: A code block with a kit-owned language label and copy button, plus a clipboard fallback.
32. **Collapsible**: A collapsible (collapse-expand) content panel for hiding or showing additional details.
33. **Data Table**: A data table with pagination and an optional title.
34. **Empty**: An appealing visual state for marking when data or content is empty.
35. **Hover Card**: A preview card with additional content that appears when hovering over a link.
36. **Item**: A versatile row component for lists, presenting media, title, description, and action buttons.
37. **Kbd**: Displays keyboard shortcuts with an aesthetic physical keyboard style.
38. **List**: A semantic list with kit-owned markers, spacing, and color, switchable between bullet and numbered.
39. **Marker**: A status line marker, conversation separator, or labeled line divider in chats.
40. **Message**: A message row component in a chat history complete with send time and status.
41. **Message Scroller**: A smart chat scroll container that stabilizes new message position and loads history smoothly.
42. **Progress**: A linear progress bar indicator for task completion.
43. **Quote**: A blockquote with a kit-owned accent bar, surface, and radius.
44. **Scroll Area**: A container with a custom scrollbar optimized for cross-browser consistency.
45. **Separator**: A horizontal or vertical divider line between content elements with an optional labeled text.
46. **Table**: A basic responsive table structure for presenting organized row-column data, with `density?` (`default`|`compact`) for dense multi-column data.
47. **Tabs**: Tab-based content navigation for dividing information into separate panels.
48. **Typography**: Dedicated text styling for headings, paragraphs, and small labels for consistency, with inline decorative segments for one heading.

### 3. Navigation
Components that guide user movement while exploring the application.

49. **Breadcrumb**: A trail of the active page hierarchy as a guide for navigating back.
50. **Command**: A command-palette style quick search dialog and instant command actions.
51. **Menubar**: A persistent horizontal menu bar presenting a list of quick commands.
52. **Navigation Menu**: A collection of the application's main navigation links with an active indicator.
53. **Pagination**: Page-splitting controls for data to make browsing large data volumes easier.
54. **Sidebar**: A customizable side navigation panel with header, menu body, and footer.

### 4. Feedback & Overlays
Components for status notifications, interruption dialogs, and floating guides.

55. **Alert**: Contextual warnings to draw important user attention (info, success, critical).
56. **Alert Dialog**: A critical interruption modal dialog that requires a confirmation decision from the user. Opening it never shifts the background page.
57. **Context Menu**: A floating action menu that appears when the user right-clicks on a certain area.
58. **Dialog**: A modal window overlaid on the main screen for focused tasks. Opening it never shifts the background page.
59. **Drawer**: An overlay panel that slides in from the edge of the screen (usually the bottom or side).
60. **Dropdown Menu**: A floating list of actions triggered by pressing a menu button (`triggerVariant?` `text|button`, default `text`).
61. **Popover**: A floating information balloon with rich content triggered when an element is clicked.
62. **Sheet**: A side-sliding dialog extension for displaying supporting data.
63. **Spinner**: A smooth circular loading indicator.
64. **Toast**: A brief notification message that appears temporarily at the corner of the screen.
65. **Toaster**: A global notification queue that renders `Toast` for calls from `useToast`, with kit-owned order, duration, live region, and queue limit.
66. **Tooltip**: A mini text explanation that appears when hovering over an element.

### 5. Layout
Components that shape the structure and placement of elements.

67. **Direction**: A context provider for text reading direction (LTR - Left to Right, or RTL - Right to Left).
68. **Grid**: A responsive column grid with closed column and gap unions.
69. **Resizable**: A layout panel whose size can be dynamically adjusted with draggable dividers.
70. **Skeleton**: An animated dimming-brightening placeholder frame for empty elements as a visualization before data finishes loading.
71. **Spacer**: A fixed-gap whitespace primitive with a closed size union.
72. **Stack**: A vertical/horizontal stack primitive with closed gap, direction, align, and justify unions, plus a full-screen min height and wide-screen order reversal.
73. **Container**: A page-width containment primitive with closed maxWidth and padding unions from layout tokens.
74. **Image**: A neutral media primitive with closed height, fit, and radius unions, an optional fluid mode with px width cap, and no shadow/border by default.
75. **FlexItem**: A flex-item control primitive paired with Stack, with closed boolean grow, shrink, and clip unions, plus a token-based upward offset.
76. **Shell**: A viewport app-shell primitive with row or stacked direction from a closed boolean.
77. **Content**: The single scrollable app-shell area with responsive token padding and background.
78. **TopBar**: A mobile app-shell bar aligning left and right slots edge to edge (`variant?` `raised|flat`, default `raised`; `flat` is a transparent in-content action row).
79. **Tile**: An icon/logo tile primitive with closed tone and size unions from tokens.
80. **Banner**: A centered status banner with closed tone union, its text inheriting the color.
81. **Link**: An inline text link with kit-owned icon, required href, and safe external target.
82. **LoadingOverlay**: A fullscreen loading overlay that blocks interaction, with a kit-pulsed center card, status label, progress text, and a consumer media slot.
83. **TruncatedText**: Single-line ellipsis text with kit-owned width cap (`text` required, `maxWidth?` px data, full text on hover); `ContextMenu`/`DropdownMenu` gained `truncate?` for ellipsis text triggers.
84. **Icon**: A decorative icon wrapper whose color (`tone`) and size come from kit tokens; without an `aria-label` it stays `aria-hidden` for screen readers.
85. **Positioned**: A fixed viewport slot for corner and edge triggers (`anchor` from space tokens, `visibility` mobile/desktop from the 600px token, `elevate` off when the slot holds its own sidebar trigger).
86. **PageFrame**: A document page frame - edge padding, content width, header, main and footer spacing all come from `layout.page` tokens, with an `overlays` slot for fixed triggers.

---

<!-- kelir-doc: themes -->
## Theme List

Project Kelir ships the following themes (one `DESIGN.md` design language each), selectable at runtime via `KelirProvider`/`KelirSwitcher`. The list below is complete - keep the `N. **theme-id**:` format when adding a theme.

1. **aurora-ui**: Flowing aurora gradients over a dark canvas.
2. **claymorphism**: Soft chunky clay shapes with thick rounded borders.
3. **dimensional-layering**: Stacked translucent layers with depth separation.
4. **editorial-contemporaneo**: Contemporary print-editorial typography and rules.
5. **edtech-plataforma**: Friendly education-platform surfaces and accents.
6. **flat-educacional**: Vibrant flat surfaces with saturated e-learning colors.
7. **futuristic-glassmorphism**: Neon-tinted glass panels with glow accents.
8. **glassmorphism**: Frosted-glass translucency with backdrop blur.
9. **liquid-glass**: Fluid glossy highlights over clear glass.
10. **neumorphism**: Soft extruded plastic with dual light/shadow.
11. **skeuomorphism**: Realistic textures mimicking physical materials.
12. **spatial-ui**: Depth-ordered spatial layers with ambient shadows.

---

## License

Licensed under the [MIT License](LICENSE).