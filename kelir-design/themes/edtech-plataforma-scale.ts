export const rounded = {
  sm: "12px", // DESIGN base radius
  md: "24px",
  lg: "36px",
} as const;

export const typography = {
  h1: {
    fontFamily: '"Poppins", sans-serif',
    fontSize: "2.25rem",
    fontWeight: 700,
  },
  bodyMd: {
    fontFamily: '"Poppins", sans-serif',
    fontSize: "1rem",
    fontWeight: 400,
  },
  labelCaps: {
    fontFamily: '"Poppins", sans-serif',
    fontSize: "0.875rem",
    fontWeight: 500,
    letterSpacing: "0.02em",
  },
} as const;