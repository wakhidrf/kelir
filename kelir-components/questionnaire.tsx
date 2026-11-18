"use client";

import type { QuestionnaireProps } from "../kelir-types";
import { QuestionnaireComplete } from "./questionnaire-complete";
import { QuestionnaireItem } from "./questionnaire-item";
import { QuestionnaireNav } from "./questionnaire-nav";
import { QuestionnaireProgress } from "./questionnaire-progress";
import { useQuestionnaireState } from "./questionnaire-state";
import {
  questionnaireEmptyStyle,
  questionnaireSurfaceStyle,
} from "./questionnaire-styles";

// Questionnaire sealed: state + step orchestration (P2 PLAN.md split §8).
// Public contract unchanged; rendering is split into internal modules
// (state/styles/progress/item/nav/complete). No ...rest/style/sx/className.
export function Questionnaire({
  questions,
  value,
  defaultValue,
  onChange,
  onComplete,
  submitLabel = "Submit",
  skipLabel = "Skip",
  nextLabel = "Next",
  backLabel = "Back",
  completedLabel,
}: QuestionnaireProps) {
  const state = useQuestionnaireState({
    questions,
    value,
    defaultValue,
    onChange,
    onComplete,
  });
  const { answers, current, total, step, completed, canProceed, isLast, answeredCount } = state;

  return (
    <div style={questionnaireSurfaceStyle}>
      {total === 0 ? (
        <div style={questionnaireEmptyStyle}>No questions to display.</div>
      ) : completed ? (
        <QuestionnaireComplete
          answeredCount={answeredCount}
          total={total}
          completedLabel={completedLabel}
          onRestart={state.restart}
        />
      ) : (
        current && (
          <>
            <QuestionnaireProgress step={step} total={total} />
            <QuestionnaireItem
              question={current}
              answer={answers[current.id]}
              onAnswer={(next) => state.setAnswer(current.id, next)}
            />
            <QuestionnaireNav
              backLabel={backLabel}
              skipLabel={skipLabel}
              nextLabel={nextLabel}
              submitLabel={submitLabel}
              canGoBack={step > 0}
              canSkip={current.skippable ?? false}
              canProceed={canProceed}
              isLast={isLast}
              onBack={state.goBack}
              onSkip={state.skip}
              onNext={state.goNext}
            />
          </>
        )
      )}
    </div>
  );
}