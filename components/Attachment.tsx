import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { AttachmentProps } from "../types.js";
import { Attachment as NeumorphismAttachment } from "../themes/neumorphism/attachment.js";

export function Attachment(props: AttachmentProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismAttachment {...props} />;
  }

  return null;
}
