import type { QuestionnaireQuestion } from "../kelir-types";

// Internal Questionnaire model (P2 PLAN.md split §8): answer type +
// answered predicate. Not a public contract (not in §5).
export type AnswerValue = string | string[];

export type Answers = Record<string, AnswerValue>;

export function isAnswered(
  question: QuestionnaireQuestion,
  value: AnswerValue | undefined,
): boolean {
  if (question.type === "multiple") {
    return Array.isArray(value) && value.length > 0;
  }
  return typeof value === "string" && value.trim().length > 0;
}
