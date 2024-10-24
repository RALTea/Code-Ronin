/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'], // this line
	theme: {
		extend: {
			colors: {
				'bg-dark': '#1e1e1e',
				'bg-medium': '#2d2d2d',
				'bg-light': '#4d4d4d',
				'light': '#d9d9d9',
				'lightless': '#bfbfbf',
				// 'bg-light': '#ededed',
				'primary-dark': '#DDA323',
				'primary-medium': '#ebb844',
				'primary-light': '#FDED97'
			},
			fontFamily: {
				'space-mono': ['Space Mono', 'monospace'],
				'dm-sans': ['DM Sans', 'Helvetica', 'sans-serif']
			}
		}
	},
	plugins: [
    // eslint-disable-next-line
    require('@tailwindcss/typography'),
  ]
};
