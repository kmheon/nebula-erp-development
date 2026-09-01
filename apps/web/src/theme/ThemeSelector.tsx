import { useTheme } from "./useTheme";
import ThemeOptions from "./ThemeOptions";
import type { ThemeTokens } from "./themes";

const tokenLabels: Record<keyof ThemeTokens, string> = {
  "--nebula-primary": "Primary Brand Color",
  "--nebula-primary-hover": "Primary Hover Color",
  "--nebula-secondary": "Secondary Brand Color",
  "--nebula-accent": "Accent Color",
  "--nebula-background": "Background Color",
  "--nebula-surface": "Surface / Card Color",
  "--nebula-surface-muted": "Muted Surface Color",
  "--nebula-text-primary": "Primary Text Color",
  "--nebula-text-secondary": "Secondary Text Color",
  "--nebula-text-muted": "Muted Text Color",
  "--nebula-border": "Border Color",
};

/**
 * Theme picker and custom theme builder for the main Settings page.
 * Fully customizable live and linked with the sidebar quick theme switcher.
 */
export default function ThemeSelector() {
  const { theme, customTokens, setCustomToken, resetCustomTokens } = useTheme();

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold">Preset Themes</h2>
          <p className="mt-1 text-sm text-[var(--nebula-text-secondary)]">
            Choose a professional preset theme or customize colors below. Changes apply instantly and sync with the sidebar switcher.
          </p>
        </div>

        <ThemeOptions className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" />
      </section>

      <section className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Custom Theme Builder</h2>
            <p className="mt-1 text-sm text-[var(--nebula-text-secondary)]">
              Fine-tune individual CSS tokens for the active theme ({theme.name}). Fully customizable live.
            </p>
          </div>
          {Object.keys(customTokens).length > 0 && (
            <button
              onClick={resetCustomTokens}
              className="rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)] px-3 py-1.5 text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Reset Custom Colors
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {(Object.keys(tokenLabels) as (keyof ThemeTokens)[]).map((token) => {
            const defaultValue = theme.tokens[token];
            const currentValue = customTokens[token] || defaultValue;

            return (
              <div key={token} className="rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)] p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase text-[var(--nebula-text-secondary)]">
                    {tokenLabels[token]}
                  </label>
                  <span className="font-mono text-xs text-[var(--nebula-text-muted)]">{token}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentValue.startsWith("#") ? currentValue : defaultValue}
                    onChange={(e) => setCustomToken(token, e.target.value)}
                    className="h-8 w-12 cursor-pointer rounded border border-[var(--nebula-border)] bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={currentValue}
                    onChange={(e) => setCustomToken(token, e.target.value)}
                    className="w-full rounded-md border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-2.5 py-1 text-xs font-mono"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

