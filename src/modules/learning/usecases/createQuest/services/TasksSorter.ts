export type ChainItem = {
	id: string
	nextItemId?: string;
	previousItemId?: string;
}

export const TasksSorter = <T extends ChainItem>(list: T[]) => {
	return {
		append: (item: T) => {
			const lastItem = list[list.length - 1];
			if (lastItem) {
				lastItem.nextItemId = item.id;
				item.previousItemId = lastItem.id;
			}
			return list.push(item);
		},
		insert: (index: number, item: T) => {
			const previousItem = list[index - 1];
			const nextItem = list[index];
			if (previousItem) {
				previousItem.nextItemId = item.id;
				item.previousItemId = previousItem.id;
			}
			if (nextItem) {
				nextItem.previousItemId = item.id;
				item.nextItemId = nextItem.id;
			}
			return list.splice(index, 0, item);
		},
    move: (index: number, item: T) => {
      // First, find the current position of the item to be moved
      const currentIndex = list.findIndex(i => i.id === item.id);
      
      // Remove the item from its current position and update adjacent links
      if (currentIndex !== -1) {
        const prevItem = list[currentIndex - 1];
        const nextItem = list[currentIndex + 1];
        
        // Update links for items around the removed item
        if (prevItem) {
          prevItem.nextItemId = nextItem?.id;
        }
        if (nextItem) {
          nextItem.previousItemId = prevItem?.id;
        }
        
        // Remove the item from its current position
        list.splice(currentIndex, 1);
      }
      
      // Insert the item at the new position
      const previousItem = list[index - 1];
      const nextItem = list[index];
      
      // Update links for the moved item and its new neighbors
      if (previousItem) {
        previousItem.nextItemId = item.id;
        item.previousItemId = previousItem.id;
      } else {
        item.previousItemId = undefined;
      }
      
      if (nextItem) {
        nextItem.previousItemId = item.id;
        item.nextItemId = nextItem.id;
      } else {
        item.nextItemId = undefined;
      }
      
      // Insert the item at the new position
      list.splice(index, 0, item);
    }
	}
}