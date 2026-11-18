import type { QuestionnaireQuestion } from "../kelir-types";
import { css } from "../kelir-variants";
import { Checkbox } from "./checkbox";
import type { AnswerValue } from "./questionnaire-model";
import { RadioGroup } from "./radio-group";
import { Textarea } from "./textarea";

// Questionnaire item inputs (internal, P2 split §8): one control per
// question type (single/multiple/freeform). Local props, no §5.
interface QuestionnaireItemFieldsProps {
  question: QuestionnaireQuestion;
  answer: AnswerValue | undefined;
  onAnswer: (next: AnswerValue) => void;
}

const spaceSm = css.layout.space.sm;

export function QuestionnaireItemFields({
  question,
  answer,
  onAnswer,
}: QuestionnaireItemFieldsProps) {
  return (
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
          // Kit-owned a11y: the question title is the textarea's accessible name.
          aria-label={question.title}
        />
      )}
    </div>
  );
}