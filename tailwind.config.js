import { fontFamily } from 'tailwindcss/defaultTheme';
import { addDynamicIconSelectors } from '@iconify/tailwind';

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		colors: {},
		extend: {
			colors: {
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'4xl': '2rem',
			},
			fontFamily: {
				sans: [...fontFamily.sans]
			},
			width: {
				'15': '3.75rem',
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
	},
	plugins: [
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/typography'),
		require('tailwind-scrollbar-hide'),
		require('daisyui'),
		addDynamicIconSelectors(),
	],
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
};

export default config;
