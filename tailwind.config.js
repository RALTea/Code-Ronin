/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'], // this line
	theme: {
		extend: {
			colors: {
				'bg-dark': '#1e1e1e',
				'bg-medium': '#3d3d3d',
				'bg-light': '#4f4f4f',
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
