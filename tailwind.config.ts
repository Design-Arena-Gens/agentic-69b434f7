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
        linkedin: {
          DEFAULT: '#0A66C2',
          dark: '#004182',
          light: '#378FE9',
        },
      },
    },
  },
  plugins: [],
}
export default config
