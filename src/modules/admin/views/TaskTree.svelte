<script lang="ts">
	import { onMount } from 'svelte';
	import type { QuestData } from '../domain/QuestData';

	type Props = {
		tasks: QuestData['tasks'];
		ontaskselected: (taskId: string) => void;
	};
	let { tasks, ontaskselected }: Props = $props();

	type Bubble = {
		ref: HTMLDivElement;
		taskId: string;
		centerX: number;
		centerY: number;
	};

	onMount(() => {
		const action = () => {
			cleanTree();
			drawConnections();
		}
		window.addEventListener('resize', action);
		return () => window.removeEventListener('resize', action);
	})

	// After first render, draw connections
	$effect(() => {
		return drawConnections();
	});

	const drawConnections = () => {
		const svgId = 'task-connections';
		let bubbleRefs: (Bubble | null)[] = [];
		// Ensure all refs are collected
		if (bubbleRefs.some((ref) => ref === null)) {
			return;
		}
		bubbleRefs = [...document.querySelectorAll<HTMLDivElement>('.bubble')].map((el) => {
			const container = document.querySelector('.CUSTOM-tree-root');
			if (!container) return null;
			const containerRect = container.getBoundingClientRect();
			const rect = el.getBoundingClientRect();
			return {
				ref: el,
				taskId: el.title,
				centerX: rect.left - containerRect.left + rect.width / 2,
				centerY: rect.top - containerRect.top + rect.height / 2
			};
		});

		// Create SVG to draw lines
		const svgTree = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svgTree.setAttribute('class', 'absolute inset-0 pointer-events-none');
		svgTree.id = svgId;
		svgTree.style.position = 'absolute';
		svgTree.style.top = '0';
		svgTree.style.left = '0';
		svgTree.style.width = '100%';
		svgTree.style.height = '100%';
		svgTree.style.zIndex = '-10';

		// Draw lines based on task relationships
		tasks.forEach((taskLayer, layerIndex) => {
			taskLayer.forEach((task, taskIndex) => {
				// Find the current bubble
				const currentBubbleIndex = bubbleRefs.findIndex((b) => b?.taskId === task.id);
				const currentBubble = bubbleRefs[currentBubbleIndex];

				// Draw lines to next tasks
				task.previousTaskIds?.forEach((nextTaskId) => {
					// Find the next bubble
					const nextBubbleIndex = bubbleRefs.findIndex((b) => b?.taskId === nextTaskId);
					const nextBubble = bubbleRefs[nextBubbleIndex];

					if (currentBubble && nextBubble) {
						const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
						line.setAttribute('x1', currentBubble.centerX.toString());
						line.setAttribute('y1', currentBubble.centerY.toString());
						line.setAttribute('x2', nextBubble.centerX.toString());
						line.setAttribute('y2', nextBubble.centerY.toString());
						line.setAttribute('stroke', 'rgba(255,255,255,.6)');
						line.setAttribute('stroke-width', '2');

						svgTree.appendChild(line);
					}
				});
			});
		});

		// Add SVG to the document
		document.querySelector('.CUSTOM-tree-root')?.appendChild(svgTree);

		// Cleanup function
		return () => cleanTree(svgTree);
	}

	const cleanTree = (el?: SVGSVGElement) => {
		if (el) return document.querySelector('.CUSTOM-tree-root')?.removeChild(el);
		document.getElementById('task-connections')?.remove();
	}
</script>

<div class="relative CUSTOM-tree-root">
	<ul class="flex flex-col gap-16">
		{#each tasks as taskLayer}
			<li>
				<ul class="flex gap-4 justify-center">
					{#each taskLayer as task}
						<li class="block">
							<button
								class="h-6 w-6 rounded-full bg-light m-auto bubble"
								title={task.id}
								onclick={() => ontaskselected(task.id)}
								aria-label={task.name}
							></button>
							<p class="w-36 text-center">{task.name}</p>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
</div>
