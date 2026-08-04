import { buildLegacyTheme, type LegacyThemeProps } from "sanity";

/** GTek brand palette — matches tailwind `gtek-navy` / `gtek-amber`. */
const themeProps: Partial<LegacyThemeProps> = {
  "--black": "#0A192F",
  "--white": "#ffffff",
  "--gray": "#64748b",
  "--gray-base": "#64748b",
  "--component-bg": "#ffffff",
  "--component-text-color": "#0A192F",
  "--brand-primary": "#0A192F",
  "--default-button-color": "#334155",
  "--default-button-primary-color": "#0A192F",
  "--default-button-success-color": "#15803d",
  "--default-button-warning-color": "#FFC107",
  "--default-button-danger-color": "#dc2626",
  "--state-info-color": "#0A192F",
  "--state-success-color": "#15803d",
  "--state-warning-color": "#FFC107",
  "--state-danger-color": "#dc2626",
  "--main-navigation-color": "#0A192F",
  "--main-navigation-color--inverted": "#ffffff",
  "--focus-color": "#FFC107",
};

export const gtekStudioTheme = buildLegacyTheme(themeProps);
