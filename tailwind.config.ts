import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0f',
        sur: '#13131a',
        sur2: '#1c1c26',
        bor: '#2a2a3a',
        acc: '#7c5cfc',
        acc2: '#fc5c7c',
        txt: '#e8e8f0',
        mut: '#7070a0',
        grn: '#3dd68c',
        red: '#fc5c7c',
        ylw: '#fcb95c',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
