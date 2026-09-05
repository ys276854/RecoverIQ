/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        recoveriq: {
          navy: '#072654',
          blue: '#0C51A6',
          lightBlue: '#EBF3FE',
          slate: '#0F172A',
        },
        razorpay: {
          navy: '#072654',
          blue: '#0C51A6',
          lightBlue: '#EBF3FE',
          slate: '#0F172A',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
