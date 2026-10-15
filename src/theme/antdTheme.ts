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
    colorLink: colors.primary,
    colorLinkHover: colors.textSecondary,
    colorLinkActive: colors.primary,
    fontFamily: "Inter, sans-serif",
  },
  components: {
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
    },
    InputNumber: {
      borderRadius: 14,
      paddingBlock: 12,
      paddingInline: 16,
    },
    Menu: {
      darkItemBg: colors.sidebar,
      darkItemSelectedBg: colors.sidebarActive,
      darkItemHoverBg: colors.sidebarActive,
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
