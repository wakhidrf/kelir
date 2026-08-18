import * as React from "react";
import type { QuestionnaireProps, QuestionnaireQuestion } from "../kelir-types";
import { css } from "../kelir-variants";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { RadioGroup } from "./radio-group";
import { Textarea } from "./textarea";

type AnswerValue = string | string[];
type Answers = Record<string, AnswerValue>;

const surface = css.colors.surface;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;
const borderLight = css.border.light;
const primary = css.colors.primary;
const onPrimary = css.on.primary;
const track = css.track;
const convex = css.shadows.convex;
const blur = css.motion.blur.backdrop;
const radiusSm = css.radius.sm;
const radiusLg = css.radius.lg;
const spaceXs = css.layout.space.xs;
const spaceSm = css.layout.space.sm;
const spaceMd = css.layout.space.md;
const spaceLg = css.layout.space.lg;
const spaceXl = css.layout.space.xl;
const typeH2 = css.typography.scale.h2;
const typeBody = css.typography.scale.body;

function isAnswered(
  question: QuestionnaireQuestion,
  value: AnswerValue | undefined,
): boolean {
  if (question.type === "multiple") {
    return Array.isArray(value) && value.length > 0;
  }
  return typeof value === "string" && value.trim().length > 0;
}

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
  style,
  ...props
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
  const canProceed =
    !current?.required || current.skippable ? true : answered;
  const isLast = step === total - 1;
  const pct = completed ? 100 : total === 0 ? 0 : ((step + 1) / total) * 100;

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

  const renderQuestion = (question: QuestionnaireQuestion) => {
    const answer = answers[question.id];
    if (question.type === "single") {
      return (
        <RadioGroup
          value={(typeof answer === "string" ? answer : "") as string}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAnswer(question.id, e.target.value)
          }
          options={question.options ?? []}
        />
      );
    }
    if (question.type === "multiple") {
      const selected = Array.isArray(answer) ? answer : [];
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: spaceSm,
          }}
        >
          {(question.options ?? []).map((option) => (
            <Checkbox
              key={option.value}
              label={option.label}
              checked={selected.includes(option.value)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const checked = e.target.checked;
                const nextSelected = checked
                  ? [...selected, option.value]
                  : selected.filter((v) => v !== option.value);
                setAnswer(question.id, nextSelected);
              }}
            />
          ))}
        </div>
      );
    }
    return (
      <Textarea
        placeholder={question.placeholder}
        value={(typeof answer === "string" ? answer : "") as string}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setAnswer(question.id, e.target.value)
        }
      />
    );
  };

  return (
    <div
      {...props}
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
        ...style,
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: spaceMd,
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: primary,
              color: onPrimary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              boxShadow: convex,
            }}
          >
            ✓
          </div>
          <div
            style={{
              fontSize: typeH2,
              fontWeight: 700,
              color: textPrimary,
            }}
          >
            {completedLabel ?? "Thank you!"}
          </div>
          <div style={{ fontSize: typeBody, color: textSecondary }}>
            {
              Object.keys(answers).filter((id) => {
                const q = questions.find((item) => item.id === id);
                return q ? isAnswered(q, answers[id]) : false;
              }).length
            }{" "}
            of {total} questions answered.
          </div>
          <Button variant="ghost" onClick={restart}>
            Restart
          </Button>
        </div>
      ) : (
        <>
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
                {current.title}
              </h3>
              {current.required && !current.skippable && (
                <span style={{ color: primary, fontSize: "14px" }}>*</span>
              )}
              {current.skippable && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: textSecondary,
                    border: `1px solid ${borderLight}`,
                    borderRadius: radiusSm,
                    padding: "2px 8px",
                  }}
                >
                  optional
                </span>
              )}
            </div>
            {current.description && (
              <p
                style={{
                  margin: 0,
                  fontSize: typeBody,
                  color: textSecondary,
                  lineHeight: 1.5,
                }}
              >
                {current.description}
              </p>
            )}
          </div>

          <div>{renderQuestion(current)}</div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: spaceSm,
              flexWrap: "wrap",
            }}
          >
            <div>
              {step > 0 && (
                <Button variant="ghost" onClick={goBack}>
                  {backLabel}
                </Button>
              )}
            </div>
            <div style={{ display: "flex", gap: spaceSm, flexWrap: "wrap" }}>
              {current.skippable && (
                <Button variant="ghost" onClick={skip}>
                  {skipLabel}
                </Button>
              )}
              <Button variant="primary" disabled={!canProceed} onClick={goNext}>
                {isLast ? submitLabel : nextLabel}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
