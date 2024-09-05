import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'dungeon-gradient':
          'linear-gradient(135deg, #3b3b3b, #2a2a2a, #1a1a1a, #000000)',
      },
      colors: {
        rsBackground: '#2b2b2b', // Dark background color
        rsPanel: '#4a4a4a', // Panel color
        rsBorder: '#7a7a7a', // Border color
        rsText: '#fffbe6', // Light beige text
        rsGold: '#d4af37', // RuneScape gold
      },
      fontFamily: {
        rsFont: ['"Press Start 2P"', 'cursive'], // Pixel-like font or RuneScape style font
      },
      boxShadow: {
        rsGlow: '0 0 4px #d4af37', // Subtle glowing effect for active elements
      },
      borderRadius: {
        rs: '4px', // Classic rounded corners like in RuneScape UI
      },
    },
  },
  plugins: [],
};
export default config;
