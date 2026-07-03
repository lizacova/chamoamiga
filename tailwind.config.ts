import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Venezuelan flag palette — contemporary
        azul: {
          DEFAULT: '#2C5CB8',
          hover: '#264FA0',
          dark: '#12294B',
          soft: '#EAF0FB',
        },
        rojo: {
          DEFAULT: '#D64B45',
          hover: '#C13E39',
          soft: '#FBEBEA',
        },
        amarillo: {
          DEFAULT: '#E9B44C',
          strong: '#B07E00',
          soft: '#F8EBCB',
        },
        verde: {
          DEFAULT: '#2E9E6B',
          bg: '#E7F5EE',
        },
        fondo: '#FBFBF9',
        gris: {
          DEFAULT: '#E5E8EC',
          2: '#F2F4F6',
        },
        texto: {
          DEFAULT: '#1E2A38',
          suave: '#55606E',
        },
      },
      fontFamily: {
        display: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '10px',
        DEFAULT: '16px',
        lg: '24px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(18,41,75,.05), 0 8px 24px rgba(18,41,75,.07)',
        hover: '0 2px 4px rgba(18,41,75,.06), 0 16px 40px rgba(18,41,75,.12)',
      },
      maxWidth: {
        content: '1120px',
      },
    },
  },
  plugins: [],
}

export default config
