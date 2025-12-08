/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '375px',   // Small mobile (iPhone SE)
      'sm': '640px',   // Mobile landscape / small tablet
      'md': '768px',   // Tablet portrait
      'lg': '1024px',  // Tablet landscape / small desktop
      'xl': '1280px',  // Desktop
      '2xl': '1536px', // Large desktop
    },
    extend: {
      // Custom media queries for input types
      screens: {
        'touch': { 'raw': '(pointer: coarse)' },  // Touch devices
        'mouse': { 'raw': '(pointer: fine)' },    // Mouse/trackpad devices
        'hover': { 'raw': '(hover: hover)' },     // Devices that support hover
      },
      // Custom animations for modals
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [
    // Container queries plugin
    require('@tailwindcss/container-queries'),

    // Custom plugin for touch-friendly utilities
    function({ addUtilities }) {
      const newUtilities = {
        '.touch-target': {
          '@apply min-w-[44px] min-h-[44px]': {},
        },
        '.touch-target-lg': {
          '@apply min-w-[48px] min-h-[48px]': {},
        },
        '.touch-gap': {
          '@apply gap-3': {},
          '@screen touch': {
            '@apply gap-4': {},
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
}
