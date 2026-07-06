/** @type {import('tailwindcss').Config} */

// Colors are backed by CSS custom properties (defined in index.css) so the
// whole palette lives in one place and still supports opacity modifiers
// (e.g. bg-danger/10).
function token(variable) {
  return ({ opacityValue }) =>
    opacityValue !== undefined ? `rgb(var(${variable}) / ${opacityValue})` : `rgb(var(${variable}))`;
}

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: token("--c-bg"),
        surface: token("--c-surface"),
        elevated: token("--c-elevated"),
        border: { DEFAULT: token("--c-border"), strong: token("--c-border-strong") },
        ink: { DEFAULT: token("--c-ink"), secondary: token("--c-ink-secondary"), muted: token("--c-ink-muted") },
        primary: {
          50: token("--c-accent-50"),
          400: token("--c-accent-400"),
          500: token("--c-accent"),
          600: token("--c-accent"),
          700: token("--c-accent-700"),
          900: token("--c-accent-900"),
        },
        success: token("--c-success"),
        warning: token("--c-warning"),
        danger: token("--c-danger"),
        // Tailwind's default gray scale is remapped to the same tokens above.
        // This is what lets every component we did NOT touch (forms, dialogs,
        // empty states, badges — all of which use plain text-gray-500,
        // bg-gray-50, border-gray-100, etc.) automatically render correctly
        // on the new dark surface, with zero edits to those files.
        gray: {
          50: token("--c-bg"),
          100: token("--c-surface"),
          200: token("--c-elevated"),
          300: token("--c-border-strong"),
          400: token("--c-ink-muted"),
          500: token("--c-ink-secondary"),
          600: token("--c-ink-secondary"),
          700: token("--c-ink"),
          800: token("--c-ink"),
          900: token("--c-ink"),
        },
      },
      borderRadius: {
        // One consistent scale used everywhere: buttons/inputs 12px (xl,
        // Tailwind default), cards 16px (2xl, default), modals 20px (below).
        "3xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
