import { CodeBlock } from "./code-block";

// code wajib.
// @ts-expect-error code wajib
<CodeBlock />;

// code/language/copyLabel = teks.
<CodeBlock code="const a = 1;" language="ts" copyLabel="Salin" />;
// @ts-expect-error language teks
<CodeBlock code="const a = 1;" language={1} />;

// Segel: tanpa style/sx/className.
// @ts-expect-error tanpa style
<CodeBlock code="const a = 1;" style={{ color: "red" }} />;
// @ts-expect-error tanpa sx
<CodeBlock code="const a = 1;" sx={{ color: "red" }} />;
// @ts-expect-error tanpa className
<CodeBlock code="const a = 1;" className="x" />;
