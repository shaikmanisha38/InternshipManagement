/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        card: '#111827',
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#8B5CF6',
        text: '#F3F4F6',
        textMuted: '#9CA3AF',
        borderCustom: '#1F2937'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
