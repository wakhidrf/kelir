import { TruncatedText } from "./truncated-text";

// text wajib.
 // @ts-expect-error text wajib
<TruncatedText maxWidth={200} />;

// maxWidth angka (data px), bukan string.
<TruncatedText text="tautan" maxWidth={200} />;
 // @ts-expect-error maxWidth angka
<TruncatedText text="tautan" maxWidth="200px" />;

// Segel: tanpa style/sx/className.
 // @ts-expect-error tanpa style
<TruncatedText text="tautan" style={{ color: "red" }} />;
 // @ts-expect-error tanpa sx
<TruncatedText text="tautan" sx={{ color: "red" }} />;
 // @ts-expect-error tanpa className
<TruncatedText text="tautan" className="x" />;
