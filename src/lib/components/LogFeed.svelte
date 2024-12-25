<script lang="ts">
	import type { JunkLog } from '$lib/server/db/schema';
	import { format } from 'date-fns';

	const ITEMS_PER_PAGE = 4;

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

{#if displayLogs.length > 0}
	{#each displayLogs as log}
		<div class="log-entry">
			<span class="log-date">
				{format(log.date, 'd LLL yyyy')}
			</span>
			<span class="log-description">
				{log.description}
			</span>
		</div>
	{/each}

	{#if hasMoreLogs}
		<button onclick={loadMoreLogs} class="load-more-btn"> Load More </button>
	{/if}
{:else}
	<p>No food logs found.</p>
{/if}
