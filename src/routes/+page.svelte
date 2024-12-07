<script>
	import Progress from '$lib/components/forms/Progress.svelte';
	import IconTerminal from '$lib/components/icons/lucide/IconTerminal.svelte';
	import IconCode from '$lib/components/icons/lucide/IconCode.svelte';
	import IconBookOpen from '$lib/components/icons/lucide/IconBookOpen.svelte';
	import IconChevronRight from '$lib/components/icons/lucide/IconChevronRight.svelte';
	import IconWrapper from '$lib/components/icons/IconWrapper.svelte';
	import { UserStore } from '$auth/stores/UserStore.svelte';
</script>

<div class="min-h-screen bg-bg-dark text-zinc-100 font-mono">
	<div class="container mx-auto px-4 py-16 lg:w-4/5">
		<div class="grid gap-16 lg:grid-cols-2 lg:gap-8 items-center">
			<div class="space-y-8">
				<div
					class="inline-block rounded-lg bg-primary-light/10 px-3 py-1 text-sm text-primary-dark"
				>
					Learn to code interactively
				</div>
				<h1
					class="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary-dark to-primary-light"
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
						class="inline-flex items-center justify-center rounded-md bg-primary-dark px-6 py-3 text-sm font-medium text-black hover:bg-yellow-400"
					>
						Try the app
						<IconWrapper size="4" className="ml-2"><IconChevronRight /></IconWrapper>
					</a>
					{#if !UserStore.user}
						<a
							href="/login"
							class="px-4 py-2 border border-bg-light rounded-md inline-flex items-center justify-center"
						>
							Create an account
						</a>
					{/if}
				</div>
			</div>
			<div class="relative">
				<div class="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur">
					<div class="mb-4 flex items-center justify-between">
						<div class="flex items-center gap-2">
							<div class="h-3 w-3 rounded-full bg-red-500"></div>
							<div class="h-3 w-3 rounded-full bg-yellow-500"></div>
							<div class="h-3 w-3 rounded-full bg-green-500"></div>
						</div>
						<div class="flex items-center gap-4">
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
		<div class="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
			<div class="rounded-lg border border-bg-light bg-bg-medium p-6">
				<IconWrapper size="12" className="text-primary-dark mb-4"><IconTerminal /></IconWrapper>
				<h3 class="text-xl font-bold mb-2">Interactive Console</h3>
				<p class="text-zinc-400">
					Write and execute real code directly in your browser with instant feedback.
				</p>
			</div>
			<div class="rounded-lg border border-bg-light bg-bg-medium p-6">
				<IconWrapper size="12" className="text-primary-dark mb-4"><IconCode /></IconWrapper>
				<h3 class="text-xl font-bold mb-2">Step-by-Step Learning</h3>
				<p class="text-zinc-400">
					Progress through carefully crafted lessons that build your programming skills.
				</p>
			</div>
			<div class="rounded-lg border border-bg-light bg-bg-medium p-6">
				<IconWrapper size="12" className="text-primary-dark mb-4"><IconBookOpen /></IconWrapper>
				<h3 class="text-xl font-bold mb-2">Comprehensive Curriculum</h3>
				<p class="text-zinc-400">
					From basics to advanced concepts, our curriculum covers everything you need.
				</p>
			</div>
		</div>
		<div class="mt-24 text-center">
			<a
				href="/campaigns/demo/035187b2-4872-4a22-ab10-5129447ba326/1"
				class="inline-flex items-center justify-center rounded-md bg-primary-dark px-6 py-3 text-sm font-medium text-black hover:bg-yellow-400"
			>
				Begin Your Coding Journey
				<IconWrapper size="4" className="ml-2"><IconChevronRight /></IconWrapper>
			</a>
		</div>
	</div>
</div>
