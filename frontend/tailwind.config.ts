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
          50: '#F5F7FA',
          100: '#E8EDF3',
          200: '#D1DBE6',
          300: '#B4C2D3',
          400: '#8FA3B8',
          500: '#6B84A0',
          600: '#4A6382',
          700: '#334E68',
          800: '#1E3E62',
          900: '#0B192C',
          950: '#071018',
        },
        saffron: {
          50: '#FEF7ED',
          100: '#FDE8D1',
          200: '#FAD0A7',
          300: '#F7B37D',
          400: '#FB923C',
          500: '#F97316',
          600: '#FF6500',
          700: '#C46218',
          800: '#A35214',
          900: '#824410',
        },
        green: {
          600: '#138808',
        },
        red: {
          600: '#D92D20',
        },
        'text-primary': '#172033',
        'text-muted': '#667085',
        'text-light': '#9CA3AF',
        'bg-light': '#F5F7FA',
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
