import { Avatar } from "./avatar";
import { Message } from "./message";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Message sender/time/text slot TEKS; avatar slot media; align MAKNA.
export function messageContractChecks() {
  const ok = (
    <Message
      sender="Admin Kelir"
      time="14:20"
      text="Selamat datang!"
      align="start"
    />
  );
  const okRight = (
    <Message
      avatar={<Avatar fallbackText="AK" />}
      sender="User"
      text="Bagus!"
      align="end"
    />
  );

  // @ts-expect-error - sender wajib
  const noSender = <Message text="tanpa pengirim" />;
  // @ts-expect-error - text wajib
  const noText = <Message sender="x" />;
  // @ts-expect-error - text non-string bukan kontrak Message
  const noNodeText = <Message sender="x" text={<b>tebal</b>} />;
  // @ts-expect-error - style milik kit
  const noStyle = <Message sender="x" text="y" style={{ margin: 4 }} />;
  // @ts-expect-error - align di luar union
  const noAlign = <Message sender="x" text="y" align="center" />;
  return { ok, okRight, noSender, noText, noNodeText, noStyle, noAlign };
}
