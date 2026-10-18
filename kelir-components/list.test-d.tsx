import { List } from "./list";

// items wajib.
// @ts-expect-error items wajib
<List />;

// items = simpul per butir (bukan angka/boolean).
<List items={["Pertama", "Kedua"]} ordered />;
// @ts-expect-error items larik simpul
<List items="Pertama" />;

// Segel: tanpa style/sx/className.
// @ts-expect-error tanpa style
<List items={["Pertama"]} style={{ color: "red" }} />;
// @ts-expect-error tanpa className
<List items={["Pertama"]} className="x" />;
