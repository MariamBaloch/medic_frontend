import { Radio } from "antd";
import styled from "styled-components";

export const RadioButtonGroup = styled(Radio.Group)`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  .ant-radio-button-wrapper {
    height: 42px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;
