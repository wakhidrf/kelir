export const rounded = {
  sm: "16px", // DESIGN sm
  md: "32px", // DESIGN md
  lg: "48px", // DESIGN lg
} as const;

export const typography = {
  h1: {
    fontFamily: '"Exo 2", sans-serif',
    fontSize: "2.5rem", // DESIGN h1
    fontWeight: 700,
  },
  bodyMd: {
    fontFamily: '"Exo 2", sans-serif',
    fontSize: "1rem",
    fontWeight: 400,
  },
  labelCaps: {
    fontFamily: '"Exo 2", sans-serif',
    fontSize: "0.75rem",
    fontWeight: 500,
  },
} as const;