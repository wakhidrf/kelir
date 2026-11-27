// @font-face serialization, shared by theme faces and the consumer brand face.
// Split out of kelir-styles.ts (SRP, <= 100 lines): font CSS is one concern,
// the token sheet another.

import type { FontFace } from "./kelir-theme-font-faces";

// One @font-face block per file. font-display: swap keeps text visible while a
// file arrives; an unreferenced face downloads nothing.
export function faceCss(face: FontFace): string {
  return face.files
    .map(
      (file) =>
        `@font-face {\n  font-family: ${face.family};\n  font-style: normal;\n  font-weight: ${file.weight};\n  font-display: swap;\n  src: url("${file.src}") format("woff2");\n}`,
    )
    .join("\n");
}

// @font-face for a consumer brand face (issue #138). Same shape as the theme
// faces, so the file resolves on the app's own origin and nothing is
// render-blocking.
export function brandFontFaceCss(face: FontFace): string {
  return faceCss(face);
}

// Preload hint for a consumer brand face: the first file only, mirroring
// fontLinks() for theme faces.
export function brandFontLink(face: FontFace): { href: string } | undefined {
  const file = face.files[0];
  return file ? { href: file.src } : undefined;
}