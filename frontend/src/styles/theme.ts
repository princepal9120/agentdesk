/**
 * Clinical Minimalism Design System
 * Apple-inspired medical aesthetic for HIPAA-focused healthcare environments.
 * 
 * Core Principles:
 * - Calm, trustworthy, premium
 * - Apple-like clarity, spacing, and softness
 * - HIPAA-grade visual trust indicators
 */

// ============================================
// COLOR TOKENS
// ============================================
export const colors = {
    // Primary Palette
    white: '#FFFFFF',
    softBlue: '#D7EAFB',
    softBlueDark: '#B8D9F8',
    teal: '#2BB59B',
    tealDark: '#249A84',
    tealLight: '#ECFDF5',

    // Neutral Greys
    grey: {
        50: '#F8FAFC',   // Background soft
        100: '#F1F5F9',  // Card backgrounds
        200: '#E5E7EB',  // Borders, dividers
        300: '#C7C9CC',  // Input borders
        400: '#9CA3AF',  // Placeholder text
        500: '#6B7280',  // Muted text
        600: '#4B5563',  // Secondary text
        700: '#374151',  // Primary text
        800: '#1F2937',  // Headings
        900: '#111827',  // Dark headings
    },

    // Semantic Colors
    success: {
        light: '#ECFDF5',
        main: '#059669',
        dark: '#047857',
    },
    warning: {
        light: '#FFFBEB',
        main: '#D97706',
        dark: '#B45309',
    },
    error: {
        light: '#FEF2F2',
        main: '#DC2626',
        dark: '#B91C1C',
    },
    info: {
        light: '#EFF6FF',
        main: '#3B82F6',
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
    }
} as const;

// ============================================
// TYPOGRAPHY
// ============================================
export const typography = {
    fontFamily: {
        sans: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        mono: '"SF Mono", "Fira Code", "Fira Mono", Menlo, Monaco, Consolas, monospace',
    },
    fontSize: {
        xs: '0.75rem',     // 12px
        sm: '0.875rem',    // 14px
        base: '1rem',      // 16px
        lg: '1.125rem',    // 18px
        xl: '1.25rem',     // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
        '5xl': '3rem',     // 48px
        '6xl': '3.75rem',  // 60px
        '7xl': '4.5rem',   // 72px
    },
    fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },
    lineHeight: {
        tight: '1.1',
        snug: '1.25',
        normal: '1.5',
        relaxed: '1.625',
        loose: '1.75',
    }
} as const;

// ============================================
// SPACING & LAYOUT
// ============================================
export const spacing = {
    px: '1px',
    0: '0',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    32: '8rem',       // 128px
} as const;

// ============================================
// BORDER RADIUS (Medical-grade soft corners)
// ============================================
export const radius = {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.25rem', // 20px
    '3xl': '1.5rem',  // 24px
    '4xl': '2rem',    // 32px
    full: '9999px',   // Pill shape
} as const;

// ============================================
// SHADOWS (Soft, diffuse medical shadows)
// ============================================
export const shadows = {
    none: 'none',
    xs: '0 1px 2px rgba(0, 0, 0, 0.03)',
    sm: '0 2px 4px rgba(0, 0, 0, 0.04)',
    md: '0 4px 6px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.02)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.04), 0 4px 8px rgba(0, 0, 0, 0.02)',
    xl: '0 12px 24px rgba(0, 0, 0, 0.06), 0 6px 12px rgba(0, 0, 0, 0.03)',
    '2xl': '0 20px 40px rgba(0, 0, 0, 0.08), 0 10px 20px rgba(0, 0, 0, 0.04)',
    inner: 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
    // Soft colored shadows
    teal: '0 4px 14px rgba(43, 181, 155, 0.15)',
    blue: '0 4px 14px rgba(215, 234, 251, 0.4)',
} as const;

// ============================================
// BORDERS
// ============================================
export const borders = {
    thin: '1px solid #E5E7EB',
    medium: '2px solid #E5E7EB',
    teal: '1px solid #2BB59B',
    softBlue: '1px solid #D7EAFB',
} as const;

// ============================================
// TRANSITIONS & ANIMATIONS
// ============================================
export const transitions = {
    // Durations
    duration: {
        instant: '0ms',
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
        slower: '700ms',
    },
    // Easings
    ease: {
        linear: 'linear',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        // Apple-like smooth curves
        spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        gentle: 'cubic-bezier(0.19, 1, 0.22, 1)',
    }
} as const;

// ============================================
// FRAMER MOTION VARIANTS
// ============================================
export const motionVariants = {
    // Soft fade in
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
    },

    // Gentle lift (for cards on hover)
    lift: {
        initial: { y: 0 },
        hover: { y: -4 },
        transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
    },

    // Soft scale
    scale: {
        initial: { scale: 1 },
        hover: { scale: 1.02 },
        tap: { scale: 0.98 },
        transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }
    },

    // Slide up (for staggered entrances)
    slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
    },

    // Stagger children
    stagger: {
        animate: {
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    },

    // Gentle expand (for accordions)
    expand: {
        initial: { height: 0, opacity: 0 },
        animate: { height: 'auto', opacity: 1 },
        exit: { height: 0, opacity: 0 },
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
    }
} as const;

// ============================================
// GSAP ANIMATION PRESETS
// ============================================
export const gsapPresets = {
    // Page entrance
    pageEnter: {
        duration: 0.8,
        ease: 'power2.out',
        y: 30,
        opacity: 0,
        stagger: 0.1
    },

    // Section reveal
    sectionReveal: {
        duration: 0.6,
        ease: 'power3.out',
        y: 40,
        opacity: 0,
        delay: 0.2
    },

    // Smooth scroll trigger
    scrollTrigger: {
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
    },

    // Gentle float (for ambient animations)
    float: {
        y: '+=10',
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
    }
} as const;

// ============================================
// Z-INDEX LAYERS
// ============================================
export const zIndex = {
    hide: -1,
    base: 0,
    raised: 10,
    dropdown: 100,
    sticky: 200,
    overlay: 300,
    modal: 400,
    popover: 500,
    toast: 600,
    tooltip: 700,
} as const;

// ============================================
// BREAKPOINTS
// ============================================
export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
} as const;

// ============================================
// COMPONENT-SPECIFIC TOKENS
// ============================================
export const components = {
    // Button
    button: {
        primary: {
            bg: colors.teal,
            bgHover: colors.tealDark,
            text: colors.white,
            shadow: shadows.teal,
            radius: radius.full,
        },
        secondary: {
            bg: colors.softBlue,
            bgHover: colors.softBlueDark,
            text: colors.grey[800],
            radius: radius.full,
        },
        ghost: {
            bg: 'transparent',
            bgHover: colors.grey[100],
            text: colors.grey[600],
            radius: radius.xl,
        }
    },

    // Card
    card: {
        bg: colors.white,
        border: borders.thin,
        shadow: shadows.sm,
        shadowHover: shadows.md,
        radius: radius['3xl'],
        padding: spacing[6],
    },

    // Input
    input: {
        bg: colors.white,
        border: `1px solid ${colors.grey[200]}`,
        borderFocus: `1px solid ${colors.teal}`,
        radius: radius.xl,
        padding: `${spacing[3]} ${spacing[4]}`,
        placeholder: colors.grey[400],
    },

    // Badge
    badge: {
        radius: radius.full,
        padding: `${spacing[1]} ${spacing[3]}`,
        fontSize: typography.fontSize.xs,
    },

    // Toggle/Switch
    toggle: {
        trackBg: colors.grey[200],
        trackBgActive: colors.teal,
        thumbBg: colors.white,
        radius: radius.full,
    },

    // Sidebar
    sidebar: {
        width: '280px',
        bg: colors.white,
        border: borders.thin,
        itemRadius: radius['2xl'],
        itemPadding: `${spacing[3]} ${spacing[4]}`,
    },

    // Header
    header: {
        height: '80px',
        bg: 'rgba(255, 255, 255, 0.8)',
        backdropBlur: '12px',
        border: borders.thin,
    }
} as const;

// ============================================
// THEME EXPORT
// ============================================
export const clinicalTheme = {
    colors,
    typography,
    spacing,
    radius,
    shadows,
    borders,
    transitions,
    motionVariants,
    gsapPresets,
    zIndex,
    breakpoints,
    components,
} as const;

export type ClinicalTheme = typeof clinicalTheme;
export default clinicalTheme;
