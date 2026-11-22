import type { QuestionnaireQuestion } from "../kelir-kit/kit-questionnaire";
import { css } from "../kelir-kit/kit-create-css";

// Questionnaire item heading (internal, P2 split §8): title + required /
// optional markers + description. Local props, no §5.
interface QuestionnaireItemHeaderProps {
  question: QuestionnaireQuestion;
}

const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;
const borderLight = css.border.light;
const primary = css.colors.primary;
const radiusControl = css.control.radius;
const spaceXs = css.layout.space.xs;
const spaceSm = css.layout.space.sm;
const typeH2 = css.typography.scale.h2;
const typeBody = css.typography.scale.body;

export function QuestionnaireItemHeader({
  question,
}: QuestionnaireItemHeaderProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spaceSm }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: spaceXs,
          flexWrap: "wrap",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: typeH2,
            fontWeight: 700,
            color: textPrimary,
          }}
        >
          {question.title}
        </h3>
        {question.required && !question.skippable && (
          <span style={{ color: primary, fontSize: "14px" }}>*</span>
        )}
        {question.skippable && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: textSecondary,
              border: `1px solid ${borderLight}`,
              borderRadius: radiusControl,
              padding: "2px 8px",
            }}
          >
            optional
          </span>
        )}
      </div>
      {question.description && (
        <p
          style={{
            margin: 0,
            fontSize: typeBody,
            color: textSecondary,
            lineHeight: 1.5,
          }}
        >
          {question.description}
        </p>
      )}
    </div>
  );
}