/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            // Clinical Minimalism Color Palette
            colors: {
                // CSS Variable-based colors (shadcn/ui compatible)
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },

                // Clinical Minimalism Theme Colors
                clinical: {
                    white: '#FFFFFF',
                    softBlue: '#D7EAFB',
                    softBlueDark: '#B8D9F8',
                    teal: '#2BB59B',
                    tealDark: '#249A84',
                    tealLight: '#ECFDF5',
                },
                grey: {
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E5E7EB',
                    300: '#C7C9CC',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                },

                // Semantic Status Colors
                success: {
                    light: '#ECFDF5',
                    DEFAULT: '#059669',
                    dark: '#047857',
                },
                warning: {
                    light: '#FFFBEB',
                    DEFAULT: '#D97706',
                    dark: '#B45309',
                },
                error: {
                    light: '#FEF2F2',
                    DEFAULT: '#DC2626',
                    dark: '#B91C1C',
                },
                info: {
                    light: '#EFF6FF',
                    DEFAULT: '#3B82F6',
                    dark: '#2563EB',
                },

                // Chart Colors (Pastel medical palette)
                chart: {
                    teal: '#2BB59B',
                    softBlue: '#93C5FD',
                    lavender: '#C4B5FD',
                    peach: '#FED7AA',
                    mint: '#A7F3D0',
                    rose: '#FECACA',
                },
            },

            // Border Radius (Medical-grade soft corners: 20-32px)
            borderRadius: {
                'none': '0',
                'sm': '0.25rem',    // 4px
                'DEFAULT': '0.5rem', // 8px
                'md': '0.75rem',    // 12px
                'lg': '1rem',       // 16px - var(--radius)
                'xl': '1.25rem',    // 20px
                '2xl': '1.5rem',    // 24px
                '3xl': '2rem',      // 32px
                '4xl': '2.5rem',    // 40px
                'full': '9999px',   // Pill shape
            },

            // Soft Shadows (1-4px diffuse)
            boxShadow: {
                'none': 'none',
                'xs': '0 1px 2px rgba(0, 0, 0, 0.03)',
                'sm': '0 2px 4px rgba(0, 0, 0, 0.04)',
                'DEFAULT': '0 4px 6px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.02)',
                'md': '0 4px 6px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.02)',
                'lg': '0 8px 16px rgba(0, 0, 0, 0.04), 0 4px 8px rgba(0, 0, 0, 0.02)',
                'xl': '0 12px 24px rgba(0, 0, 0, 0.06), 0 6px 12px rgba(0, 0, 0, 0.03)',
                '2xl': '0 20px 40px rgba(0, 0, 0, 0.08), 0 10px 20px rgba(0, 0, 0, 0.04)',
                'inner': 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
                // Colored shadows
                'teal': '0 4px 14px rgba(43, 181, 155, 0.15)',
                'teal-lg': '0 8px 24px rgba(43, 181, 155, 0.2)',
                'blue': '0 4px 14px rgba(215, 234, 251, 0.4)',
                // Card shadows
                'card': '0 2px 4px rgba(0, 0, 0, 0.04)',
                'card-hover': '0 8px 16px rgba(0, 0, 0, 0.06)',
            },

            // Font Family (SF Pro-style clean sans-serif)
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
                mono: ['"SF Mono"', '"Fira Code"', '"Fira Mono"', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
            },

            // Font Size
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '1' }],
                '6xl': ['3.75rem', { lineHeight: '1' }],
                '7xl': ['4.5rem', { lineHeight: '1' }],
            },

            // Spacing
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
                '26': '6.5rem',
                '30': '7.5rem',
            },

            // Animation
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-in": {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                "fade-out": {
                    from: { opacity: "1" },
                    to: { opacity: "0" },
                },
                "slide-up": {
                    from: { opacity: "0", transform: "translateY(20px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "slide-down": {
                    from: { opacity: "0", transform: "translateY(-20px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "gentle-pulse": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.7" },
                },
                "soft-bounce": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-5px)" },
                },
                "shimmer": {
                    "0%": { backgroundPosition: "200% 0" },
                    "100%": { backgroundPosition: "-200% 0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.3s ease-out",
                "fade-out": "fade-out 0.3s ease-out",
                "slide-up": "slide-up 0.4s ease-out",
                "slide-down": "slide-down 0.4s ease-out",
                "gentle-pulse": "gentle-pulse 2s ease-in-out infinite",
                "soft-bounce": "soft-bounce 2s ease-in-out infinite",
                "shimmer": "shimmer 1.5s ease-in-out infinite",
            },

            // Transition
            transitionDuration: {
                '0': '0ms',
                '150': '150ms',
                '300': '300ms',
                '500': '500ms',
                '700': '700ms',
            },
            transitionTimingFunction: {
                'smooth': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
                'gentle': 'cubic-bezier(0.19, 1, 0.22, 1)',
                'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            },

            // Backdrop Blur
            backdropBlur: {
                'xs': '2px',
                'sm': '4px',
                'DEFAULT': '8px',
                'md': '12px',
                'lg': '16px',
                'xl': '24px',
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
