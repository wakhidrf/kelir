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
    "next-themes": "^0.4.6",
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
  next-themes@^0.4.6 \
  react@^19.2.8 \
  react-dom@^19.2.8
```

### 2. Copying the Project Kelir Repo into Your Project (Git Submodule)

Project Kelir is developed as a Git submodule. Copy the repo into the `src/views/kelir` directory with the following command:

```bash
git submodule add https://github.com/wakhidrf/kelir.git src/views/kelir
```

### 3. Installing the Main Provider (`KelirProvider`)

Place `ThemeProvider` (next-themes) then `KelirProvider` in `layout.tsx`.

```tsx
// src/app/layout.tsx (Server Component)
import { ThemeProvider } from "next-themes";
import { KelirProvider } from "@/views/kelir/kelir-provider";
import { THEME_STORAGE_KEY } from "@/views/kelir/kelir-styles";
import type { Theme } from "@/views/kelir/kelir-types";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Theme is client-only — persisted in localStorage, applied before first
  // paint by next-themes' pre-hydration script. The server provides only a
  // static default so the initial HTML is deterministic.
  const defaultTheme: Theme = "neumorphism";

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="data-kelir-theme"
          defaultTheme={defaultTheme}
          storageKey={THEME_STORAGE_KEY}
          enableSystem={false}
          disableTransitionOnChange
        >
          <KelirProvider defaultTheme={defaultTheme}>{children}</KelirProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

> **Optional — per-site cache isolation.** Set `NEXT_PUBLIC_KELIR_STORAGE_KEY` in your
> environment to scope the localStorage key to that value. This prevents two Kelir
> consumers living on the **same origin** (e.g. two sites both served from
> `localhost:3000`) from overwriting each other's persisted theme. When unset, the
> default `kelir:theme` is used — unchanged behavior.

```tsx
// src/app/page.tsx (Client Component)
"use client";

import { useKelir } from "@/views/kelir/kelir-provider";

export default function Home() {
  const { theme, setTheme } = useKelir();
  return <div>{/* your app */}</div>;
}
```

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

## Complete List of 63 Project Kelir Components

Project Kelir has **63 components** organized into several main categories to make it easier to design structured and consistent user interfaces.

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

### 2. Data Display
Components for displaying static data, visualizations, and message structures.

19. **Accordion**: A stacked vertical content panel that can be collapsed or expanded.
20. **Aspect Ratio**: A container that enforces the dimensional proportion of content (such as images or video).
21. **Attachment**: A file attachment viewer with metadata, upload status, and a remove button.
22. **Avatar**: A visual representation of a user profile as an image or an initials text fallback.
23. **Badge**: A small colored label used to mark a status or category.
24. **Bubble**: A conversation message bubble supporting sent/received variants, reactions, and collapse-expand.
25. **Calendar**: A monthly calendar for day navigation and single/range date selection.
26. **Card**: An information container panel consisting of a header, sub-header, body, and footer.
27. **Carousel**: A horizontal content player with swipe effects and smooth transitions.
28. **Chart**: Beautiful graphical data visualizations (Bar, Line, Area) powered by Recharts.
29. **Collapsible**: A collapsible (collapse-expand) content panel for hiding or showing additional details.
30. **Data Table**: An advanced data table with search, pagination, and sorting features.
31. **Empty**: An appealing visual state for marking when data or content is empty.
32. **Hover Card**: A preview card with additional content that appears when hovering over a link.
33. **Item**: A versatile row component for lists, presenting media, title, description, and action buttons.
34. **Kbd**: Displays keyboard shortcuts with an aesthetic physical keyboard key style.
35. **Marker**: A status line marker, conversation separator, or labeled line divider in chats.
36. **Message**: A message row component in a chat history complete with send time and status.
37. **Message Scroller**: A smart chat scroll container that stabilizes new message position and loads history smoothly.
38. **Progress**: A linear progress bar indicator for task completion.
39. **Scroll Area**: A container with a custom scrollbar optimized for cross-browser consistency.
40. **Separator**: A horizontal or vertical divider line between content elements with an optional labeled text.
41. **Table**: A basic responsive table structure for presenting organized row-column data.
42. **Tabs**: Tab-based content navigation for dividing information into separate panels.
43. **Typography**: Dedicated text styling for headings, paragraphs, and small labels for consistency.

### 3. Navigation
Components that guide user movement while exploring the application.

44. **Breadcrumb**: A trail of the active page hierarchy as a guide for navigating back.
45. **Command**: A command-palette style quick search dialog and instant command actions.
46. **Menubar**: A persistent horizontal menu bar presenting a list of quick commands.
47. **Navigation Menu**: A collection of the application's main navigation links with an active indicator.
48. **Pagination**: Page-splitting controls for data to make browsing large data volumes easier.
49. **Sidebar**: A customizable side navigation panel with header, menu body, and footer.

### 4. Feedback & Overlays
Components for status notifications, interruption dialogs, and floating guides.

50. **Alert**: Contextual warnings to draw important user attention (info, success, critical).
51. **Alert Dialog**: A critical interruption modal dialog that requires a confirmation decision from the user.
52. **Context Menu**: A floating action menu that appears when the user right-clicks on a certain area.
53. **Dialog**: A modal window overlaid on the main screen for focused tasks.
54. **Drawer**: An overlay panel that slides in from the edge of the screen (usually the bottom or side).
55. **Dropdown Menu**: A floating list of actions triggered by pressing a menu button.
56. **Popover**: A floating information balloon with rich content triggered when an element is clicked.
57. **Sheet**: A side-sliding dialog extension for displaying supporting data.
58. **Spinner**: A smooth circular loading indicator.
59. **Toast**: A brief notification message that appears temporarily at the corner of the screen.
60. **Tooltip**: A mini text explanation that appears when hovering over an element.

### 5. Layout
Components that shape the structure and placement of elements.

61. **Direction**: A context provider for text reading direction (LTR - Left to Right, or RTL - Right to Left).
62. **Resizable**: A layout panel whose size can be dynamically adjusted with draggable dividers.
63. **Skeleton**: An animated dimming-brightening placeholder frame for empty elements as a visualization before data finishes loading.

---

## License

Licensed under the [MIT License](LICENSE).
