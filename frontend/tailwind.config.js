/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                heading: ['var(--font-jakarta)', 'sans-serif'],
            },
            colors: {
                'brand-from': '#06b6d4',
                'brand-to': '#3b82f6',
                'card-bg': '#ffffff',
                'panel-bg': '#f0fdf4',
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                secondary: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                },
                'blue-eclipse': {
                    50: '#f6f8fb',
                    100: '#eef5ff',
                    200: '#d9e9ff',
                    300: '#b6d6ff',
                    400: '#7aa8ff',
                    500: '#3b6ef2',
                    600: '#2b4dc4',
                    700: '#1c397f',
                    800: '#0e223f',
                    900: '#040615'
                },
                'stripe': {
                    blurple: '#635bff',
                    teal: '#00d4ff',
                    cyan: '#06b6d4',
                    text: '#425466',
                    heading: '#0a2540',
                    dark: '#0a2540',
                    bg: '#f6f9fc',
                    doodle: '#ffc107',
                    accent: '#ff3e83',
                }
            },
            backgroundImage: {
                'gradient-hero': 'linear-gradient(90deg, var(--tw-gradient-stops))',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'pulse-slow': 'pulse 3s infinite',
                'gradient-x': 'gradient-x 4s linear infinite',
                'gradient-y': 'gradient-y 4s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'gradient-x': {
                    '0%, 100%': { 'background-position': '0% 50%' },
                    '50%': { 'background-position': '100% 50%' },
                },
                'gradient-y': {
                    '0%, 100%': { 'background-position': '50% 0%' },
                    '50%': { 'background-position': '50% 100%' },
                }
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}