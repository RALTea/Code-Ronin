<script lang="ts">
	import type { QuestData } from '../aggregates/QuestData';

	type Props = {
		tasks: QuestData['tasks'];
	};
	let { tasks }: Props = $props();
	$inspect("Tasks in tree", tasks);

	type Bubble = {
		ref: HTMLDivElement;
		taskId: string;
		centerX: number;
		centerY: number;
	};
	// Explicitly sized array based on total number of tasks
	const totalTasks = tasks.flat().length;
	let bubbleRefs = $state<Bubble[]>(new Array(totalTasks).fill(null));

	// Function to set ref at a specific index
	function collectRef(element: HTMLDivElement, data: { index: number; taskId: string }) {
		const { index, taskId } = data;
		const rect = element.getBoundingClientRect();
		bubbleRefs[index] = {
			ref: element,
			taskId: taskId,
			centerX: rect.left + rect.width / 2,
			centerY: rect.top + rect.height / 2
		};
	}

	// After first render, draw connections
	$effect(() => {
		// Ensure all refs are collected
		if (bubbleRefs.some((ref) => ref === null)) return;

		// Create SVG to draw lines
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('class', 'absolute inset-0 pointer-events-none');
		svg.style.position = 'absolute';
		svg.style.top = '0';
		svg.style.left = '0';
		svg.style.width = '100%';
		svg.style.height = '100%';
		svg.style.zIndex = '-10';

		// Draw lines based on task relationships
		tasks.forEach((taskLayer, layerIndex) => {
			taskLayer.forEach((task, taskIndex) => {
				// Find the current bubble
				const currentBubbleIndex = bubbleRefs.findIndex((b) => b.taskId === task.id);
				const currentBubble = bubbleRefs[currentBubbleIndex];

				// Draw lines to next tasks
				task.nextTaskIds?.forEach((nextTaskId) => {
					// Find the next bubble
					const nextBubbleIndex = bubbleRefs.findIndex((b) => b.taskId === nextTaskId);
					const nextBubble = bubbleRefs[nextBubbleIndex];

					if (currentBubble && nextBubble) {
						const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
						line.setAttribute('x1', currentBubble.centerX.toString());
						line.setAttribute('y1', currentBubble.centerY.toString());
						line.setAttribute('x2', nextBubble.centerX.toString());
						line.setAttribute('y2', nextBubble.centerY.toString());
						line.setAttribute('stroke', 'rgba(255,255,255,.6)');
						line.setAttribute('stroke-width', '2');
						console.debug();

						svg.appendChild(line);
					}
				});
			});
		});

		// Add SVG to the document
		document.body.appendChild(svg);

		// Cleanup function
		return () => {
			document.body.removeChild(svg);
		};
	});
</script>

<ul class="flex flex-col gap-16">
	{#each tasks as taskLayer, taskLayerIndex}
		<li>
			<ul class="flex gap-4 justify-center">
				{#each taskLayer as task, taskIndex}
					{@const globalIndex =
						tasks.slice(0, taskLayerIndex).reduce((sum, layer) => sum + layer.length, 0) +
						taskIndex}
					<li class="block">
						<div
							class="h-6 w-6 rounded-full bg-light m-auto"
							use:collectRef={{ index: globalIndex, taskId: task.id }}
						></div>
						<p class="max-w-36">{task.name}</p>
					</li>
				{/each}
			</ul>
		</li>
	{/each}
</ul>
