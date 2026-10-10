import { KelirProvider } from "./kelir-provider";

// Type-test negatif (§3c/§6b STYLE.md): provider satu-satunya titik visual
// yang legit — props sah HANYA defaultTheme (union tertutup) + children.
// Ganti tema runtime via useKelir().setTheme / KelirSwitcher, bukan props.
export function kelirProviderContractChecks() {
  const ok = (
    <KelirProvider defaultTheme="neumorphism">
      <span>app</span>
    </KelirProvider>
  );

  // @ts-expect-error — defaultTheme wajib
  const noDefaultTheme = <KelirProvider>app</KelirProvider>;
  // @ts-expect-error — slug bebas haram (union tertutup 11 tema)
  const noRawSlug = <KelirProvider defaultTheme="dark-mode">app</KelirProvider>;
  // @ts-expect-error — prop theme haram (baca via context, tulis via setTheme)
  const noTheme = <KelirProvider defaultTheme="neumorphism" theme="neumorphism">app</KelirProvider>;
  // @ts-expect-error — style passthrough haram
  const noStyle = <KelirProvider defaultTheme="neumorphism" style={{}}>app</KelirProvider>;
  // @ts-expect-error — sx passthrough haram
  const noSx = <KelirProvider defaultTheme="neumorphism" sx={{}}>app</KelirProvider>;
  // @ts-expect-error — className passthrough haram
  const noClassName = <KelirProvider defaultTheme="neumorphism" className="x">app</KelirProvider>;

  return { ok, noDefaultTheme, noRawSlug, noTheme, noStyle, noSx, noClassName };
}
