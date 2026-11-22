import type { QuestionnaireQuestion } from "../kelir-kit/kit-questionnaire";
import type { AnswerValue } from "./questionnaire-model";
import { QuestionnaireItemFields } from "./questionnaire-item-fields";
import { QuestionnaireItemHeader } from "./questionnaire-item-header";

// Questionnaire question body (internal, P2 split §8): heading + input per
// type, composed from internal modules. Local props, no §5.
interface QuestionnaireItemProps {
  question: QuestionnaireQuestion;
  answer: AnswerValue | undefined;
  onAnswer: (next: AnswerValue) => void;
}

export function QuestionnaireItem({
  question,
  answer,
  onAnswer,
}: QuestionnaireItemProps) {
  return (
    <>
      <QuestionnaireItemHeader question={question} />
      <QuestionnaireItemFields
        question={question}
        answer={answer}
        onAnswer={onAnswer}
      />
    </>
  );
}