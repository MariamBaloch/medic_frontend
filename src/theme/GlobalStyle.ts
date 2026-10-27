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
    .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    background-color: ${colors.backgroundSoft};
    color: ${colors.text} !important;
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
    background-color: ${colors.backgroundSoft};
    color: ${colors.text} !important;
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before {
    background-color: ${colors.backgroundSoft};
  }

.appointment-popover .ant-popover-container {
  padding: 0 !important;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.ant-steps-item-icon {
  background-color: ${colors.primary} !important;

  span {
    color: white;
  }
}

.ant-steps .ant-steps-item-icon {
  width: 35px;
  height: 35px;
}

 ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.primary} ; 
  }

  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
   
  }
  ::-webkit-scrollbar-thumb:hover {
   cursor: pointer;
  }

  .ant-badge-count {
    max-width: 18px;
  }
`;
