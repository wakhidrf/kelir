import { Input } from "./input";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// `onChange` semantik (string, bukan event); size/type union tertutup.
export function inputContractChecks() {
  const okControlled = (
    <Input
      value="isi"
      onChange={(v: string) => console.log(v)}
      placeholder="nama"
      type="text"
      size="medium"
      id="i"
      aria-label="nama"
    />
  );
  const okUncontrolled = (
    <Input defaultValue="x" type="password" size="small" disabled />
  );

  // @ts-expect-error — style passthrough haram
  const noStyle = <Input style={{ background: "red" }} />;
  // @ts-expect-error — sx passthrough haram
  const noSx = <Input sx={{ m: 1 }} />;
  // @ts-expect-error — className passthrough haram
  const noClassName = <Input className="my-input" />;
  // @ts-expect-error — onChange event mentah haram (kontrak: string)
  const noRawOnChange = <Input onChange={(e: { target: { value: string } }) => e} />;
  // @ts-expect-error — type bebas haram (union tertutup)
  const noRawType = <Input type="date" />;
  // @ts-expect-error — size bebas haram (small|medium saja)
  const noRawSize = <Input size="large" />;
  // @ts-expect-error — prop tak dikenal tidak diteruskan ke DOM
  const noRest = <Input title="x" />;

  return {
    okControlled,
    okUncontrolled,
    noStyle,
    noSx,
    noClassName,
    noRawOnChange,
    noRawType,
    noRawSize,
    noRest,
  };
}
