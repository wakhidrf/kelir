import type { QuestionnaireQuestion } from "../kelir-types";
import { css } from "../kelir-variants";
import { Checkbox } from "./checkbox";
import { RadioGroup } from "./radio-group";
import { Textarea } from "./textarea";
import type { AnswerValue } from "./questionnaire-model";

// Isi pertanyaan Questionnaire (internal, pecah P2 §8): judul + deskripsi
// + input sesuai tipe. Kit-komposisi sealed. Props lokal, tanpa §5.
interface QuestionnaireItemProps {
  question: QuestionnaireQuestion;
  answer: AnswerValue | undefined;
  onAnswer: (next: AnswerValue) => void;
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

export function QuestionnaireItem({
  question,
  answer,
  onAnswer,
}: QuestionnaireItemProps) {
  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", gap: spaceSm }}
      >
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

      <div>
        {question.type === "single" && (
          <RadioGroup
            value={(typeof answer === "string" ? answer : "") as string}
            onChange={(v: string) => onAnswer(v)}
            options={question.options ?? []}
          />
        )}
        {question.type === "multiple" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: spaceSm,
            }}
          >
            {(question.options ?? []).map((option) => {
              const selected = Array.isArray(answer) ? answer : [];
              return (
                <Checkbox
                  key={option.value}
                  label={option.label}
                  checked={selected.includes(option.value)}
                  onChange={(checked: boolean) => {
                    onAnswer(
                      checked
                        ? [...selected, option.value]
                        : selected.filter((v) => v !== option.value),
                    );
                  }}
                />
              );
            })}
          </div>
        )}
        {question.type === "freeform" && (
          <Textarea
            placeholder={question.placeholder}
            value={(typeof answer === "string" ? answer : "") as string}
            onChange={(value) => onAnswer(value)}
            // A11y milik kit: judul pertanyaan = nama aksesibel textarea.
            aria-label={question.title}
          />
        )}
      </div>
    </>
  );
}
