import axe from "axe-core";
import { render } from "@testing-library/react";
import type * as React from "react";
import { expect } from "vitest";

// INTERNAL kit (bukan kontrak): helper runtime-test §6b STYLE.md.
// Memaksa lubang yang lolos tsc (spread objek bermuatan style/className)
// lalu assert visual kit tak berubah.
export const EVIL_STYLE = { background: "rgb(255, 0, 0)" }; // kelir-allow: muatan serangan runtime-test, bukan visual kit
export const EVIL_CLASS = "evil-hack";

export function forceSpread(extra: Record<string, unknown>): any {
  // Sengaja `any`: inilah lubang yang diakui §6b — tsc tak bisa menutup
  // spread runtime, jadi test memaksa lewat any lalu assert DOM-nya.
  return extra;
}

export function renderSealed(ui: React.ReactElement) {
  return render(ui);
}

// Visual kit tak berubah: tak ada class asing, tak ada inline style asing.
// Kelas MUI/kit (Mui*, css-*) dan style milik kit (background token dsb.)
// diizinkan — yang dilarang hanya muatan paksa EVIL_* (terdeteksi via nilai
// rgb merah, bukan via properti kosong).
export function expectSealed(el: Element) {
  const htmlEl = el as HTMLElement;
  const styleAttr = htmlEl.getAttribute("style") ?? "";
  expect(htmlEl.className).not.toContain(EVIL_CLASS);
  expect(htmlEl.style.background).not.toContain("255, 0, 0");
  expect(styleAttr).not.toContain("255, 0, 0");
  expect(styleAttr).not.toContain("255,0,0");
  expect(styleAttr).not.toContain("evil-hack");
}

export async function expectNoAxeViolations(container: HTMLElement) {
  const { violations } = await axe.run(container, {
    // jsdom tanpa layout engine/canvas sehingga color-contrast tak dapat
    // dihitung — kontras dicakup token sendiri + screenshot regression P1d.
    rules: { "color-contrast": { enabled: false } },
  });
  expect(violations).toEqual([]);
}
