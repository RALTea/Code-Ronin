<script lang="ts">
	import { onMount } from 'svelte';
	import type { QuestTree } from '../aggregates/QuestTree';
	import { QuestTreeVM } from './QuestTreeVM.svelte';

	type Props = {
		loadQuests: Promise<QuestTree>;
		itemSize: string | number;
		lastQuestsUpdate: string;
		campaignSlug: string;
	};
	let { loadQuests, itemSize = 32, lastQuestsUpdate = '0', campaignSlug }: Props = $props();

	// Promise reference do not trigger reactivity, so this is a workaround
	$effect(() => {
		lastQuestsUpdate;
		vm.updateLoadQuests(loadQuests);
	})

	const vm = new QuestTreeVM(loadQuests);
	$inspect('INSPECT - QuestTree.vm.quests', vm.quests);

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
		};
		window.addEventListener('resize', action);
		return () => window.removeEventListener('resize', action);
	});

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
		bubbleRefs = [...document.querySelectorAll<HTMLDivElement>('.CUSTOM-bubble')].map((el) => {
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
		svgTree.style.opacity = '0.5';

		// Draw lines based on task relationships
		(vm.quests ?? []).forEach((taskLayer, layerIndex) => {
			taskLayer.forEach((task, taskIndex) => {
				// Find the current bubble
				const currentBubbleIndex = bubbleRefs.findIndex((b) => b?.taskId === task.id);
				const currentBubble = bubbleRefs[currentBubbleIndex];

				// Draw lines to next tasks
				task.previousQuestIds?.forEach((nextTaskId) => {
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
	};

	const cleanTree = (el?: SVGSVGElement) => {
		if (el) return document.querySelector('.CUSTOM-tree-root')?.removeChild(el);
		document.getElementById('task-connections')?.remove();
	};
</script>

<div class="pt-4 pb-2">
	{#if vm.isLoading}
		<p>Loading...</p>
	{/if}
	<div
		class="grid gap-8 relative CUSTOM-tree-root justify-center content-center rounded-md bg-bg-medium h-full"
		style="grid-template-columns: repeat({vm.nbOfColumns}, {Number(itemSize) / 4}rem);
     grid-template-rows: repeat({vm.nbOfRows}, {Number(itemSize) / 4}rem)"
	>
		{#key lastQuestsUpdate}
			<!-- Column -->
			{#each vm.quests ?? [] as questGroup, colIdx}
				{#each questGroup as quest, rowIdx}
					{@const completed = quest.isCompleted}
					<a
						href="/campaigns/{campaignSlug}/{quest.id}"
						style="grid-column: {colIdx + 1}; grid-row: {rowIdx + 1}"
						class="p-4 flex flex-col items-center gap-4"
					>
						<div
							class="h-6 w-6 z-10 rounded-full {completed
								? 'bg-primary-light'
								: 'bg-light'} mx-auto CUSTOM-bubble"
							title={quest.id}
						></div>
						<p class="text-center flex-1">
							{quest.name}
						</p>
					</a>
				{/each}
			{/each}
		{/key}
	</div>
</div>
