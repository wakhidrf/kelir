import MuiBox from "@mui/material/Box";
import type * as React from "react";
import { css } from "../kelir-kit/kit-create-css";
import { MOBILE_MAX, page } from "./page-frame-tokens";

type PageFrameBodyProps = {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export function PageFrameBody({ header, footer, children }: PageFrameBodyProps) {
  return (
    <MuiBox
      style={{
        width: "100%",
        maxWidth: page.contentMax,
        marginLeft: "auto",
        marginRight: "auto",
        display: "flex",
        flexDirection: "column",
        gap: page.gap,
      }}
    >
      {header ? (
        <MuiBox
          component="header"
          sx={{ [MOBILE_MAX]: { gap: page.headerGapMobile } }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: page.headerGap,
          }}
        >
          {header}
        </MuiBox>
      ) : null}
      <MuiBox
        component="main"
        style={{
          minHeight: page.mainMinHeight,
          paddingTop: page.mainPaddingBlock,
          paddingBottom: page.mainPaddingBlock,
        }}
      >
        {children}
      </MuiBox>
      {footer ? (
        <MuiBox
          component="footer"
          style={{
            textAlign: "center",
            paddingTop: page.footerPaddingTop,
            borderTop: `1px solid ${css.border.light}`,
            color: css.colors.textSecondary,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: page.footerGap,
          }}
        >
          {footer}
        </MuiBox>
      ) : null}
    </MuiBox>
  );
}