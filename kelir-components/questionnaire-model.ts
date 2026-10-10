import type { QuestionnaireQuestion } from "../kelir-types";

// Model internal Questionnaire (pecah P2 PLAN.md §8): tipe jawaban +
// predikat terjawab. Bukan kontrak publik (tak ada di §5).
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
