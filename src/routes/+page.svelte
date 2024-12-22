<script>
	import { page } from '$app/stores';
	import { UserStore } from '$auth/stores/UserStore.svelte';
	import Progress from '$lib/components/forms/Progress.svelte';
	import IconWrapper from '$lib/components/icons/IconWrapper.svelte';
	import IconBookOpen from '$lib/components/icons/lucide/IconBookOpen.svelte';
	import IconChevronRight from '$lib/components/icons/lucide/IconChevronRight.svelte';
	import IconCode from '$lib/components/icons/lucide/IconCode.svelte';
	import IconTerminal from '$lib/components/icons/lucide/IconTerminal.svelte';
	import { AppNotificationService } from '$notifications/services/AppNotificationService';
	import { ExtractNotificationsUseCase } from '$notifications/usecases/ExtractNotifications/ExtractNotificationsUseCase';
	import { URLNotificationParser } from '$notifications/usecases/ExtractNotifications/services/URLNotificationParser';

	$effect(() => {
		const url = $page.url;
		if (url.searchParams.size === 0) return
		ExtractNotificationsUseCase()({ parser: URLNotificationParser.parse })
			.execute({
				rawData: $page.url
			})
			.then((ucResult) => {
				if (!ucResult.isSuccess) return;
				ucResult.data.notifications.forEach((notif) => AppNotificationService.send(notif));
			});
	});
</script>

<div class="min-h-screen font-mono bg-bg-dark text-zinc-100">
	<div class="container px-4 py-16 mx-auto lg:w-4/5">
		<div class="grid gap-16 items-center lg:grid-cols-2 lg:gap-8">
			<div class="space-y-8">
				<div
					class="inline-block px-3 py-1 text-sm rounded-lg bg-primary-light/10 text-primary-dark"
				>
					Learn to code like a pro
				</div>
				<h1
					class="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r sm:text-5xl xl:text-6xl/none from-primary-dark to-primary-light"
				>
					A new dev is born
				</h1>
				<p class="text-xl text-zinc-400">
					Master programming through hands-on practice. Write real code, get instant feedback, and
					level up your skills.
				</p>
				<div class="flex flex-col gap-4 sm:flex-row">
					<a
						href="/campaigns/demo/035187b2-4872-4a22-ab10-5129447ba326/132e689c-988d-4b62-a2aa-dee68f6167ad"
						class="inline-flex justify-center items-center px-6 py-3 text-sm font-medium text-black rounded-md bg-primary-dark hover:bg-yellow-400"
					>
						Try the app
						<IconWrapper size="4" className="ml-2"><IconChevronRight /></IconWrapper>
					</a>
					{#if !UserStore.user}
						<a
							href="/login"
							class="inline-flex justify-center items-center px-4 py-2 rounded-md border border-bg-light"
						>
							Create an account
						</a>
					{/if}
				</div>
			</div>
			<div class="relative">
				<div class="p-6 rounded-lg border backdrop-blur border-zinc-800 bg-zinc-900/50">
					<div class="flex justify-between items-center mb-4">
						<div class="flex gap-2 items-center">
							<div class="w-3 h-3 bg-red-500 rounded-full"></div>
							<div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
							<div class="w-3 h-3 bg-green-500 rounded-full"></div>
						</div>
						<div class="flex gap-4 items-center">
							<div class="w-24 h-3">
								<Progress
									value={33}
									max={100}
									colors={{ bg: 'bg-zinc-800', indicator: 'bg-primary-dark' }}
								/>
							</div>
							<span class="text-sm text-zinc-400">Level 1</span>
						</div>
					</div>
					<pre class="font-mono text-sm">
            <p class="text-green-500">console.log("Hello, World!");</p>
          </pre>
				</div>
			</div>
		</div>
		<div class="grid gap-8 mt-24 sm:grid-cols-2 lg:grid-cols-3">
			<div class="p-6 rounded-lg border border-bg-light bg-bg-medium">
				<IconWrapper size="12" className="text-primary-dark mb-4"><IconTerminal /></IconWrapper>
				<h3 class="mb-2 text-xl font-bold">Interactive Console</h3>
				<p class="text-zinc-400">
					Write and execute real code directly in your browser with instant feedback.
				</p>
			</div>
			<div class="p-6 rounded-lg border border-bg-light bg-bg-medium">
				<IconWrapper size="12" className="text-primary-dark mb-4"><IconCode /></IconWrapper>
				<h3 class="mb-2 text-xl font-bold">Step-by-Step Learning</h3>
				<p class="text-zinc-400">
					Progress through carefully crafted lessons that build your programming skills.
				</p>
			</div>
			<div class="p-6 rounded-lg border border-bg-light bg-bg-medium">
				<IconWrapper size="12" className="text-primary-dark mb-4"><IconBookOpen /></IconWrapper>
				<h3 class="mb-2 text-xl font-bold">Comprehensive Curriculum</h3>
				<p class="text-zinc-400">
					From basics to advanced concepts, our curriculum covers everything you need.
				</p>
			</div>
		</div>
		<div class="mt-24 text-center">
			<a
				href="/campaigns/demo/035187b2-4872-4a22-ab10-5129447ba326/132e689c-988d-4b62-a2aa-dee68f6167ad"
				class="inline-flex justify-center items-center px-6 py-3 text-sm font-medium text-black rounded-md bg-primary-dark hover:bg-yellow-400"
			>
				Begin Your Coding Journey
				<IconWrapper size="4" className="ml-2"><IconChevronRight /></IconWrapper>
			</a>
		</div>
	</div>
</div>
