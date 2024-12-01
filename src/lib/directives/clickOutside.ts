// // Add this into app.d.ts inside the global namespace declaration
// declare namespace svelteHTML {
// 	interface HTMLAttributes<T> {
// 			'on:clickOutside'?: (event: CustomEvent) => void;
// 	}
// }	

// Defining the type for the directive's node parameter as HTMLElement
export function clickOutside(node: HTMLElement): { destroy: () => void } {
	// The event listener callback now explicitly types the event parameter as MouseEvent
	const handleClick = (event: MouseEvent): void => {
		// Checking that event.target is an instance of Node to satisfy TypeScript checks
		if (node && event.target instanceof Node && !node.contains(event.target) && !event.defaultPrevented) {
			node.dispatchEvent(new CustomEvent('clickOutside', { detail: node }));
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		},
	};
}
