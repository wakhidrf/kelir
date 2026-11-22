// 64. Questionnaire
// Render split into internal modules (progress/item/nav/complete/model, P2 done).
export interface QuestionnaireOption {
  label: string;
  value: string;
}
export interface QuestionnaireQuestion {
  id: string;
  type: "single" | "multiple" | "freeform";
  title: string;
  description?: string;
  options?: QuestionnaireOption[];
  placeholder?: string;
  required?: boolean;
  skippable?: boolean;
}

export interface QuestionnaireProps {
  questions: QuestionnaireQuestion[];
  value?: Record<string, string | string[]>;
  defaultValue?: Record<string, string | string[]>;
  onChange?: (value: Record<string, string | string[]>) => void;
  onComplete?: (value: Record<string, string | string[]>) => void;
  submitLabel?: string;
  skipLabel?: string;
  nextLabel?: string;
  backLabel?: string;
  completedLabel?: string;
}