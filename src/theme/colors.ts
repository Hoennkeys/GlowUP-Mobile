import { tokens } from './tokens';

export const colors = {
  primary: tokens.colors.primary,
  primaryDark: tokens.colors.primaryDark,
  secondary: tokens.colors.accent,
  background: tokens.colors.bg,
  backgroundDark: tokens.colors.bgDark,
  surface: tokens.colors.surface,
  surfaceDark: tokens.colors.surfaceDark,
  text: tokens.colors.text,
  textSecondary: tokens.colors.muted,
  textDark: tokens.colors.textDark,
  border: tokens.colors.border,
  success: tokens.colors.success,
  warning: tokens.colors.warning,
  error: tokens.colors.error,
} as const;
