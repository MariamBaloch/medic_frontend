import "styled-components";
import type { styledTheme } from "./styledTheme";

type AppTheme = typeof styledTheme;

declare module "styled-components" {
  export interface DefaultTheme extends AppTheme {}
}
