import { css } from "../kelir-kit/kit-create-css";

// Questionnaire progress bar (internal, P2 split §8): step/total/pct
// numbers owned by the kit. Not a public contract — local props, no §5.
interface QuestionnaireProgressProps {
  step: number;
  total: number;
}

const textSecondary = css.colors.textSecondary;
const track = css.track;
const primary = css.colors.primary;
const radiusControl = css.control.radius;
const spaceSm = css.layout.space.sm;

export function QuestionnaireProgress({
  step,
  total,
}: QuestionnaireProgressProps) {
  const pct = total === 0 ? 0 : ((step + 1) / total) * 100;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spaceSm,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          color: textSecondary,
        }}
      >
        <span>
          Step {step + 1} of {total}
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div
        style={{
          height: 6,
          borderRadius: radiusControl,
          backgroundColor: track,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            backgroundColor: primary,
            borderRadius: radiusControl,
            transition: `width ${css.motion.duration.base} ${css.motion.easing.curve}`,
          }}
        />
      </div>
    </div>
  );
}
