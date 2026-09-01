import {
  createContext,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  defaultThemeId,
  isThemeId,
  THEME_STORAGE_KEY,
  themes,
  type Theme,
  type ThemeId,
  type ThemeTokens,
} from "./themes";

export const CUSTOM_TOKENS_STORAGE_KEY = "nebula-custom-tokens";

export interface ThemeContextValue {
  /** The currently active theme. */
  theme: Theme;
  /** The id of the currently active theme. */
  themeId: ThemeId;
  /** All available themes, for building selectors. */
  themes: Theme[];
  /** Switch to a different theme and persist the choice. */
  setTheme: (id: ThemeId) => void;
  /** Custom token overrides for user-defined theme styling. */
  customTokens: Partial<ThemeTokens>;
  /** Update a specific custom token override. */
  setCustomToken: (token: keyof ThemeTokens, value: string) => void;
  /** Reset all custom token overrides. */
  resetCustomTokens: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredThemeId(): ThemeId {
  if (typeof window === "undefined") {
    return defaultThemeId;
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

  return isThemeId(stored) ? stored : defaultThemeId;
}

function readStoredCustomTokens(): Partial<ThemeTokens> {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const stored = window.localStorage.getItem(CUSTOM_TOKENS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Apply a theme's tokens and custom token overrides to the document root as CSS custom properties.
 */
function applyTheme(theme: Theme, customTokens: Partial<ThemeTokens>): void {
  const root = document.documentElement;

  root.setAttribute("data-theme", theme.id);

  for (const [token, value] of Object.entries(theme.tokens)) {
    root.style.setProperty(token, value);
  }

  for (const [token, value] of Object.entries(customTokens)) {
    if (value) {
      root.style.setProperty(token, value);
    }
  }
}

type ThemeProviderProps = {
  children: ReactNode;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeId, setThemeId] = useState<ThemeId>(readStoredThemeId);
  const [customTokens, setCustomTokens] = useState<Partial<ThemeTokens>>(readStoredCustomTokens);

  useLayoutEffect(() => {
    applyTheme(themes[themeId], customTokens);
  }, [themeId, customTokens]);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeId(id);
    window.localStorage.setItem(THEME_STORAGE_KEY, id);
  }, []);

  const setCustomToken = useCallback((token: keyof ThemeTokens, value: string) => {
    setCustomTokens((prev) => {
      const next = { ...prev, [token]: value };
      window.localStorage.setItem(CUSTOM_TOKENS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const resetCustomTokens = useCallback(() => {
    setCustomTokens({});
    window.localStorage.removeItem(CUSTOM_TOKENS_STORAGE_KEY);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: themes[themeId],
      themeId,
      themes: Object.values(themes),
      setTheme,
      customTokens,
      setCustomToken,
      resetCustomTokens,
    }),
    [themeId, customTokens, setTheme, setCustomToken, resetCustomTokens],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
