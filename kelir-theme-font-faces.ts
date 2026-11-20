// The self-hosted @font-face table. kelir-styles.ts turns each entry into an
// @font-face rule; kelir-theme-fonts.ts lists which families a theme needs.
//
// Kelir never fetches a third-party stylesheet: every rule points at the host
// app's own origin, so a cold visit makes no cross-origin request and no
// stylesheet render-blocks the first paint. font-display: swap keeps text
// visible while the file arrives.

export interface FontFaceFile {
  /** Absolute path inside the host app (served from its own origin). */
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

// Files live in the host app's public/fonts/ (see Kelir's README: the host
// serves these eight files, or its own equivalents, at the same paths).
export const FONT_FACES: Record<FontKey, FontFace> = {
  "jetbrains-mono": {
    family: '"JetBrains Mono"',
    files: [{ src: "/fonts/jetbrains-mono-variable.woff2", weight: "100 800" }],
  },
  "playfair-display": {
    family: '"Playfair Display"',
    files: [
      { src: "/fonts/playfair-display-variable.woff2", weight: "400 900" },
    ],
  },
  poppins: {
    family: '"Poppins"',
    files: [
      { src: "/fonts/poppins-400.woff2", weight: "400" },
      { src: "/fonts/poppins-500.woff2", weight: "500" },
      { src: "/fonts/poppins-600.woff2", weight: "600" },
      { src: "/fonts/poppins-700.woff2", weight: "700" },
      { src: "/fonts/poppins-800.woff2", weight: "800" },
    ],
  },
  "exo-2": {
    family: '"Exo 2"',
    files: [{ src: "/fonts/exo-2-variable.woff2", weight: "100 900" }],
  },
};