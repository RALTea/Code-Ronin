import { cubicInOut } from 'svelte/easing';
import type { DrawParams, TransitionConfig } from 'svelte/transition';

type Node = SVGElement & { getTotalLength(): number };

export function reversedraw(
	node: Node,
	{ delay = 0, speed, duration, easing = cubicInOut }: DrawParams = {}
): TransitionConfig {
	let len = node.getTotalLength();
	const style = getComputedStyle(node);
	if (style.strokeLinecap !== 'butt') {
		len += parseInt(style.strokeWidth);
	}
	if (duration === undefined) {
		if (speed === undefined) {
			duration = 800;
		} else {
			duration = len / speed;
		}
	} else if (typeof duration === 'function') {
		duration = duration(len);
	}
	return {
		delay,
		duration,
		easing,
		css: (t, u) => `
			stroke-dasharray: ${len};
			stroke-dashoffset: ${-1 * u * len};
		`
	};
}
