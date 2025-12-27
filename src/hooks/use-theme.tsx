import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export function useThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : false;

  const toggleTheme = (dark: boolean) => {
    setTheme(dark ? 'dark' : 'light');
  };

  return {
    isDark,
    mounted,
    toggleTheme,
    theme,
    setTheme,
  };
}
