# Kelir

## Origin of the Name & Concept

The name **Project Kelir** is taken from the traditional wayang shadow-puppet performance — *kelir* is the cloth screen used as the stage for wayang shadow puppetry. This philosophy represents Project Kelir as a "screen" capable of displaying various different design faces (themes) on top of one single set of components.

Project Kelir integrates various **`DESIGN.md`** files — each representing its own design language — into one coherent multi-theme design system. Each design language is defined separately in its own file, then unified under a single architecture so it can be selected or swapped with ease.

## Current Limitations

Project Kelir is currently limited to **Next.js with TypeScript** projects. Before integrating Project Kelir, the project also needs to be cleaned of any other UI/UX already installed, such as Tailwind CSS.

## Per-Theme Typography

Besides multi-theme, every design language from DESIGN.md carries its own typography. The UI font and monospace font are automatically paired with the theme, so all components match the design identity with no extra configuration.

---

## Integration & Installation Guide

### 1. Preparing the Required Dependencies

Make sure your project has the following core dependencies:

```json
{
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@mui/icons-material": "^9.2.0",
    "@mui/material": "^9.2.0",
    "next": "16.3.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8"
  }
}
```

Install all Project Kelir dependencies at once with a single command:

```bash
npm install \
  @emotion/react@^11.14.0 \
  @emotion/styled@^11.14.1 \
  @mui/material@^9.2.0 \
  @mui/icons-material@^9.2.0 \
  react@^19.2.8 \
  react-dom@^19.2.8
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
straight onto `<html>`, so the very first SSR HTML is already themed — no flash,
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
// src/controllers/theme-actions.ts (Server Action — sets the cookie)
"use server";

import { cookies } from "next/headers";
import { THEME_COOKIE } from "@/views/kelir/kelir-styles";
import type { Theme } from "@/views/kelir/kelir-types";

export async function persistTheme(theme: Theme) {
  const cookieStore = await cookies();
  cookieStore.set(THEME_COOKIE, theme, {
    path: "/",
    sameSite: "lax",
    maxAge: 31536000,
  });
}
```

```tsx
// src/controllers/theme-actions.ts (Server Action — removes the cookie)
"use server";

import { cookies } from "next/headers";
import { THEME_COOKIE } from "@/views/kelir/kelir-styles";

export async function deleteTheme() {
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
// src/app/page.tsx (Client Component) — programmatic access
"use client";

import { useKelir } from "@/views/kelir/kelir-provider";

export default function Home() {
  const { theme, setTheme } = useKelir();
  return <div>{/* your app */}</div>;
}
```

> **Theme persistence.** The root layout serves the saved theme from the
> `THEME_COOKIE` (`kelir_theme`), and `KelirProvider`'s `setTheme` persists that
> cookie through a Server Action. No env key and no localStorage — the SSR HTML
> itself is already themed, so there is no flash to a server default on load or
> refresh.

> **No switcher = no persisted theme.** `KelirSwitcher` (or any picker) calls
> `registerSwitcher`/`unregisterSwitcher` via `useKelir()`. As long as one is
> mounted, `setTheme` persists to the cookie. If the page has **no** mounted
> switcher, the provider deletes the theme cookie and `setTheme` stays transient —
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
import { Button } from "@/views/kelir/kelir-components/button";
import { Switch } from "@/views/kelir/kelir-components/switch";
import { Badge } from "@/views/kelir/kelir-components/badge";

export default function MyComponent() {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button variant="primary">Click Me</Button>
      <Switch label="Enable Feature" checked={true} />
      <Badge variant="secondary">New Info</Badge>
    </div>
  );
}
```

---

## Complete List of 64 Project Kelir Components

Project Kelir has **64 components** organized into several main categories to make it easier to design structured and consistent user interfaces.

### 1. Inputs & Forms
Components that capture user interaction and data input with integrated controls.

1. **Button**: Displays an interactive button that follows the active theme.
2. **Button Group**: A container for grouping related buttons with consistent rounded corners.
3. **Checkbox**: A binary choice with a label and check visualization.
4. **Combobox**: An auto-complete text input with a list of suggested options.
5. **Date Picker**: An interactive date picker with presets and ranges.
6. **Field**: Combines label, control, and helper text for an accessible form.
7. **Input**: A basic text input for forms with integrated styling.
8. **Input Group**: Combines a text input with additional icons or action buttons at the start/end (prefix/suffix).
9. **Input OTP**: A one-time password input component with user-friendly copy-paste functionality.
10. **Label**: An accessible text label directly connected to an input control element.
11. **Native Select**: A native HTML select element styled to match the Project Kelir design language.
12. **Radio Group**: A collection of single-choice options where only one option can be active at a time.
13. **Select**: Displays an interactive list of choices triggered by a trigger button.
14. **Slider**: A horizontal drag control for determining a value within a given range.
15. **Switch**: A binary toggle with clear active transition visual feedback.
16. **Textarea**: A resizable multi-line text input field.
17. **Toggle**: A two-state binary button (on/off) for quick switching.
18. **Toggle Group**: A container holding multiple Toggle buttons for single or multiple selection.
19. **Questionnaire**: A multi-step questionnaire with single-choice, multiple-choice, freeform, and skippable questions, complete with a progress indicator and a completion screen.

### 2. Data Display
Components for displaying static data, visualizations, and message structures.

20. **Accordion**: A stacked vertical content panel that can be collapsed or expanded.
21. **Aspect Ratio**: A container that enforces the dimensional proportion of content (such as images or video).
22. **Attachment**: A file attachment viewer with metadata, upload status, and a remove button.
23. **Avatar**: A visual representation of a user profile as an image or an initials text fallback.
24. **Badge**: A small colored label used to mark a status or category.
25. **Bubble**: A conversation message bubble supporting sent/received variants, reactions, and collapse-expand.
26. **Calendar**: A monthly calendar for day navigation and single/range date selection.
27. **Card**: An information container panel consisting of a header, sub-header, body, and footer.
28. **Carousel**: A horizontal content player with swipe effects and smooth transitions.
29. **Chart**: Beautiful graphical data visualizations (Bar, Line, Area) powered by Recharts.
30. **Collapsible**: A collapsible (collapse-expand) content panel for hiding or showing additional details.
31. **Data Table**: An advanced data table with search, pagination, and sorting features.
32. **Empty**: An appealing visual state for marking when data or content is empty.
33. **Hover Card**: A preview card with additional content that appears when hovering over a link.
34. **Item**: A versatile row component for lists, presenting media, title, description, and action buttons.
35. **Kbd**: Displays keyboard shortcuts with an aesthetic physical keyboard key style.
36. **Marker**: A status line marker, conversation separator, or labeled line divider in chats.
37. **Message**: A message row component in a chat history complete with send time and status.
38. **Message Scroller**: A smart chat scroll container that stabilizes new message position and loads history smoothly.
39. **Progress**: A linear progress bar indicator for task completion.
40. **Scroll Area**: A container with a custom scrollbar optimized for cross-browser consistency.
41. **Separator**: A horizontal or vertical divider line between content elements with an optional labeled text.
42. **Table**: A basic responsive table structure for presenting organized row-column data.
43. **Tabs**: Tab-based content navigation for dividing information into separate panels.
44. **Typography**: Dedicated text styling for headings, paragraphs, and small labels for consistency.

### 3. Navigation
Components that guide user movement while exploring the application.

45. **Breadcrumb**: A trail of the active page hierarchy as a guide for navigating back.
46. **Command**: A command-palette style quick search dialog and instant command actions.
47. **Menubar**: A persistent horizontal menu bar presenting a list of quick commands.
48. **Navigation Menu**: A collection of the application's main navigation links with an active indicator.
49. **Pagination**: Page-splitting controls for data to make browsing large data volumes easier.
50. **Sidebar**: A customizable side navigation panel with header, menu body, and footer.

### 4. Feedback & Overlays
Components for status notifications, interruption dialogs, and floating guides.

51. **Alert**: Contextual warnings to draw important user attention (info, success, critical).
52. **Alert Dialog**: A critical interruption modal dialog that requires a confirmation decision from the user.
53. **Context Menu**: A floating action menu that appears when the user right-clicks on a certain area.
54. **Dialog**: A modal window overlaid on the main screen for focused tasks.
55. **Drawer**: An overlay panel that slides in from the edge of the screen (usually the bottom or side).
56. **Dropdown Menu**: A floating list of actions triggered by pressing a menu button.
57. **Popover**: A floating information balloon with rich content triggered when an element is clicked.
58. **Sheet**: A side-sliding dialog extension for displaying supporting data.
59. **Spinner**: A smooth circular loading indicator.
60. **Toast**: A brief notification message that appears temporarily at the corner of the screen.
61. **Tooltip**: A mini text explanation that appears when hovering over an element.

### 5. Layout
Components that shape the structure and placement of elements.

62. **Direction**: A context provider for text reading direction (LTR - Left to Right, or RTL - Right to Left).
63. **Resizable**: A layout panel whose size can be dynamically adjusted with draggable dividers.
64. **Skeleton**: An animated dimming-brightening placeholder frame for empty elements as a visualization before data finishes loading.

---

## License

Licensed under the [MIT License](LICENSE).
