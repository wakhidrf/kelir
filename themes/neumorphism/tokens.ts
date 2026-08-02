export const tokens = {
  version: "alpha",
  name: "Neumorphism",
  description: "Neumorphic UI with soft 3D effects.",
  colors: {
    primary: "#C8E0F4",     // Soft Blue
    secondary: "#F5E0E8",   // Soft Pink
    tertiary: "#E8E8E8",    // Soft Grey
    background: "#E8E8E8",  // Neumorphic background (Soft Grey)
    surface: "#E8E8E8",     // Neumorphic elements must match background to blend
    textPrimary: "#333333", // Crisp dark grey for readability (no pure black)
    textSecondary: "#666666",
    shadowDark: "rgba(0, 0, 0, 0.08)",
    shadowLight: "rgba(255, 255, 255, 0.9)",
  },
  typography: {
    h1: {
      fontSize: "2.25rem",
      fontWeight: 700,
    },
    bodyMd: {
      fontSize: "1rem",
      fontWeight: 400,
    },
    labelCaps: {
      fontSize: "0.75rem",
      fontWeight: 500,
    },
  },
  rounded: {
    sm: "14px",
    md: "28px",
    lg: "42px",
  },
  shadows: {
    flat: "none",
    convex: "5px 5px 15px rgba(0, 0, 0, 0.08), -5px -5px 15px rgba(255, 255, 255, 0.9)",
    concave: "inset 5px 5px 10px rgba(0, 0, 0, 0.08), inset -5px -5px 10px rgba(255, 255, 255, 0.9)",
    card: "3px 3px 10px rgba(0, 0, 0, 0.05), -3px -3px 10px rgba(255, 255, 255, 0.8)",
  },
  components: {
    buttonPrimary: {
      backgroundColor: "#C8E0F4",
      rounded: "14px",
      padding: "12px",
    },
  },
} as const;
