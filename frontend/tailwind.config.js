/** @type {import('tailwindcss').Config} */


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
        "3xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
