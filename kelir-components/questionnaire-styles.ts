import type * as React from "react";
import { css } from "../kelir-kit/kit-create-css";

const surface = css.colors.surface;
const textSecondary = css.colors.textSecondary;
const borderLight = css.border.light;
const convex = css.shadows.convex;
const blur = css.motion.blur.backdrop;
// Remaining raw scale (ISSUE-006): large containers are intentionally lg;
// the size-per-role factor (small vs large card) is follow-up work.
const radiusLg = css.radius.lg;
const spaceLg = css.layout.space.lg;
const spaceXl = css.layout.space.xl;
const typeBody = css.typography.scale.body;

// Questionnaire frame (internal): the sealed outer card surface.
export const questionnaireSurfaceStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "520px",
  backgroundColor: surface,
  borderRadius: radiusLg,
  border: `1px solid ${borderLight}`,
  boxShadow: convex,
  backdropFilter: blur,
  WebkitBackdropFilter: blur,
  padding: spaceXl,
  display: "flex",
  flexDirection: "column",
  gap: spaceLg,
  fontFamily: "inherit",
};

// Questionnaire empty state (internal): shown when no questions are supplied.
export const questionnaireEmptyStyle: React.CSSProperties = {
  textAlign: "center",
  color: textSecondary,
  fontSize: typeBody,
};