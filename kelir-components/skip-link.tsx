// Skip link (a11y): the first focusable element on the page, parked above the
// viewport until focused. The class and its rules are kit-owned (see
// skipLinkCss in kelir-style-constants), so a consumer renders <SkipLink /> and
// never writes CSS of its own (§3).
export interface SkipLinkProps {
  /** Visible label; keep it descriptive in the page language. */
  label: string;
  /** id of the main landmark. Defaults to "main". */
  targetId?: string;
}

export function SkipLink({ label, targetId = "main" }: SkipLinkProps) {
  return (
    <a className="kelir-skip" href={`#${targetId}`}>
      {label}
    </a>
  );
}