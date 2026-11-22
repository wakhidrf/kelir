// The self-hosted @font-face table. kelir-styles.ts turns each entry into an
// @font-face rule; kelir-theme-fonts.ts lists which families a theme needs.
//
// The font files ship with the kit (./fonts/), so the kit owns both the stack
// and the binaries. Each path below is resolved by the bundler into a hashed
// URL on the app's own origin: no third-party stylesheet is fetched, nothing
// render-blocks the first paint, and a consumer that copies the kit brings the
// fonts with it. font-display: swap keeps text visible while a file arrives.

export interface FontFaceFile {
  /** Resolved URL on the app's own origin. */
  src: string;
  /** CSS font-weight: a single value, or a range for a variable file. */
  weight: string;
}

export interface FontFace {
  /** CSS font-family, quoted. */
  family: string;
  /** One entry per file; the first is the one a preload hints at. */
  files: FontFaceFile[];
}

/** Families a theme can pull in. */
export type FontKey =
  | "jetbrains-mono"
  | "playfair-display"
  | "poppins"
  | "exo-2";

// Paths are relative to this file and static, which is what lets the bundler
// emit them. Files are the latin subsets, licensed SIL OFL 1.1 (see
// ./fonts/LICENSE.md).
export const FONT_FACES: Record<FontKey, FontFace> = {
  "jetbrains-mono": {
    family: '"JetBrains Mono"',
    files: [
      {
        src: new URL("./fonts/jetbrains-mono-variable.woff2", import.meta.url)
          .href,
        weight: "100 800",
      },
    ],
  },
  "playfair-display": {
    family: '"Playfair Display"',
    files: [
      {
        src: new URL("./fonts/playfair-display-variable.woff2", import.meta.url)
          .href,
        weight: "400 900",
      },
    ],
  },
  poppins: {
    family: '"Poppins"',
    files: [
      {
        src: new URL("./fonts/poppins-400.woff2", import.meta.url).href,
        weight: "400",
      },
      {
        src: new URL("./fonts/poppins-500.woff2", import.meta.url).href,
        weight: "500",
      },
      {
        src: new URL("./fonts/poppins-600.woff2", import.meta.url).href,
        weight: "600",
      },
      {
        src: new URL("./fonts/poppins-700.woff2", import.meta.url).href,
        weight: "700",
      },
      {
        src: new URL("./fonts/poppins-800.woff2", import.meta.url).href,
        weight: "800",
      },
    ],
  },
  "exo-2": {
    family: '"Exo 2"',
    files: [
      {
        src: new URL("./fonts/exo-2-variable.woff2", import.meta.url).href,
        weight: "100 900",
      },
    ],
  },
};
