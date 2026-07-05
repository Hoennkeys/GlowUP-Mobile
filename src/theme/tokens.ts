export const tokens = {
  colors: {
    primary: '#7C3AED',
    primaryDark: '#5B21B6',
    accent: '#EC4899',
    bg: '#FFFFFF',
    bgDark: '#0F0F0F',
    surface: '#F9FAFB',
    surfaceDark: '#1A1A1A',
    text: '#111827',
    muted: '#6B7280',
    textDark: '#F9FAFB',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    shadow: 'rgba(124, 58, 237, 0.12)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 8,
    md: 16,
    lg: 24,
  },
  typography: {
    h1: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '700' as const,
    },
    h2: {
      fontSize: 20,
      lineHeight: 26,
      fontWeight: '600' as const,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400' as const,
    },
  },
} as const;

export type Tokens = typeof tokens;
