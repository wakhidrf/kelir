<!-- kelir-doc: intro -->
## Origin of the Name & Concept

The name **Project Kelir** is taken from the traditional wayang shadow-puppet performance - *kelir* is the cloth screen used as the stage for wayang shadow puppetry. This philosophy represents Project Kelir as a "screen" capable of displaying various different design faces (themes) on top of one single set of components.

Project Kelir integrates various **`DESIGN.md`** files - each representing its own design language - into one coherent multi-theme design system. Each design language is defined separately in its own file, then unified under a single architecture so it can be selected or swapped with ease.

## Current Limitations

Project Kelir is currently limited to **Next.js with TypeScript** projects. Before integrating Project Kelir, the project also needs to be cleaned of any other UI/UX already installed, such as Tailwind CSS.

### Consistency Gates Live in the Host Project

The sealed contract (the component list and each component's allowed props, values, and tokens) is kept at the **host project's root** as `STYLE.md`, not inside this submodule. The parity, guard, and status gates therefore run from the host repository, where the kit is mounted at `src/views/kelir`. A standalone clone of Kelir only parse-checks its tooling; run the full gates from the host project so the contract, types, and catalog stay in sync.

Alongside those, the anti-slop gate (`scripts/kelir-slop.mjs`, run as `npm run kelir:slop:strict`) runs from the host project too: it scans the host files that import Kelir plus the kit's own internals using the same pinned matchers as the MCP `audit` tool, and fails the build on any ERROR. A line carrying `kelir-allow: slop` (or the line above it) is an explicit, reviewable exemption.

## Per-Theme Typography

Besides multi-theme, every design language from DESIGN.md carries its own typography. The UI font and monospace font are automatically paired with the theme, so all components match the design identity with no extra configuration.

---

<!-- kelir-doc: install -->
## Integration & Installation Guide

### 1. Preparing the Required Dependencies

Make sure your project has the following core dependencies:

```json
{
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@mui/icons-material": "^9.4.0",
    "@mui/material": "^9.4.0",
    "next": "16.3.6",
    "react": "19.3.0",
    "react-dom": "19.3.0"
  }
}
```

Install all Project Kelir dependencies at once with a single command:

```bash
npm install \
  @emotion/react@^11.14.0 \
  @emotion/styled@^11.14.1 \
  @mui/material@^9.4.0 \
  @mui/icons-material@^9.4.0 \
  react@19.3.0 \
  react-dom@19.3.0
```

### 2. Adding Project Kelir as a Git Submodule

Project Kelir is distributed as a Git submodule. Add it (and initialize any of
its own dependencies) into the `src/views/kelir` directory:

```bash
git submodule add https://github.com/wakhidrf/kelir.git src/views/kelir
git submodule update --init --recursive
```

The submodule is pinned to a specific commit (the version you added). To pull
newer commits from the repo later:

```bash
git submodule update --remote src/views/kelir
```

### 3. Installing the Main Provider (`KelirProvider`)

Place `KelirProvider` in `layout.tsx`. The theme is **server-driven**: the root
layout reads the persisted theme cookie (if any) and lays `data-kelir-theme`
straight onto `<html>`, so the very first SSR HTML is already themed - no flash,
no client inline script, no localStorage. `setTheme` applies the theme instantly
on the client (attribute) and persists it back through a Server Action that sets
the cookie, so the next SSR response already ships the saved theme.

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
        {/* Optional safety gate; inert while data-kelir-ready="true" (see
            kelir-styles "hideBeforeReadyCss"). */}
        <KelirProvider defaultTheme={theme}>{children}</KelirProvider>
      </body>
    </html>
  );
}
```

```tsx
// src/controllers/theme-actions.ts (Server Action - sets the cookie)
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

```tsx
// src/controllers/theme-actions.ts (Server Action - removes the cookie)
"use server";

import { cookies } from "next/headers";
import { THEME_COOKIE } from "@/views/kelir/kelir-styles";

export async function deleteThemeCookie() {
  const cookieStore = await cookies();
  cookieStore.set(THEME_COOKIE, "", {
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });
}
```

```tsx
// src/app/page.tsx (Client Component)
"use client";

import { KelirSwitcher } from "@/views/kelir/kelir-switcher";

export default function Home() {
  // Render the switcher when you want interactive, persisted theme switching.
  // setTheme applies the theme immediately and persists via the theme cookie.
  return <KelirSwitcher />;
}
```

```tsx
// src/app/page.tsx (Client Component) - programmatic access
"use client";

import { useKelir } from "@/views/kelir/kelir-provider";

export default function Home() {
  const { theme, setTheme } = useKelir();
  return <div>{/* your app */}</div>;
}
```

> **Theme persistence.** The root layout serves the saved theme from the
> `THEME_COOKIE` (`kelir_theme`), and `KelirProvider`'s `setTheme` persists that
> cookie through a Server Action. No env key and no localStorage - the SSR HTML
> itself is already themed, so there is no flash to a server default on load or
> refresh.

> **No switcher = no persisted theme.** `KelirSwitcher` (or any picker) calls
> `registerSwitcher`/`unregisterSwitcher` via `useKelir()`. As long as one is
> mounted, `setTheme` persists to the cookie. If the page has **no** mounted
> switcher, the provider deletes the theme cookie and `setTheme` stays transient -
> a shared origin (e.g. `localhost:3000` reused by several projects) never keeps a
> leaked theme choice. The server still serves the cookie theme if a stale cookie
> existed, but it is removed once the no-switcher page hydrates.

> **Without persistence** (e.g. a static-first site): pass a fixed default theme to
> `KelirProvider` and skip the cookie; `setTheme` then just applies the theme for
> the current session without persisting. The cookie is only consulted when the
> layout opts into it.

### 4. How to Import Components

Import Project Kelir components directly from `src/views/kelir/kelir-components` as in the following example:

```tsx
import { Badge } from "@/views/kelir/kelir-components/badge";
import { Button } from "@/views/kelir/kelir-components/button";
import { Stack } from "@/views/kelir/kelir-components/stack";
import { Switch } from "@/views/kelir/kelir-components/switch";

export default function MyComponent() {
  return (
    // Layout via kit primitives (Stack), never a styled div.
    <Stack direction="row" gap="md">
      <Button variant="primary">Click Me</Button>
      <Switch label="Enable Feature" defaultChecked />
      <Badge variant="secondary">New Info</Badge>
    </Stack>
  );
}
```

### 5. Usage Rules

Each component card in the Showcase tab shows three things: a live preview
you can click, the exact props you may pass (for example Button:
`variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost'`),
and a code snippet you can copy. The rules below are what those cards enforce.
The prop list on each card is generated from the contract, so it never
goes stale:

> **You fill content + meaning + behavior.** Your code provides text, options,
> data, and handlers (`onClick`, `onChange`, `value`, `open`). Everything
> visual - colors, radius, spacing, fonts, shadows, animations - belongs to
> Kelir and follows the active theme automatically.

> **Never style from the outside.** No `style`/`sx`/`className`, no raw
> colors or sizes, no `slotProps`/`classes`/`slot`, no
> `dangerouslySetInnerHTML`, and no `data-*` attributes for styling (the only
> exception is `data-testid` for your own tests).

> **Pick from the lists shown in each card.** Props like `variant`, `size`,
> `gap`, `align`, `shape`, or `mode` accept only the values printed on the
> card - try `Button variant="primary"`, `Grid columns={6}`, `Stack gap="md"`.
> A value you invent yourself won't match the theme, and the preview won't
> show it.

> **Lay out with kit primitives.** Use `Stack`, `Grid`, or `Spacer` from
> `kelir-components` (see How to Import Components above), not plain `div`
> wrappers.

> **One visual switch.** `KelirProvider` takes `defaultTheme` + `children`
> and nothing else visual. Change themes at runtime with
> `useKelir().setTheme` or the ready-made `KelirSwitcher` (see Installing the
> Main Provider above) - never by overriding colors. Flip themes in the
> Showcase to see every preview change at once.

> **Labels are yours, behavior is ours.** You provide accessible names
> (`aria-label`, `id`, `htmlFor`); focus traps, live announcements, and
> keyboard support are built into every component - tab through the Showcase
> previews with your keyboard to feel it. The only component that takes
> dimensions is `Skeleton` (`width`/`height` for loading placeholders).

---

<!-- kelir-doc: components -->
## Complete List of 82 Project Kelir Components

Project Kelir has **77 components** organized into several main categories to make it easier to design structured and consistent user interfaces.

### 1. Inputs & Forms
Components that capture user interaction and data input with integrated controls.

1. **Button**: Displays an interactive button that follows the active theme, with closed sm/md/lg sizes.
2. **Button Group**: A container for grouping related buttons with consistent rounded corners.
3. **Checkbox**: A binary choice with a label and check visualization.
4. **Combobox**: An auto-complete text input with a list of suggested options.
5. **Date Picker**: An interactive date picker in a popover calendar with inline month-grid and year-list navigation.
6. **Field**: Combines label, control, and helper text for an accessible form.
7. **Input**: A basic text input for forms with integrated styling.
8. **IconButton**: An icon-only button with a required accessible label, with closed sm/md/lg sizes.
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
37. **Kbd**: Displays keyboard shortcuts with an aesthetic physical keyboard key style.
38. **List**: A semantic list with kit-owned markers, spacing, and color, switchable between bullet and numbered.
39. **Marker**: A status line marker, conversation separator, or labeled line divider in chats.
40. **Message**: A message row component in a chat history complete with send time and status.
41. **Message Scroller**: A smart chat scroll container that stabilizes new message position and loads history smoothly.
42. **Progress**: A linear progress bar indicator for task completion.
43. **Quote**: A blockquote with a kit-owned accent bar, surface, and radius.
44. **Scroll Area**: A container with a custom scrollbar optimized for cross-browser consistency.
45. **Separator**: A horizontal or vertical divider line between content elements with an optional labeled text.
46. **Table**: A basic responsive table structure for presenting organized row-column data.
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
65. **Tooltip**: A mini text explanation that appears when hovering over an element.

### 5. Layout
Components that shape the structure and placement of elements.

66. **Direction**: A context provider for text reading direction (LTR - Left to Right, or RTL - Right to Left).
67. **Grid**: A responsive column grid with closed column and gap unions.
68. **Resizable**: A layout panel whose size can be dynamically adjusted with draggable dividers.
69. **Skeleton**: An animated dimming-brightening placeholder frame for empty elements as a visualization before data finishes loading.
70. **Spacer**: A fixed-gap whitespace primitive with a closed size union.
71. **Stack**: A vertical/horizontal stack primitive with closed gap, direction, align, and justify unions, plus a full-screen min height and wide-screen order reversal.
72. **Container**: A page-width containment primitive with closed maxWidth and padding unions from layout tokens.
73. **Image**: A neutral media primitive with closed height, fit, and radius unions, an optional fluid mode with px width cap, and no shadow/border by default.
74. **FlexItem**: A flex-item control primitive paired with Stack, with closed boolean grow, shrink, and clip unions, plus a token-based upward offset.
75. **Shell**: A viewport app-shell primitive with row or stacked direction from a closed boolean.
76. **Content**: The single scrollable app-shell area with responsive token padding and background.
77. **TopBar**: A mobile app-shell bar aligning left and right slots edge to edge (`variant?` `raised|flat`, default `raised`; `flat` is a transparent in-content action row).
78. **Tile**: An icon/logo tile primitive with closed tone and size unions from tokens.
79. **Banner**: A centered status banner with closed tone union, its text inheriting the color.
80. **Link**: An inline text link with kit-owned icon, required href, and safe external target.
81. **LoadingOverlay**: A fullscreen loading overlay that blocks interaction, with a kit-pulsed center card, status label, progress text, and a consumer media slot.
82. **TruncatedText**: Single-line ellipsis text with kit-owned width cap (`text` required, `maxWidth?` px data, full text on hover); `ContextMenu`/`DropdownMenu` gained `truncate?` for ellipsis text triggers.

---

<!-- kelir-doc: themes -->
## Theme List

Project Kelir ships the following themes (one `DESIGN.md` design language each),
selectable at runtime via `KelirProvider`/`KelirSwitcher`. The list below is
complete - keep the `N. **theme-id**:` format when adding a theme.

1. **aurora-ui**: Flowing aurora gradients over a dark canvas.
2. **claymorphism**: Soft chunky clay shapes with thick rounded borders.
3. **dimensional-layering**: Stacked translucent layers with depth separation.
4. **editorial-contemporaneo**: Contemporary print-editorial typography and rules.
5. **edtech-plataforma**: Friendly education-platform surfaces and accents.
6. **futuristic-glassmorphism**: Neon-tinted glass panels with glow accents.
7. **glassmorphism**: Frosted-glass translucency with backdrop blur.
8. **liquid-glass**: Fluid glossy highlights over clear glass.
9. **neumorphism**: Soft extruded plastic with dual light/shadow.
10. **skeuomorphism**: Realistic textures mimicking physical materials.
11. **spatial-ui**: Depth-ordered spatial layers with ambient shadows.

---

## MCP Server (for AI Assistants, In Progress)

Project Kelir ships an experimental MCP server in `kelir-mcp/` so AI assistants can look up the component catalog, tokens, and usage contract instead of reading the whole repo.

Connect it as a local server (OpenCode example):

```json
{
  "mcp": {
    "kelir": {
      "type": "local",
      "command": ["node", "src/views/kelir/kelir-mcp/server.mjs"],
      "enabled": true
    }
  }
}
```

Status and limitations, honestly:

- In progress: the server only serves a read-only catalog for now. Design suggestions and code checks are planned next.
- Local use only: stdio, no remote or hosted mode.
- The served catalog is a generated copy: it can lag behind the newest kit until regenerated.
- Requires Node plus a one-time install inside `kelir-mcp/` (see its README).
- Every MCP server adds model context: enable it only where needed.

---

## License

Licensed under the [MIT License](LICENSE).
