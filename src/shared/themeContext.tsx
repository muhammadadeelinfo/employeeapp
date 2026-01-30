import { createContext, useCallback, useContext, useMemo, type PropsWithChildren } from 'react';
import { darkTheme } from './theme/colors';

type ThemeName = 'dark';

type ThemeContextValue = {
  mode: ThemeName;
  theme: typeof darkTheme;
  setMode: (mode: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const mode: ThemeName = 'dark';
  const theme = darkTheme;
  const setMode = useCallback(() => {
    /* no-op: dark mode only */
  }, []);

  const value = useMemo(
    () => ({
      mode,
      theme,
      setMode,
    }),
    [mode, theme, setMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('ThemeProvider is missing');
  }
  return context;
};
