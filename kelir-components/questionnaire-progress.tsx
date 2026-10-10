import { css } from "../kelir-variants";

// Bilah progres Questionnaire (internal, pecah P2 §8): step/total/pct
// angka milik kit. Bukan kontrak publik — props lokal, tanpa §5.
interface QuestionnaireProgressProps {
  step: number;
  total: number;
}

const textSecondary = css.colors.textSecondary;
const track = css.track;
const primary = css.colors.primary;
const radiusSm = css.radius.sm;
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
          borderRadius: radiusSm,
          backgroundColor: track,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            backgroundColor: primary,
            borderRadius: radiusSm,
            transition: `width ${css.motion.duration.base} ${css.motion.easing.curve}`,
          }}
        />
      </div>
    </div>
  );
}
