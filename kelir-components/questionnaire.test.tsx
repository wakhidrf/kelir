// @vitest-environment jsdom
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Questionnaire } from "./questionnaire";
import {
  EVIL_CLASS,
  EVIL_STYLE,
  expectNoAxeViolations,
  expectSealed,
  forceSpread,
  renderSealed,
} from "./sealed-test-helper";

describe("Questionnaire sealed (Gel.3c-11 §6b)", () => {
  it("paksa spread tak mengubah visual; jawab + submit kirim Record", () => {
    const onComplete = vi.fn();
    const { container } = renderSealed(
      <Questionnaire
        questions={[
          { id: "nama", type: "freeform", title: "Nama?", placeholder: "Tulis nama" },
        ]}
        submitLabel="Kirim"
        onComplete={onComplete}
        {...forceSpread({ style: EVIL_STYLE, className: EVIL_CLASS })}
      />,
    );
    expectSealed(container.firstElementChild as HTMLElement);
    fireEvent.change(screen.getByPlaceholderText("Tulis nama"), {
      target: { value: "Rania" },
    });
    fireEvent.click(screen.getByText("Kirim"));
    expect(onComplete).toHaveBeenCalledWith({ nama: "Rania" });
  });

  it("bebas pelanggaran axe", async () => {
    const { container } = renderSealed(
      <Questionnaire
        questions={[{ id: "nama", type: "freeform", title: "Nama?" }]}
      />,
    );
    await expectNoAxeViolations(container);
  });
});
