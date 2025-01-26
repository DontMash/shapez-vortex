import { fontFamily } from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';
import aspectRatio from '@tailwindcss/aspect-ratio';
import typography from '@tailwindcss/typography';
import scrollbarHide from 'tailwind-scrollbar-hide';
import { addDynamicIconSelectors } from '@iconify/tailwind';

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    borderRadius: {
      xs: 'calc(var(--radius) - 12px)',
      sm: 'calc(var(--radius) - 8px)',
      md: 'calc(var(--radius) - 4px)',
      lg: 'var(--radius)',
    },
    colors: {
      current: 'currentColor',
      transparent: 'transparent',

      primary: {
        DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
        hover: 'hsl(var(--primary-hover) / <alpha-value>)',
        active: 'hsl(var(--primary-active) / <alpha-value>)',
        foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
        hover: 'hsl(var(--secondary-hover) / <alpha-value>)',
        active: 'hsl(var(--secondary-active) / <alpha-value>)',
        foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
      },
      accent: {
        DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
        hover: 'hsl(var(--accent-hover) / <alpha-value>)',
        active: 'hsl(var(--accent-active) / <alpha-value>)',
        foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
      },
      muted: {
        DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
        hover: 'hsl(var(--muted-hover) / <alpha-value>)',
        active: 'hsl(var(--muted-active) / <alpha-value>)',
        foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
      },
      layer: {
        DEFAULT: 'hsl(var(--layer) / <alpha-value>)',
        foreground: 'hsl(var(--layer-foreground) / <alpha-value>)',
      },
      success: {
        DEFAULT: 'hsl(var(--success) / <alpha-value>)',
        foreground: 'hsl(var(--success-foreground) / <alpha-value>)',
      },
      warning: {
        DEFAULT: 'hsl(var(--warning) / <alpha-value>)',
        foreground: 'hsl(var(--warning-foreground) / <alpha-value>)',
      },
      error: {
        DEFAULT: 'hsl(var(--error) / <alpha-value>)',
        hover: 'hsl(var(--error-hover) / <alpha-value>)',
        active: 'hsl(var(--error-active) / <alpha-value>)',
        foreground: 'hsl(var(--error-foreground) / <alpha-value>)',
      },

      background: 'hsl(var(--background) / <alpha-value>)',
      foreground: 'hsl(var(--foreground) / <alpha-value>)',

      border: 'hsl(var(--border) / <alpha-value>)',
      input: 'hsl(var(--input) / <alpha-value>)',
      ring: 'hsl(var(--ring) / <alpha-value>)',
    },
    fontFamily: {
      sans: ['"Outfit Variable"', ...fontFamily.sans],
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

    extend: {
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

            '--tw-prose-body': theme('colors.foreground'),
            '--tw-prose-headings': theme('colors.foreground'),
            '--tw-prose-lead': theme('colors.foreground'),
            '--tw-prose-links': theme('colors.foreground'),
            '--tw-prose-bold': theme('colors.foreground'),
            '--tw-prose-counters': theme('colors.foreground'),
            '--tw-prose-bullets': theme('colors.foreground'),
            '--tw-prose-hr': theme('colors.foreground'),
            '--tw-prose-quotes': theme('colors.foreground'),
            '--tw-prose-quote-borders': theme('colors.foreground'),
            '--tw-prose-captions': theme('colors.foreground'),
            '--tw-prose-code': theme('colors.foreground'),
            '--tw-prose-kbd-shadows': theme('colors.foreground'),
            '--tw-prose-pre-code': theme('colors.background'),
            '--tw-prose-pre-bg': theme('colors.foreground'),
            '--tw-prose-th-borders': theme('colors.foreground'),
            '--tw-prose-td-borders': theme('colors.foreground'),

            '--tw-prose-invert-body': theme('colors.background'),
            '--tw-prose-invert-headings': theme('colors.background'),
            '--tw-prose-invert-lead': theme('colors.background'),
            '--tw-prose-invert-links': theme('colors.background'),
            '--tw-prose-invert-bold': theme('colors.background'),
            '--tw-prose-invert-counters': theme('colors.background'),
            '--tw-prose-invert-bullets': theme('colors.background'),
            '--tw-prose-invert-hr': theme('colors.background'),
            '--tw-prose-invert-quotes': theme('colors.background'),
            '--tw-prose-invert-quote-borders': theme('colors.background'),
            '--tw-prose-invert-captions': theme('colors.background'),
            '--tw-prose-invert-code': theme('colors.background'),
            '--tw-prose-invert-kbd-shadows': theme('colors.background'),
            '--tw-prose-invert-pre-code': theme('colors.background'),
            '--tw-prose-invert-pre-bg': theme('colors.background'),
            '--tw-prose-invert-th-borders': theme('colors.background'),
            '--tw-prose-invert-td-borders': theme('colors.background'),
          },
        },
      }),
    },
  },
  plugins: [
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
          '@apply text-base': '',
          lineHeight: theme('lineHeight.xl'),
        },

        '.heading-6': {
          '@apply text-base lg:text-lg': '',
          lineHeight: theme('lineHeight.lg'),
          fontWeight: theme('fontWeight.medium'),
        },
        '.heading-5': {
          '@apply text-base sm:text-lg lg:text-xl': '',
          lineHeight: theme('lineHeight.xl'),
          fontWeight: theme('fontWeight.medium'),
        },
        '.heading-4': {
          '@apply text-lg sm:text-xl lg:text-2xl': '',
          lineHeight: theme('lineHeight.md'),
          fontWeight: theme('fontWeight.medium'),
        },
        '.heading-3': {
          '@apply text-xl sm:text-2xl lg:text-3xl': '',
          lineHeight: theme('lineHeight.lg'),
          fontWeight: theme('fontWeight.medium'),
        },
        '.heading-2': {
          '@apply text-2xl sm:text-3xl lg:text-4xl': '',
          lineHeight: theme('lineHeight.xl'),
          fontWeight: theme('fontWeight.semibold'),
        },
        '.heading-1': {
          '@apply text-3xl sm:text-4xl lg:text-hero': '',
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
};

export default config;
