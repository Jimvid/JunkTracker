<script lang="ts">
	import type { JunkLog } from '$lib/server/db/schema';
	import { format } from 'date-fns';

	const ITEMS_PER_PAGE = 10;

	const { logs }: { [date: string]: JunkLog[] | null } = $props();

	const sortedLogs = logs?.sort((a, b) => new Date(b.date) - new Date(a.date)) || [];

	let currentPage = $state(1);
	let displayLogs = $state(sortedLogs.slice(0, ITEMS_PER_PAGE));

	const hasMoreLogs = $derived(displayLogs.length < sortedLogs.length);

	function loadMoreLogs() {
		const nextPage = currentPage + 1;
		const startIndex = currentPage * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;

		const newLogs = sortedLogs.slice(startIndex, endIndex);

		displayLogs = [...displayLogs, ...newLogs];
		currentPage = nextPage;
	}
</script>

<div class="rounded-lg border border-gray-300 bg-white shadow-sm">
	<div class="border-b border-gray-200 p-4">
		<h2 class="text-lg font-semibold text-gray-900">Recent Entries</h2>
		<p class="text-sm text-gray-600">{sortedLogs.length} total entries</p>
	</div>

	{#if displayLogs.length > 0}
		<div class="divide-y divide-gray-200">
			{#each displayLogs as log}
				<div class="flex items-center justify-between p-4 transition-colors hover:bg-gray-50">
					<div class="flex items-center gap-4">
						<!-- Date badge -->
						<div class="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-gray-100 text-center">
							<span class="text-xs font-semibold text-gray-600">{format(log.date, 'MMM')}</span>
							<span class="text-lg font-bold text-gray-900">{format(log.date, 'd')}</span>
						</div>

						<!-- Description -->
						<div>
							<p class="text-sm font-medium text-gray-900">{log.description || '(No description)'}</p>
							<p class="text-xs text-gray-500">{format(log.date, 'EEEE, yyyy')}</p>
						</div>
					</div>

					<div class="flex items-center gap-2">
						<!-- Junk-free indicator -->
						{#if log.junkFree}
							<div class="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
								</svg>
								<span>Junk-free</span>
							</div>
						{:else}
							<div class="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
								Junk eaten
							</div>
						{/if}

						<!-- Delete button -->
						<form method="POST" action="?/deleteLog">
							<input type="hidden" name="id" value={log.id} />
							<button
								type="submit"
								class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
								aria-label="Delete entry"
							>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
								</svg>
							</button>
						</form>
					</div>
				</div>
			{/each}
		</div>

		{#if hasMoreLogs}
			<div class="border-t border-gray-200 p-4">
				<button
					onclick={loadMoreLogs}
					class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
				>
					Load More
				</button>
			</div>
		{/if}
	{:else}
		<div class="p-8 text-center">
			<p class="text-gray-500">No entries found. Start tracking your junk food intake!</p>
		</div>
	{/if}
</div>
