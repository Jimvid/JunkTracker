<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { addDays, startOfYear, endOfYear, differenceInDays, format, getDay } from 'date-fns';

	type ContributionData = {
		[date: string]: number;
	};

	type YearContributions = {
		[year: string]: ContributionData;
	};

	const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	let contributions: YearContributions = {};
	let selectedYear: number = new Date().getFullYear();
	const availableYears = [2024, 2025];

	const getColor = (contributions: number): string => {
		if (contributions === 0) return '#ebedf0';
		if (contributions < 3) return '#9be9a8';
		if (contributions < 6) return '#40c463';
		if (contributions < 9) return '#30a14e';
		return '#216e39';
	};

	const generateYearData = (year: number): YearContributions => {
		const data: ContributionData = {};
		const startYear = startOfYear(new Date(year, 0, 1));
		const endYear = endOfYear(new Date(year, 11, 31));
		const daysInYear = differenceInDays(endYear, startYear) + 1;

		for (let i = 0; i < daysInYear; i++) {
			const date = addDays(startYear, i);
			const dateKey = format(date, 'yyyy-MM-dd');
			data[dateKey] = Math.floor(Math.random() * 2);
		}

		return { [year]: data };
	};

	const updateContributions = (): void => {
		availableYears.forEach((year) => {
			if (!contributions[year]) {
				contributions = {
					...contributions,
					...generateYearData(year)
				};
			}
		});

		if (browser) {
			localStorage.setItem('yearContributions', JSON.stringify(contributions));
		}
	};

	onMount(() => {
		if (browser) {
			const savedContributions = localStorage.getItem('yearContributions');
			contributions = savedContributions ? JSON.parse(savedContributions) : {};

			if (Object.keys(contributions).length === 0) {
				updateContributions();
			}
		}
	});
</script>

<div class="flex flex-col gap-2">
	<div class="mb-4">
		{#each availableYears as year}
			<button
				class="m-1 rounded px-4 py-2 {selectedYear === year
					? 'bg-blue-500 text-white'
					: 'bg-gray-200'}"
				on:click={() => (selectedYear = year)}
			>
				{year}
			</button>
		{/each}
	</div>

	<div class="flex items-center rounded-[4px] border border-black p-3">
		<div class="mr-2 flex flex-col text-xs">
			{#each WEEKDAY_LABELS as label}
				<div class="m-0.5 flex h-4 items-center">{label}</div>
			{/each}
		</div>

		{#if contributions[selectedYear]}
			<div class="flex">
				{#each Array(Math.ceil(Object.keys(contributions[selectedYear]).length / 7)) as _, week}
					<div class="flex flex-col">
						{#each WEEKDAY_LABELS as _, dayOfWeek}
							{@const dayEntries = Object.entries(contributions[selectedYear])
								.filter(([date]) => getDay(new Date(date)) === dayOfWeek)
								.slice(week, week + 1)[0]}
							{#if dayEntries}
								<div
									class="m-0.5 h-4 w-4 rounded"
									style="background-color: {getColor(dayEntries[1])}"
									title="{dayEntries[0]}: {dayEntries[1]} contributions"
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
