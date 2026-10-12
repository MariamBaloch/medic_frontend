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
    controlHeight: 48,
    controlHeightLG: 54,
    fontFamily: "Inter, sans-serif",
  },
  components: {
    Button: {
      borderRadius: 14,
      controlHeight: 48,
      fontWeight: 800,
      primaryShadow: "0 16px 30px rgba(23, 107, 91, 0.24)",
    },
    DatePicker: {
      borderRadius: 14,
      cellWidth: 36,
      cellHeight: 24,
      textHeight: 40,
      withoutTimeCellHeight: 66,
    },
    Form: {
      itemMarginBottom: 10,
      labelColor: colors.text,
      labelFontSize: 13,
      labelHeight: 18,
      verticalLabelPadding: "0 0 3px",
    },
    Input: {
      borderRadius: 14,
      paddingBlock: 12,
      paddingInline: 16,
      activeShadow: "0 0 0 4px rgba(23, 107, 91, 0.12)",
    },
    InputNumber: {
      borderRadius: 14,
      paddingBlock: 12,
      paddingInline: 16,
      activeShadow: "0 0 0 4px rgba(23, 107, 91, 0.12)",
    },
    Menu: {
      darkItemBg: colors.sidebar,
      darkItemSelectedBg: colors.sidebarActive,
      darkItemHoverBg: colors.sidebarActive,
      darkItemColor: "rgba(255, 255, 255, 0.72)",
      darkItemSelectedColor: colors.surface,
    },
    Segmented: {
      itemSelectedBg: colors.primary,
      itemSelectedColor: colors.surface,
      trackBg: colors.background,
    },
    Select: {
      borderRadius: 14,
      controlHeight: 48,
    },
  },
};
