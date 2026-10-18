import { Quote } from "./quote";

// children boleh simpul, tetapi bukan atribut bebas: kontrak tertutup.
<Quote>Kutipan.</Quote>;

// Segel: tanpa style/sx/className.
// @ts-expect-error tanpa style
<Quote style={{ color: "red" }}>Kutipan.</Quote>;
// @ts-expect-error tanpa sx
<Quote sx={{ color: "red" }}>Kutipan.</Quote>;
// @ts-expect-error tanpa className
<Quote className="x">Kutipan.</Quote>;
