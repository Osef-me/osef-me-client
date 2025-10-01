import type React from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

type ThemeContextValue = {
  currentTheme: string;
  setTheme: (theme: string) => void;
  themes: string[];
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const AVAILABLE_THEMES = [
  "light","dark","cupcake","bumblebee","emerald","corporate","synthwave","retro","cyberpunk","valentine","halloween","garden","forest","aqua","lofi","pastel","fantasy","wireframe","black","luxury","dracula","cmyk","autumn","business","acid","lemonade","night","coffee","winter"
];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<string>('dracula');

  const applyTheme = useCallback((theme: string) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    // Best-effort compatibility with theme utility classes
    const prevClass = Array.from(root.classList).find(c => c.startsWith('theme-'));
    if (prevClass) root.classList.remove(prevClass);
    root.classList.add(`theme-${theme}`);
    // Also mirror on body for libs that read from body
    document.body.setAttribute('data-theme', theme);
  }, []);

  useEffect(() => {
    // Load theme from Rust config
    const loadTheme = async () => {
      try {
        const savedTheme = await invoke<string>('get_theme');
        console.log('✅ Theme loaded from config:', savedTheme);
        setCurrentTheme(savedTheme);
        applyTheme(savedTheme);
      } catch (error) {
        console.error('Failed to load theme:', error);
        const defaultTheme = 'dracula';
        setCurrentTheme(defaultTheme);
        applyTheme(defaultTheme);
      }
    };
    loadTheme();
  }, [applyTheme]);

  const setTheme = useCallback(async (theme: string) => {
    setCurrentTheme(theme);
    applyTheme(theme);
    
    // Save theme to Rust config
    try {
      await invoke('set_theme', { theme });
      console.log('✅ Theme saved to config:', theme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }, [applyTheme]);

  const value = useMemo<ThemeContextValue>(() => ({ currentTheme, setTheme, themes: AVAILABLE_THEMES }), [currentTheme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};


