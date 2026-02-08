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
      colors: {
        base: {
          50: '#0f0a1a',
          100: '#1a1030',
          200: '#261646',
        },
        surface: {
          50: 'rgba(255, 255, 255, 0.04)',
          100: 'rgba(255, 255, 255, 0.07)',
          200: 'rgba(255, 255, 255, 0.10)',
        },
      },
      borderRadius: {
        'card': '16px',
        'card-lg': '20px',
        'button': '12px',
        'input': '12px',
      },
      boxShadow: {
        'glass': '0 4px 24px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        'glass-hover': '0 8px 40px rgba(0, 0, 0, 0.20), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        'glass-elevated': '0 12px 48px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'glow-violet': '0 0 24px rgba(139, 92, 246, 0.35), 0 0 48px rgba(139, 92, 246, 0.15)',
        'glow-cyan': '0 0 24px rgba(34, 211, 238, 0.25), 0 0 48px rgba(34, 211, 238, 0.10)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out both',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.8s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.5)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};
