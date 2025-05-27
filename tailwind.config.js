/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
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
};

export default config;
