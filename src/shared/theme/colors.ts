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
  background: '#01030a',
  surface: '#090d20',
  surfaceElevated: '#0c1530',
  surfaceMuted: '#111a34',
  border: '#141b33',
  borderSoft: '#1d2546',
  textPrimary: '#f8fafc',
  textSecondary: '#cbd5f5',
  textPlaceholder: '#94a3b8',
  overlay: 'rgba(255, 255, 255, 0.06)',
  heroGradientStart: '#050c1e',
  heroGradientEnd: '#1a2a5e',
  cardShadow: '0px 12px 24px rgba(15, 23, 42, 0.45)',
};
