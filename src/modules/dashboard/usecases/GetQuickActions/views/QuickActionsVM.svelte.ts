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
	onTreeChanged(fetchTree: Promise<QuestTree>, campaignSlug: string) {
		fetchTree.then(async (tree) => {
			console.debug('QuickActionsVM', tree);
			const ucResult = await this.getQuickActionsUsecase.execute({
				tree: tree,
				campaignSlug: campaignSlug
			});
			if (ucResult.isSuccess) return (this.quickActions = ucResult.data);
			if (ucResult.status === 404) return (this.quickActions = { nextItemLink: undefined });
			AppNotificationService.send({
				message: ucResult.message,
				type: 'ERROR'
			});
		});
	}
	constructor() {}
}
