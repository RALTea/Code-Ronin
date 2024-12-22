type _BaseTreeItem = {
	id: string;
};

export const sortLayers = <
	T extends _BaseTreeItem & {
		[P in PrevKey]: string[];
	} & {
		[N in NextKey]: string[];
	},
	PrevKey extends string,
	NextKey extends string
>(
	quests: T[][],
	prevKey: PrevKey,
	nextKey: NextKey
): T[][] => {
	// Flatten the input quests and create a map for quick lookups
	const flatQuests = quests.flat();
	const questMap = new Map(flatQuests.map((quest) => [quest.id, quest]));

	// Detect cycles in the dependency graph
	const visited = new Set<string>();
	const recursionStack = new Set<string>();

	function hasCycle(questId: string): boolean {
		if (recursionStack.has(questId)) return true;
		if (visited.has(questId)) return false;

		visited.add(questId);
		recursionStack.add(questId);

		const quest = questMap.get(questId);
		const previousQuests = quest?.[prevKey] || [];

		for (const prevId of previousQuests) {
			if (hasCycle(prevId)) return true;
		}

		recursionStack.delete(questId);
		return false;
	}

	// Check for cycles
	for (const quest of flatQuests) {
		if (hasCycle(quest.id)) {
			throw new Error(`Circular dependency detected involving quest ${quest.id}`);
		}
	}

	// Find quests with no previous quests (first layer)
	const firstLayer = flatQuests.filter((quest) => !quest[prevKey]?.length);

	if (firstLayer.length === 0) {
		throw new Error('No items found');
	}

	// Track processed quests and create result array
	const processedQuests = new Set(firstLayer.map((quest) => quest.id));
	const layers: T[][] = [firstLayer];

	while (processedQuests.size < flatQuests.length) {
		const currentLayer = layers[layers.length - 1];
		const nextLayerQuests: typeof flatQuests = [];

		// Process each parent quest in the current layer
		for (const parentTask of currentLayer) {
			const nextTaskIds = parentTask[nextKey] || [];

			// Add quests in the order specified by nextTaskIds
			for (const nextId of nextTaskIds) {
				const quest = questMap.get(nextId);
				if (!quest) continue;

				// Only add if all prerequisites are met
				if (
					quest[prevKey]?.every((prevId) => processedQuests.has(prevId)) &&
					!processedQuests.has(quest.id)
				) {
					nextLayerQuests.push(quest);
					processedQuests.add(quest.id);
				}
			}
		}

		if (nextLayerQuests.length === 0) {
			// Check for unreachable quests
			const unreachableQuests = flatQuests.filter((quest) => !processedQuests.has(quest.id));
			if (unreachableQuests.length > 0) {
				throw new Error(
					`Unreachable quests detected: ${unreachableQuests.map((t) => t.id).join(', ')}`
				);
			}
			break;
		}

		layers.push(nextLayerQuests);
	}

	return layers;
};
