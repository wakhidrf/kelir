// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import type { QuestionnaireQuestion } from "../kelir-types";
import { isAnswered } from "./questionnaire-model";

const single: QuestionnaireQuestion = {
  id: "q1",
  type: "single",
  title: "Pilih?",
  options: [{ label: "A", value: "a" }],
};
const multiple: QuestionnaireQuestion = {
  id: "q2",
  type: "multiple",
  title: "Pilih semua?",
  options: [{ label: "A", value: "a" }],
};
const freeform: QuestionnaireQuestion = {
  id: "q3",
  type: "freeform",
  title: "Nama?",
};

describe("Questionnaire model (P2 pecah)", () => {
  it("isAnswered per tipe", () => {
    expect(isAnswered(single, "a")).toBe(true);
    expect(isAnswered(single, "")).toBe(false);
    expect(isAnswered(single, undefined)).toBe(false);
    expect(isAnswered(multiple, ["a"])).toBe(true);
    expect(isAnswered(multiple, [])).toBe(false);
    expect(isAnswered(multiple, "a")).toBe(false);
    expect(isAnswered(freeform, "Rania")).toBe(true);
    expect(isAnswered(freeform, "   ")).toBe(false);
    expect(isAnswered(freeform, undefined)).toBe(false);
  });
});
