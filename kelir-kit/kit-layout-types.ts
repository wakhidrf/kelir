// Layout token types. Split out of kelir-layout.ts (SRP, one responsibility,
// <= 100 lines); the kelir-layout.ts barrel re-exports them. Names and shapes
// are unchanged.

export interface KelirSpace {
  /** 4px */
  xs: string;
  /** 8px (base unit) */
  sm: string;
  /** 12px */
  md: string;
  /** 16px */
  lg: string;
  /** 24px */
  xl: string;
  /** 32px */
  "2xl": string;
  /** 48px */
  "3xl": string;
  /** 64px */
  "4xl": string;
}

export interface KelirLayoutTokens {
  space: KelirSpace;
  container: { maxWidth: string; sidePadding: string };
  sectionGap: string;
  breakpoints: { heroCollapse: string; mobile: string };
  // Minimum Grid auto-fit item width (minItem), from the same token set.
  gridMin: { sm: string; md: string };
  // Document page frame (PageFrame): edge spacing, content width, main/footer breathing room.
  page: {
    paddingTop: string;
    paddingInline: string;
    paddingInlineMobile: string;
    paddingBottom: string;
    contentMax: string;
    gap: string;
    headerGap: string;
    headerGapMobile: string;
    mainMinHeight: string;
    mainPaddingBlock: string;
    footerPaddingTop: string;
    footerGap: string;
  };
  zIndex: {
    base: string;
    sticky: string;
    overlay: string;
    modal: string;
    toast: string;
  };
}