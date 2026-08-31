# ADR-004: Tailwind CSS v4 Design Token Architecture for Multi-Tenant Theming

## Status
Accepted

## Context
Enterprise ERP platforms require robust multi-tenant white-labeling and customizable brand themes (e.g., custom accent colors, dark/light modes, high-contrast accessibility modes) without requiring stylesheet recompilation.

## Problem
Hardcoding color classes (`bg-blue-600`, `text-gray-900`) throughout UI components prevents dynamic tenant branding and leads to inconsistent visual styling.

## Original Design
Ad-hoc inline styles and hardcoded color utility classes distributed arbitrarily across components.

## New Design
A tokenized CSS architecture using Tailwind CSS v4 (`@import "tailwindcss";`) combined with CSS custom properties (`var(--nebula-*)`) defined in global theme files (`src/styles/theme.css` and `tokens.css`).

## Reason for Change
To support dynamic enterprise white-labeling, instant theme switching, and strict adherence to the Nebula ERP Anti-Slop visual guidelines.

## Advantages
- **Dynamic Theming**: Tenants can rebrand the entire ERP instance simply by updating CSS custom property variables.
- **Maintainability**: Eliminates arbitrary color codes and enforces a consistent design system.
- **Performance**: Zero runtime CSS-in-JS overhead; compiled entirely via native CSS variables and Tailwind utility classes.

## Disadvantages
- **Discipline Required**: Developers must use Nebula design tokens rather than default Tailwind palette shortcuts.

## Affected Modules
`apps/web/src/styles/`, `apps/web/src/theme/`, and all UI components across all modules.

## Future Implications
Enables tenant-specific configuration settings in the Settings module to inject custom CSS variable overrides instantly on login.
