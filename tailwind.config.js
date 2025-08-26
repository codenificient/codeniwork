// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    // shadcn/ui components
    './node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
  backgroundImage: {
    'cloud-dark': 'radial-gradient(circle at 30% 30%, rgba(90, 0, 132, 0.89) 0%, transparent 5%), radial-gradient(circle at 70% 70%, rgba(45, 0, 82, 0.85) 0%, transparent 5%)',
  },
  animation: {
    'rotate-clouds': 'rotateClouds 80s linear infinite',
  },
  keyframes: {
    rotateClouds: {
      '0%': { transform: 'rotate(0deg) scale(1.05)' },
      '100%': { transform: 'rotate(360deg) scale(1.05)' },
    },
  },
},

  },
  plugins: [],
};
