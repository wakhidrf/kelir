// Clipboard helpers (internal): async Clipboard API with a hidden-textarea
// fallback when access is denied or missing. Rendering lives in code-block.tsx.
export function copyText(codeText: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard
      .writeText(codeText)
      .catch(() => fallbackCopy(codeText));
  }
  return fallbackCopy(codeText);
}

// Fallback outside the document flow, with no visual trace and no focus shift.
function fallbackCopy(codeText: string): Promise<void> {
  const textarea = document.createElement("textarea");
  textarea.value = codeText;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  textarea.remove();
  return ok ? Promise.resolve() : Promise.reject(new Error("copy denied"));
}