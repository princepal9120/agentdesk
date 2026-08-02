import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: "var(--theme-bg)",
          fg: "var(--theme-fg)",
          surface: "var(--theme-surface)",
          "surface-muted": "var(--theme-surface-muted)",
          "surface-glass": "var(--theme-surface-glass)",
          border: "var(--theme-border)",
          "border-muted": "var(--theme-border-muted)",
          
          "btn-primary": "var(--theme-btn-primary)",
          "btn-primary-hover": "var(--theme-btn-primary-hover)",
          "btn-primary-fg": "var(--theme-btn-primary-fg)",
          
          "btn-secondary": "var(--theme-btn-secondary)",
          "btn-secondary-hover": "var(--theme-btn-secondary-hover)",
          "btn-secondary-fg": "var(--theme-btn-secondary-fg)",
          "btn-secondary-border": "var(--theme-btn-secondary-border)",
          
          "btn-accent": "var(--theme-btn-accent)",
          "btn-accent-hover": "var(--theme-btn-accent-hover)",
          "btn-accent-fg": "var(--theme-btn-accent-fg)",
          "btn-accent-border": "var(--theme-btn-accent-border)",
          
          ring: "var(--theme-ring)",
          
          "input-bg": "var(--theme-input-bg)",
          "input-border": "var(--theme-input-border)",
          "input-border-hover": "var(--theme-input-border-hover)",
          "input-border-focus": "var(--theme-input-border-focus)",
          "input-fg": "var(--theme-input-fg)",
          "input-placeholder": "var(--theme-input-placeholder)",
          
          label: "var(--theme-label)",
        },
      },
    },
  },
};

export default config;
