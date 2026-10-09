import type { ThemeConfig } from "antd";
import { colors } from "./tokens";

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: colors.primary,
    colorBgLayout: colors.background,
    colorBgContainer: colors.surface,
    colorText: colors.text,
    colorTextSecondary: colors.textSecondary,
    colorBorder: colors.border,
    borderRadius: 14,
    controlHeight: 52,
    controlHeightLG: 54,
    fontFamily: "Inter, sans-serif",
  },
  components: {
    DatePicker: {
      cellWidth: 36,
      cellHeight: 24,
      textHeight: 40,
      withoutTimeCellHeight: 66,
    },
    Form: {
      itemMarginBottom: 24,
      labelColor: colors.text,
      labelFontSize: 13,
    },
  },
};
