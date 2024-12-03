<script lang="ts">
	import type { QuestData } from '../domain/QuestData';

	type Props = {
		tasks: QuestData['tasks'];
	};
	let { tasks }: Props = $props();

	type Bubble = {
		ref: HTMLDivElement;
		taskId: string;
		centerX: number;
		centerY: number;
	};


	// After first render, draw connections
	$effect(() => {
		const svgId = 'task-connections';
		let bubbleRefs: (Bubble | null)[] = [];
		// Ensure all refs are collected
		if (bubbleRefs.some((ref) => ref === null)) {
			console.debug('Not all refs collected');
			return;
		}
		bubbleRefs = [...document.querySelectorAll<HTMLDivElement>('.bubble')].map((el) => {
			const rect = el.getBoundingClientRect();
			return {
				ref: el,
				taskId: el.title,
				centerX: rect.left + rect.width / 2,
				centerY: rect.top + rect.height / 2
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
						console.debug();

						svgTree.appendChild(line);
					}
				});
			});
		});

		// Add SVG to the document
		document.body.appendChild(svgTree);

		// Cleanup function
		return () => {
			document.body.removeChild(svgTree);
		};
	});
</script>

<ul class="flex flex-col gap-16">
	{#each tasks as taskLayer}
		<li>
			<ul class="flex gap-4 justify-center">
				{#each taskLayer as task}
					<li class="block">
						<div
							class="h-6 w-6 rounded-full bg-light m-auto bubble"
							title={task.id}
						></div>
						<p class="w-36 text-center">{task.name}</p>
					</li>
				{/each}
			</ul>
		</li>
	{/each}
</ul>
