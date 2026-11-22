import { css } from "../kelir-kit/kit-create-css";

// Kit mobile threshold (single source: layout.mobile token 600px).
export const MOBILE_MAX = `@media (max-width: calc(${css.layout.breakpoints.mobile} - 0.02px))`;

export const page = css.layout.page;