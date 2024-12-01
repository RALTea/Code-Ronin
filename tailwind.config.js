/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'], // this line
	darkMode: 'selector',
	theme: {
		extend: {
			keyframes: {
				scaleZeroToOne: {
					'0%': { transform: 'scale(0)' },
					'100%': { transform: 'scale(1)' }
				},
				scaleOneToZero: {
					'0%': { transform: 'scale(1)' },
					'100%': { transform: 'scale(0)' }
				},
				dotFadeOut: {
					'0%': { transform: 'translate(0, 0)' },
					'100%': { transform: 'translate(24px, 0)' }
				}
			},
			animation: {
				scaleZeroToOne: 'scaleZeroToOne 0.6s infinite',
				scaleOneToZero: 'scaleOneToZero 0.6s infinite',
				dotFadeOut: 'dotFadeOut 0.6s infinite'
			},
			colors: {
				'bg-dark': '#1e1e1e',
				'bg-medium': '#2d2d2d',
				'bg-light': '#4d4d4d',
				light: '#d9d9d9',
				lightless: '#bfbfbf',
				// 'bg-light': '#ededed',
				'primary-dark': '#DDA323',
				'primary-medium': '#ebb844',
				'primary-light': '#FDED97'
			},
			fontFamily: {
				'space-mono': ['Space Mono', 'monospace'],
				'dm-sans': ['DM Sans', 'Helvetica', 'sans-serif'],
				'jetbrains-mono': ['JetBrains Mono', 'monospace'],
			}
		}
	},
	plugins: [
		// eslint-disable-next-line
		require('@tailwindcss/typography')
	]
};
