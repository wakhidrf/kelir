import { css } from "../kelir-variants";
import { Button } from "./button";

// Navigasi Questionnaire (internal, pecah P2 §8): tombol kembali/lewati/
// lanjut-kirim milik kit. Props lokal, tanpa §5.
interface QuestionnaireNavProps {
  backLabel: string;
  skipLabel: string;
  nextLabel: string;
  submitLabel: string;
  canGoBack: boolean;
  canSkip: boolean;
  canProceed: boolean;
  isLast: boolean;
  onBack: () => void;
  onSkip: () => void;
  onNext: () => void;
}

export function QuestionnaireNav({
  backLabel,
  skipLabel,
  nextLabel,
  submitLabel,
  canGoBack,
  canSkip,
  canProceed,
  isLast,
  onBack,
  onSkip,
  onNext,
}: QuestionnaireNavProps) {
  const gap = css.layout.space.sm;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap,
        flexWrap: "wrap",
      }}
    >
      <div>
        {canGoBack && (
          <Button variant="ghost" onClick={onBack}>
            {backLabel}
          </Button>
        )}
      </div>
      <div style={{ display: "flex", gap, flexWrap: "wrap" }}>
        {canSkip && (
          <Button variant="ghost" onClick={onSkip}>
            {skipLabel}
          </Button>
        )}
        <Button variant="primary" disabled={!canProceed} onClick={onNext}>
          {isLast ? submitLabel : nextLabel}
        </Button>
      </div>
    </div>
  );
}
