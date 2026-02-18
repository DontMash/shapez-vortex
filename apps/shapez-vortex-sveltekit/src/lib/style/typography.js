import plugin from 'tailwindcss/plugin';

export default plugin(({ addComponents, theme }) => {
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
});
