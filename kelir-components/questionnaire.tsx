"use client";

import * as React from "react";
import type { QuestionnaireProps } from "../kelir-types";
import { css } from "../kelir-variants";
import { QuestionnaireComplete } from "./questionnaire-complete";
import { QuestionnaireItem } from "./questionnaire-item";
import {
  type Answers,
  type AnswerValue,
  isAnswered,
} from "./questionnaire-model";
import { QuestionnaireNav } from "./questionnaire-nav";
import { QuestionnaireProgress } from "./questionnaire-progress";

const surface = css.colors.surface;
const textSecondary = css.colors.textSecondary;
const borderLight = css.border.light;
const convex = css.shadows.convex;
const blur = css.motion.blur.backdrop;
// Skala mentah tersisa (ISSUE-006): kontainer besar disengaja lg;
// faktor-ukuran-peran (card kecil vs besar) pekerjaan susulan.
const radiusLg = css.radius.lg;
const spaceLg = css.layout.space.lg;
const spaceXl = css.layout.space.xl;
const typeBody = css.typography.scale.body;

// Questionnaire sealed: orkestrasi state + langkah (pecah P2 PLAN.md §8).
// Kontrak publik tak berubah; render dipecah ke modul internal
// (progress/item/nav/complete/model). Tanpa ...rest/style/sx/className.
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

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "520px",
        backgroundColor: surface,
        borderRadius: radiusLg,
        border: `1px solid ${borderLight}`,
        boxShadow: convex,
        backdropFilter: blur,
        WebkitBackdropFilter: blur,
        padding: spaceXl,
        display: "flex",
        flexDirection: "column",
        gap: spaceLg,
        fontFamily: "inherit",
      }}
    >
      {total === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: textSecondary,
            fontSize: typeBody,
          }}
        >
          No questions to display.
        </div>
      ) : completed ? (
        <QuestionnaireComplete
          answeredCount={answeredCount}
          total={total}
          completedLabel={completedLabel}
          onRestart={restart}
        />
      ) : (
        current && (
          <>
            <QuestionnaireProgress step={step} total={total} />
            <QuestionnaireItem
              question={current}
              answer={answers[current.id]}
              onAnswer={(next) => setAnswer(current.id, next)}
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
              onBack={goBack}
              onSkip={skip}
              onNext={goNext}
            />
          </>
        )
      )}
    </div>
  );
}
