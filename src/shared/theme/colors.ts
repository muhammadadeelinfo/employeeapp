const sharedColors = {
  primary: '#818cf8',
  primaryAccent: '#a855f7',
  success: '#22c55e',
  fail: '#ef4444',
  caution: '#f97316',
  info: '#38bdf8',
};

export const lightTheme = {
  ...sharedColors,
  background: '#f6f6fb',
  surface: '#ffffff',
  surfaceElevated: '#f8fafc',
  surfaceMuted: '#eef2ff',
  border: '#e5e7eb',
  borderSoft: '#dfe3ee',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textPlaceholder: '#94a3b8',
  overlay: 'rgba(15, 23, 42, 0.04)',
  heroGradientStart: '#eef2ff',
  heroGradientEnd: '#dbeafe',
  cardShadow: '0px 8px 16px rgba(0, 0, 0, 0.08)',
};

export const darkTheme = {
  ...sharedColors,
  background: '#030819',
  surface: '#0c1325',
  surfaceElevated: '#111935',
  surfaceMuted: '#141c31',
  border: '#1d2442',
  borderSoft: '#2b3560',
  textPrimary: '#f8fafc',
  textSecondary: '#dbe2ff',
  textPlaceholder: '#a1b4ff',
  overlay: 'rgba(255, 255, 255, 0.08)',
  heroGradientStart: '#0b1535',
  heroGradientEnd: '#1f2f6f',
  cardShadow: '0px 16px 24px rgba(3, 7, 25, 0.6)',
};
