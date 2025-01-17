import { fontFamily } from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';
import daisyui from 'daisyui';
import daisyuiTheme from 'daisyui/src/theming/themes';
import aspectRatio from '@tailwindcss/aspect-ratio';
import typography from '@tailwindcss/typography';
import scrollbarHide from 'tailwind-scrollbar-hide';
import { addDynamicIconSelectors } from '@iconify/tailwind';

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    colors: {},
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },

        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',

        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: [...fontFamily.sans],
      },
      fontSize: {
        inherit: 'inherit',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '3rem',
        hero: '4rem',
      },
      lineHeight: {
        none: 'none',
        sm: '1.125',
        md: '1.25',
        lg: '1.333',
        xl: '1.5',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: theme('maxWidth.none'),
            fontSize: theme('fontSize.base'),
            lineHeight: theme('lineHeight.xl'),

            h1: {
              '@apply heading-1': '',
            },
            h2: {
              '@apply heading-2': '',
            },
            h3: {
              '@apply heading-3': '',
            },
            h4: {
              '@apply heading-4': '',
            },
            h5: {
              '@apply heading-5': '',
            },
            h6: {
              '@apply heading-6': '',
            },

            p: {
              '@apply paragraph': '',
            },
            small: {
              '@apply small': '',
            },
          },
        },
      }),
    },
  },
  plugins: [
    daisyui,
    aspectRatio,
    typography,
    scrollbarHide,
    addDynamicIconSelectors(),
    plugin(({ addComponents, theme }) => {
      addComponents({
        '.small': {
          '@apply text-sm': '',
          lineHeight: theme('lineHeight.xl'),
        },
        '.paragraph': {
          '@apply text-base lg:text-lg': '',
          lineHeight: theme('lineHeight.xl'),
        },

        '.heading-6': {
          '@apply text-base lg:text-lg': '',
          lineHeight: theme('lineHeight.xl'),
          fontWeight: theme('fontWeight.medium'),
        },
        '.heading-5': {
          '@apply text-lg lg:text-xl': '',
          lineHeight: theme('lineHeight.xl'),
          fontWeight: theme('fontWeight.medium'),
        },
        '.heading-4': {
          '@apply text-xl lg:text-2xl': '',
          lineHeight: theme('lineHeight.md'),
          fontWeight: theme('fontWeight.medium'),
        },
        '.heading-3': {
          '@apply text-2xl lg:text-3xl': '',
          lineHeight: theme('lineHeight.lg'),
          fontWeight: theme('fontWeight.medium'),
        },
        '.heading-2': {
          '@apply text-3xl lg:text-4xl': '',
          lineHeight: theme('lineHeight.xl'),
          fontWeight: theme('fontWeight.semibold'),
        },
        '.heading-1': {
          '@apply text-4xl lg:text-hero': '',
          lineHeight: theme('lineHeight.md'),
          fontWeight: theme('fontWeight.bold'),
        },
        '.hero': {
          '@apply text-4xl lg:text-hero': '',
          lineHeight: theme('lineHeight.none'),
          fontWeight: theme('fontWeight.black'),
        },
      });
    }),
  ],
  daisyui: {
    logs: false,
    themes: [
      {
        light: {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          ...daisyuiTheme['[data-theme=light]'],

          primary: '#52abd2',
          'primary-focus': '#4191b4',
          'primary-content': '#efefef',

          secondary: '#fcae26',
          'secondary-focus': '#e8a126',
          'secondary-content': '#171717',

          accent: '#efefef',
          'accent-focus': '#dbdbdb',
          'accent-content': '#171717',

          neutral: '#212121',
          'neutral-focus': '#404040',
          'neutral-content': '#efefef',

          'base-100': '#171717',
          'base-200': '#212121',
          'base-300': '#404040',
          'base-content': '#efefef',

          info: '#4191b4',
          success: '#11ac20',
          warning: '#e8a126',
          error: '#e22828',

          '--rounded-box': '2rem',
          '--rounded-btn': '1rem',
          '--rounded-badge': '2rem',

          '--border-btn': '2px',
        },
      },
    ],
  },
};

export default config;
