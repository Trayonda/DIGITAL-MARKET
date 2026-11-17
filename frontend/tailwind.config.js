/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2563EB',
          'primary-hover': '#1D4ED8',
          dark: '#0F172A',
          'dark-alt': '#1E293B',
          accent: '#0EA5E9',
        },
        whatsapp: {
          DEFAULT: '#22C55E',
          hover: '#16A34A',
        },
        stock: {
          in: '#10B981',
          warning: '#F59E0B',
          sold: '#EF4444',
        },
        surface: '#F2F7F4',
        'surface-card': '#FFFFFF',
        'surface-border': '#E1EDE5',
        'surface-chip': '#EAF4ED',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'navbar': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
