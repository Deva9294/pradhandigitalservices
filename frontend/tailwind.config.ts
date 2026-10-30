import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F3F6FB',
          100: '#E8EEF7',
          200: '#D5E0EF',
          300: '#B6C7DF',
          400: '#829BBC',
          500: '#526F9C',
          600: '#344F7E',
          700: '#203A68',
          800: '#142B58',
          900: '#0A1B4D',
          950: '#061235',
        },
        saffron: {
          50: '#FFF5EB',
          100: '#FFE7D1',
          200: '#FFD0A8',
          300: '#FFB477',
          400: '#FF963D',
          500: '#FF7A00',
          600: '#E96500',
          700: '#C65300',
          800: '#9F4300',
          900: '#783400',
        },
        green: {
          600: '#138808',
        },
        red: {
          600: '#D92D20',
        },
        'text-primary': '#17233B',
        'text-muted': '#5B6880',
        'text-light': '#9CA3AF',
        'bg-light': '#F3F6FB',
        'bg-white': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
