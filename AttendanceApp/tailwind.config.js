/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cursor Theme Colors
        cursor: {
          primary: '#141414',
          secondary: '#1a1a1a',
          tertiary: '#2A2A2A',
          surface: '#1a1a1a',
          'surface-variant': '#2A2A2A',
          'surface-overlay': '#404040',
        },
        // Accent Colors
        accent: {
          cyan: '#88C0D0',
          blue: '#81A1C1',
          green: '#A3BE8C',
          yellow: '#EBCB8B',
          red: '#BF616A',
          magenta: '#B48EAD',
        },
        // Text Colors
        text: {
          primary: '#FFFFFF',
          secondary: '#CCCCCC',
          tertiary: '#505050',
          disabled: '#CCCCCC99',
        },
        // Status Colors
        status: {
          success: '#A3BE8C',
          warning: '#EBCB8B',
          error: '#BF616A',
          info: '#88C0D0',
        },
        // Border Colors
        border: {
          light: '#FFFFFF0D',
          strong: '#505050',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'cursor': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'cursor-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
