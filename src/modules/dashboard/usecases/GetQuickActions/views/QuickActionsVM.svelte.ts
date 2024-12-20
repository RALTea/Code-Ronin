import { AppNotificationService } from '$notifications/services/AppNotificationService';
import type { QuestTree } from '../aggregates/QuestTree';
import type { QuickActions } from '../aggregates/QuickActions';
import { GetQuickActionsUseCase } from '../GetQuickActions';
import { NextTreeItemSelector } from '../services/NextTreeItemSelector';

export class QuickActionsVM {
	quickActions: QuickActions | undefined = $state(undefined);
	private getQuickActionsUsecase = GetQuickActionsUseCase({
		getNextItemInTree: (tree) => NextTreeItemSelector(tree)
	});
	onTreeChanged(fetchTree: Promise<QuestTree>) {
		fetchTree.then(async (tree) => {
			console.debug('QuickActionsVM', tree);
			const ucResult = await this.getQuickActionsUsecase.execute({
				tree: tree
			});
			if (ucResult.isSuccess) return (this.quickActions = ucResult.data);
			AppNotificationService.send({
				message: ucResult.message,
				type: 'ERROR'
			});
		});
	}
	constructor() {}
}
