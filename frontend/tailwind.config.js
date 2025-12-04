/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1B5E7A', // Healthcare Trust Blue
                    hover: '#154D68',
                    active: '#113847',
                    light: '#F0F9FF',
                },
                secondary: {
                    DEFAULT: '#22C55E', // Secondary Green
                    hover: '#16A34A',
                },
                alert: {
                    DEFAULT: '#EF4444', // Alert Red
                    hover: '#DC2626',
                },
                neutral: {
                    DEFAULT: '#6B7280', // Neutral Gray
                    light: '#F9FAFB',
                    dark: '#374151',
                },
                status: {
                    scheduled: '#3B82F6',
                    confirmed: '#22C55E',
                    cancelled: '#EF4444',
                    noshow: '#F59E0B',
                    completed: '#10B981',
                },
                specialty: {
                    cardiology: '#DC2626',
                    neurology: '#7C3AED',
                    pediatrics: '#F97316',
                    dermatology: '#EC4899',
                    orthopedics: '#8B5CF6',
                    general: '#6366F1',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'level-1': '0 1px 2px rgba(0, 0, 0, 0.05)',
                'level-2': '0 4px 6px rgba(0, 0, 0, 0.1)',
                'level-3': '0 10px 15px rgba(0, 0, 0, 0.1)',
                'level-4': '0 20px 25px rgba(0, 0, 0, 0.15)',
                'inset': 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
            },
            borderRadius: {
                'subtle': '4px',
                'standard': '8px',
                'rounded': '12px',
                'pill': '999px',
            }
        },
    },
    plugins: [],
}
