import CheckIcon from "@mui/icons-material/Check";
import { css } from "../kelir-kit/kit-create-css";
import { Button } from "./button";

// Questionnaire complete screen (internal, P2 split §8): summary +
// restart button owned by the kit. Local props, no §5.
interface QuestionnaireCompleteProps {
  answeredCount: number;
  total: number;
  completedLabel?: string;
  onRestart: () => void;
}

const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;
const primary = css.colors.primary;
const onPrimary = css.on.primary;
const convex = css.shadows.convex;
const spaceMd = css.layout.space.md;
const typeH2 = css.typography.scale.h2;
const typeBody = css.typography.scale.body;

export function QuestionnaireComplete({
  answeredCount,
  total,
  completedLabel,
  onRestart,
}: QuestionnaireCompleteProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spaceMd,
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          backgroundColor: primary,
          color: onPrimary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: convex,
        }}
      >
        <CheckIcon style={{ fontSize: 28 }} />
      </div>
      <div
        style={{
          fontSize: typeH2,
          fontWeight: 700,
          color: textPrimary,
        }}
      >
        {completedLabel ?? "Thank you!"}
      </div>
      <div style={{ fontSize: typeBody, color: textSecondary }}>
        {answeredCount} of {total} questions answered.
      </div>
      <Button variant="ghost" onClick={onRestart}>
        Restart
      </Button>
    </div>
  );
}
