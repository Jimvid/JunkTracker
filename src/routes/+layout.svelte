<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import type { Snippet } from 'svelte';
	import '../app.css';
	import type { LayoutData } from './$types';
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	// PWA update notification state
	let showUpdatePrompt = $state(false);
	let updateServiceWorker: (() => Promise<void>) | null = null;

	onMount(async () => {
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register');
			updateServiceWorker = registerSW({
				immediate: true,
				onNeedRefresh() {
					showUpdatePrompt = true;
				},
				onOfflineReady() {
					console.log('App ready to work offline');
				}
			});
		}
	});

	async function handleUpdate() {
		if (updateServiceWorker) {
			await updateServiceWorker();
			showUpdatePrompt = false;
		}
	}
</script>

<main class="container mx-auto max-w-[1180px] p-4">
	<Navbar isLoggedIn={data.isLoggedIn} />
	{@render children()}

	{#if showUpdatePrompt}
		<div
			class="fixed bottom-4 right-4 max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
		>
			<p class="mb-3 text-sm text-gray-700">A new version of JunkTracker is available!</p>
			<div class="flex gap-2">
				<button
					onclick={handleUpdate}
					class="flex-1 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
				>
					Update Now
				</button>
				<button
					onclick={() => (showUpdatePrompt = false)}
					class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
				>
					Later
				</button>
			</div>
		</div>
	{/if}
</main>
