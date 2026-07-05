import { tokens } from './tokens';

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: tokens.typography.caption.fontSize,
    sm: 14,
    md: tokens.typography.body.fontSize,
    lg: tokens.typography.h2.fontSize,
    xl: tokens.typography.h1.fontSize,
    xxl: 32,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  styles: tokens.typography,
} as const;
