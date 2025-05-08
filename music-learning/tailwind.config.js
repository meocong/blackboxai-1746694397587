/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          light: '#4f46e5',
          DEFAULT: '#4338ca',
          dark: '#3730a3',
        },
        secondary: {
          light: '#fbbf24',
          DEFAULT: '#f59e0b',
          dark: '#b45309',
        },
        accent: {
          light: '#fef3c7',
          DEFAULT: '#fde68a',
          dark: '#fbbf24',
        },
        background: {
          light: '#f9fafb',
          DEFAULT: '#f3f4f6',
          dark: '#e5e7eb',
        },
      },
      boxShadow: {
        'soft': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'soft-md': '0 8px 12px rgba(0, 0, 0, 0.1)',
      },
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
      },
      borderRadius: {
        'lg': '0.75rem',
      },
      height: {
        'screen-minus-header': 'calc(100vh - 64px)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar'),
  ],
}
