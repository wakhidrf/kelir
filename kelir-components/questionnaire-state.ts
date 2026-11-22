"use client";

import * as React from "react";
import type { QuestionnaireProps } from "../kelir-kit/kit-questionnaire";
import {
  type Answers,
  type AnswerValue,
  isAnswered,
} from "./questionnaire-model";

// Questionnaire state (internal, P2 split §8): controlled/uncontrolled
// answers, step cursor, completion, and answered count. Rendering lives in
// questionnaire.tsx.
export function useQuestionnaireState({
  questions,
  value,
  defaultValue,
  onChange,
  onComplete,
}: QuestionnaireProps) {
  const isControlled = value !== undefined;
  const seed = (defaultValue ?? value ?? {}) as Answers;
  const [internal, setInternal] = React.useState<Answers>(seed);
  const [step, setStep] = React.useState(0);
  const [completed, setCompleted] = React.useState(false);

  const answers = (isControlled ? (value as Answers) : internal) ?? {};

  const setAnswer = React.useCallback(
    (id: string, next: AnswerValue) => {
      const updated = { ...answers, [id]: next };
      if (!isControlled) setInternal(updated);
      onChange?.(updated);
    },
    [answers, isControlled, onChange],
  );

  const total = questions.length;
  const current = questions[step];
  const answered = current ? isAnswered(current, answers[current.id]) : true;
  const canProceed = !current?.required || current.skippable ? true : answered;
  const isLast = step === total - 1;

  const goNext = () => {
    if (!canProceed) return;
    if (isLast) {
      setCompleted(true);
      onComplete?.(answers);
      return;
    }
    setStep((s) => Math.min(s + 1, total - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const skip = () => {
    if (!current?.skippable) return;
    if (isLast) {
      setCompleted(true);
      onComplete?.(answers);
      return;
    }
    setStep((s) => Math.min(s + 1, total - 1));
  };

  const restart = () => {
    if (!isControlled) setInternal(seed);
    setStep(0);
    setCompleted(false);
  };

  const answeredCount = Object.keys(answers).filter((id) => {
    const q = questions.find((item) => item.id === id);
    return q ? isAnswered(q, answers[id]) : false;
  }).length;

  return {
    answers,
    current,
    total,
    step,
    completed,
    canProceed,
    isLast,
    answeredCount,
    setAnswer,
    goNext,
    goBack,
    skip,
    restart,
  };
}