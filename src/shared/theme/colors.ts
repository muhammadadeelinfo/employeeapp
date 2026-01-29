const sharedColors = {
  primary: '#6366f1',
  primaryAccent: '#7c3aed',
  success: '#22c55e',
  fail: '#ef4444',
  caution: '#f97316',
  shadowBlue: 'rgba(99, 102, 241, 0.25)',
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
};

export const darkTheme = {
  ...sharedColors,
  background: '#040915',
  surface: '#0b132b',
  surfaceElevated: '#111a35',
  surfaceMuted: '#141c3c',
  border: '#1c2342',
  borderSoft: '#2b3353',
  textPrimary: '#f8fafc',
  textSecondary: '#cbd5f5',
  textPlaceholder: '#9ca3af',
  overlay: 'rgba(255, 255, 255, 0.06)',
};
