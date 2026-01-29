import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import { lightTheme, darkTheme } from './theme/colors';

type ThemeName = 'light' | 'dark';

type ThemeContextValue = {
  mode: ThemeName;
  theme: typeof lightTheme;
  setMode: (mode: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [mode, setMode] = useState<ThemeName>('light');
  const theme = useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);

  const value = useMemo(
    () => ({
      mode,
      theme,
      setMode,
    }),
    [mode, theme]
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
