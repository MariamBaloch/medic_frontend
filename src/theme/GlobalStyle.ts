import { createGlobalStyle } from "styled-components";
import { colors } from "@theme/tokens";

export const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    width: 100%;
    min-width: 320px;
    min-height: 100%;
    margin: 0;
    font-size: 13px;
  }

  body {
    min-height: 100vh;
    font-size: 1rem;
    color: ${colors.text};
    font-family: Inter, ui-sans-serif, system-ui, -apple-system,
      BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  button,
  input {
    font: inherit;
  }

  .ant-btn.ant-btn-disabled,
  .ant-btn:disabled {
    color: ${colors.textMuted};
  }
`;
