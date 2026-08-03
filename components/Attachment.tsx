import * as React from "react";
import { useKelir } from "../KelirProvider";
import { AttachmentProps } from "../types";
import { Attachment as NeumorphismAttachment } from "../themes/neumorphism/attachment";

export function Attachment(props: AttachmentProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismAttachment {...props} />;
  }

  return null;
}
