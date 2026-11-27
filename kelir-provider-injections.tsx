// Injected <head>-ish siblings for KelirProvider: the token stylesheet, brand
// identity variables, the client-mode pre-paint theme script, and theme font
// preloads. Split out of kelir-provider.tsx (SRP, <= 100 lines) so the provider
// only wires state + context. All values are kit-owned static strings or
// sanitized brand values — never consumer HTML.

import * as React from "react";
import { brandFontFaceCss, brandFontLink } from "./kelir-design/kelir-font-css";
import {
  clientThemeScript,
  fontLinks,
  kelirStyleCss,
} from "./kelir-design/kelir-styles";
import type {
  BrandFontFace,
  Theme,
  ThemeMode,
} from "./kelir-kit/kit-provider";

export function KelirProviderInjections({
  brandFont,
  brandColors,
  themeName,
  themeMode,
}: {
  brandFont?: string | BrandFontFace;
  brandColors?: { accent: string; ink: string };
  themeName: Theme;
  themeMode: ThemeMode;
}) {
  // Two brandFont forms (issue #138): a bare family name the host already
  // loads, or a self-hosted face the kit installs via @font-face + preload.
  const brandFace: BrandFontFace | undefined =
    brandFont && typeof brandFont === "object" ? brandFont : undefined;
  const brandFamily =
    brandFace?.family ?? (typeof brandFont === "string" ? brandFont : undefined);
  const brandPreload = brandFace ? brandFontLink(brandFace) : undefined;
  return (
    <>
      {/* Client mode only: a blocking inline script that stamps the stored theme
          onto <html> before first paint, so no cookie read (and no flash) is
          needed. Rendered first so it runs before the themed content below. */}
      {themeMode === "client" ? (
        <script dangerouslySetInnerHTML={{ __html: clientThemeScript() }} />
      ) : null}
      {/* Theme token CSS + scrollbar. Injected by Kelir itself so consumers
          don't need any token stylesheet. Selectors match the data-kelir-theme
          attribute, so the saved theme applies before first paint (no flash).
          Rendered as React children (a static string, not user input) so no
          dangerouslySetInnerHTML is needed. */}
      <style>{kelirStyleCss()}</style>
      {/* Consumer brand font (identity, not layout). A self-hosted face gets its
          @font-face rule here so the family actually resolves without consumer
          CSS; a bare family name only installs the variable. Braces are stripped
          so a value cannot escape the declaration (rendered as React text). */}
      {brandFace ? <style>{brandFontFaceCss(brandFace)}</style> : null}
      {brandFamily ? (
        <style>
          {`:root { --kelir-font-brand: ${brandFamily.replace(/[;{}<>]/g, "")}; }`}
        </style>
      ) : null}
      {/* Consumer brand colors (identity, not theme): two fixed slots,
          `tone="brand-accent"|"brand-ink"`. Same sanitizing as the brand font. */}
      {brandColors ? (
        <style>
          {`:root { --kelir-brand-accent: ${brandColors.accent.replace(/[;{}<>]/g, "")}; --kelir-brand-ink: ${brandColors.ink.replace(/[;{}<>]/g, "")}; }`}
        </style>
      ) : null}
      {/* Theme fonts, self-hosted. @font-face ships inside the token sheet above
          and preloads cover the active theme's text + mono faces, so nothing here
          is render-blocking. React 19 dedupes identical <link>s by href. */}
      {fontLinks(themeName).map(({ href }) => (
        <link
          key={href}
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          href={href}
        />
      ))}
      {/* Brand face preload: the first file, same hint as theme faces. */}
      {brandPreload ? (
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          href={brandPreload.href}
        />
      ) : null}
    </>
  );
}
