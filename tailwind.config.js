/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar-hide'),
    require('daisyui'),
  ],
  theme: {
    extend: {
      width: {
        '15': '3.75rem',
      },
      borderRadius: {
        'inherit': 'inherit',
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fade-in .2s ease-out forwards',
      },
      keyframes: {
        'fade-in': {
          'from': { opacity: 0 },
          'to': { opacity: 1 },
        },
      },
    },
    colors: {},
  },
  daisyui: {
    logs: false,
    themes: [
      {
        light: {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          ...require('daisyui/src/theming/themes')['[data-theme=light]'],
          'primary': '#52abd2',
          'primary-focus': '#4191b4',
          'primary-content': '#efefef',

          'secondary': '#fcae26',
          'secondary-focus': '#e8a126',
          'secondary-content': '#171717',

          'accent': '#efefef',
          'accent-focus': '#dbdbdb',
          'accent-content': '#171717',

          'neutral': '#212121',
          'neutral-focus': '#404040',
          'neutral-content': '#efefef',

          'base-100': '#171717',
          'base-200': '#212121',
          'base-300': '#404040',
          'base-content': '#efefef',

          'info': '#4191b4',
          'success': '#11ac20',
          'warning': '#e8a126',
          'error': '#e22828',

          '--rounded-box': '2rem',
          '--rounded-btn': '1rem',
          '--rounded-badge': '2rem',

          '--border-btn': '2px',
        },
      },
    ],
  },
}

