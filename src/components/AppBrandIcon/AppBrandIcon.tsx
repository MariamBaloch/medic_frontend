import { AppBrandIconRoot } from "./AppBrandIcon.styles";

interface AppBrandIconProps {
  compact?: boolean;
}

export function AppBrandIcon({ compact = false }: AppBrandIconProps) {
  return <AppBrandIconRoot $compact={compact}>♡</AppBrandIconRoot>;
}
