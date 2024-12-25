<script lang="ts">
	import LogForm from '$lib/components/LogForm.svelte';
	import LogFeed from '$lib/components/LogFeed.svelte';
	import type { PageData } from './$types';
	import { getDay } from 'date-fns';
	import { getColor } from '$lib/util';

	let { data }: { data: PageData } = $props();

	const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	let selectedYear: number = $state(new Date().getFullYear());
	const availableYears = [2024, 2025];
</script>

<section class="m-4 flex flex-col gap-3 md:gap-6 md:py-24">
	<div>
		<h1 class=" text-4xl font-bold md:mb-4 md:text-6xl">Log your junkfood intake</h1>
		<h2 class="text-lg font-semibold md:text-2xl">
			{data.numberOfContributions} contrubutions of junkfood this last year
		</h2>
	</div>
	<LogForm />

	<div class="flex flex-col gap-2">
		<div class="mb-4">
			{#each availableYears as year}
				<button
					class="m-1 rounded px-4 py-2 {selectedYear === year
						? 'bg-blue-500 text-white'
						: 'bg-gray-200'}"
					onclick={() => (selectedYear = year)}
				>
					{year}
				</button>
			{/each}
		</div>
		<div class="flex flex-col overflow-scroll rounded-[4px] border border-black p-3">
			<div class="flex items-center p-3">
				<div class="mr-2 flex flex-col text-xs">
					{#each WEEKDAY_LABELS as label}
						<div class="m-0.5 flex h-4 items-center">{label}</div>
					{/each}
				</div>
				{#if data.contributions[selectedYear]}
					<div class="mr-4 flex flex-shrink-0">
						{#each Array(Math.ceil(Object.keys(data.contributions[selectedYear]).length / 7)) as _, week}
							<div class="flex flex-col last-of-type:mr-4">
								{#each WEEKDAY_LABELS as _, dayOfWeek}
									{@const dayEntries = Object.entries(data.contributions[selectedYear])
										.filter(([date]) => getDay(new Date(date)) === dayOfWeek)
										.slice(week, week + 1)[0]}
									{#if dayEntries}
										{@const isJunkFree = dayEntries[1]?.every((log) => log.junkFree)}
										<div
											class="m-0.5 h-4 w-4 rounded"
											style="background-color: {isJunkFree
												? '#2b984b'
												: getColor(dayEntries[1]?.length || 0)}"
											title="{dayEntries[0]}: {dayEntries[1]?.length} contributions"
										></div>
									{:else}
										<div class="m-0.5 h-4 w-4 rounded bg-gray-100"></div>
									{/if}
								{/each}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
	<LogFeed logs={data.logs} />
</section>
