<script lang="ts">
	import LogForm from '$lib/components/LogForm.svelte';
	import LogFeed from '$lib/components/LogFeed.svelte';
	import type { PageData } from './$types';
	import { getDay, format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
	import { getColor } from '$lib/util';

	let { data }: { data: PageData } = $props();

	const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	let selectedYear: number = $state(new Date().getFullYear());
	let selectedMonth: number = $state(new Date().getMonth()); // 0-11
	let selectedQuarter: number = $state(Math.floor(new Date().getMonth() / 3)); // 0-3 (Q1, Q2, Q3, Q4)
	let hoveredDay: string | null = $state(null);
	let selectedFormDate: string = $state(format(new Date(), 'yyyy-MM-dd'));
	const availableYears = [2024, 2025];

	function handleDateClick(dateStr: string) {
		selectedFormDate = dateStr;
	}

	// Calculate stats
	function calculateCurrentStreak(contributions: { [date: string]: any[] | null }): number {
		const today = format(new Date(), 'yyyy-MM-dd');
		let streak = 0;
		let currentDate = new Date();

		while (true) {
			const dateStr = format(currentDate, 'yyyy-MM-dd');
			const dayData = contributions[dateStr];

			// Check if day has logs and ALL logs are junk-free
			if (!dayData || dayData.length === 0 || !dayData.every((log) => log.junkFree)) {
				break;
			}

			streak++;
			currentDate.setDate(currentDate.getDate() - 1);
		}

		return streak;
	}

	function calculateJunkFreeDays(contributions: { [date: string]: any[] | null }): number {
		let count = 0;

		for (const [date, logs] of Object.entries(contributions)) {
			if (logs && logs.length > 0 && logs.every((log) => log.junkFree)) {
				count++;
			}
		}

		return count;
	}

	const currentYearContributions = data.contributions[selectedYear] || {};
	const currentStreak = calculateCurrentStreak(currentYearContributions);
	const junkFreeDays = calculateJunkFreeDays(currentYearContributions);

	// Get months for the selected quarter
	function getQuarterMonths(quarter: number): number[] {
		const startMonth = quarter * 3;
		return [startMonth, startMonth + 1, startMonth + 2];
	}

	function previousQuarter() {
		if (selectedQuarter === 0) {
			selectedQuarter = 3;
			selectedYear = selectedYear - 1;
		} else {
			selectedQuarter = selectedQuarter - 1;
		}
	}

	function nextQuarter() {
		if (selectedQuarter === 3) {
			selectedQuarter = 0;
			selectedYear = selectedYear + 1;
		} else {
			selectedQuarter = selectedQuarter + 1;
		}
	}

	function goToCurrentQuarter() {
		selectedYear = new Date().getFullYear();
		selectedQuarter = Math.floor(new Date().getMonth() / 3);
	}

	// Get calendar days for the selected month
	function getCalendarDays(year: number, month: number) {
		const monthStart = startOfMonth(new Date(year, month, 1));
		const monthEnd = endOfMonth(new Date(year, month, 1));

		// Get the week start (Sunday) of the first day of month
		const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
		// Get the week end (Saturday) of the last day of month
		const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

		return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
	}

	function previousMonth() {
		if (selectedMonth === 0) {
			selectedMonth = 11;
			selectedYear = selectedYear - 1;
		} else {
			selectedMonth = selectedMonth - 1;
		}
	}

	function nextMonth() {
		if (selectedMonth === 11) {
			selectedMonth = 0;
			selectedYear = selectedYear + 1;
		} else {
			selectedMonth = selectedMonth + 1;
		}
	}

	function goToCurrentMonth() {
		selectedYear = new Date().getFullYear();
		selectedMonth = new Date().getMonth();
	}
</script>

<section class="flex flex-col gap-3 md:gap-6">
	<!-- Stats Dashboard -->
	<div class="grid grid-cols-3 gap-2 md:gap-4">
		<!-- Total Contributions Card -->
		<div class="rounded-lg border border-gray-300 bg-white p-3 shadow-sm md:p-6">
			<div class="flex flex-col items-center gap-2 md:flex-row md:items-center md:justify-between">
				<div class="rounded-full bg-blue-100 p-2 md:hidden">
					<svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
					</svg>
				</div>
				<div class="text-center md:text-left">
					<p class="text-xs font-medium text-gray-600 md:text-sm">Total Entries</p>
					<p class="mt-1 text-2xl font-bold text-gray-900 md:mt-2 md:text-3xl">{data.numberOfContributions}</p>
					<p class="mt-0.5 hidden text-xs text-gray-500 md:mt-1 md:block">This year</p>
				</div>
				<div class="hidden rounded-full bg-blue-100 p-3 md:block">
					<svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
					</svg>
				</div>
			</div>
		</div>

		<!-- Current Streak Card -->
		<div class="rounded-lg border border-gray-300 bg-white p-3 shadow-sm md:p-6">
			<div class="flex flex-col items-center gap-2 md:flex-row md:items-center md:justify-between">
				<div class="rounded-full bg-orange-100 p-2 md:hidden">
					<svg class="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
					</svg>
				</div>
				<div class="text-center md:text-left">
					<p class="text-xs font-medium text-gray-600 md:text-sm">Streak</p>
					<p class="mt-1 text-2xl font-bold text-gray-900 md:mt-2 md:text-3xl">{currentStreak}</p>
					<p class="mt-0.5 hidden text-xs text-gray-500 md:mt-1 md:block">Clean days in a row</p>
				</div>
				<div class="hidden rounded-full bg-orange-100 p-3 md:block">
					<svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
					</svg>
				</div>
			</div>
		</div>

		<!-- Junk-Free Days Card -->
		<div class="rounded-lg border border-gray-300 bg-white p-3 shadow-sm md:p-6">
			<div class="flex flex-col items-center gap-2 md:flex-row md:items-center md:justify-between">
				<div class="rounded-full bg-green-100 p-2 md:hidden">
					<svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<div class="text-center md:text-left">
					<p class="text-xs font-medium text-gray-600 md:text-sm">Clean days</p>
					<p class="mt-1 text-2xl font-bold text-gray-900 md:mt-2 md:text-3xl">{junkFreeDays}</p>
					<p class="mt-0.5 hidden text-xs text-gray-500 md:mt-1 md:block">This year</p>
				</div>
				<div class="hidden rounded-full bg-green-100 p-3 md:block">
					<svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
			</div>
		</div>
	</div>

	<LogForm selectedDate={selectedFormDate} />

	<div class="flex flex-col gap-2">
		<!-- Desktop: Quarter navigation + 3-month row -->
		<div class="hidden md:block">
			<!-- Quarter navigation header -->
			<div class="mb-4 flex items-center justify-between rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
				<button
					onclick={previousQuarter}
					class="rounded p-2 hover:bg-gray-100 active:bg-gray-200"
					aria-label="Previous quarter"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
				</button>

				<div class="flex flex-col items-center">
					<h3 class="text-xl font-bold">Q{selectedQuarter + 1} {selectedYear}</h3>
					<button
						onclick={goToCurrentQuarter}
						class="text-sm text-blue-600 hover:underline"
					>
						Current quarter
					</button>
				</div>

				<button
					onclick={nextQuarter}
					class="rounded p-2 hover:bg-gray-100 active:bg-gray-200"
					aria-label="Next quarter"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</button>
			</div>

			<!-- 3-month grid -->
			<div class="grid grid-cols-3 gap-4">
				{#each getQuarterMonths(selectedQuarter) as monthIndex}
					{@const calendarDays = getCalendarDays(selectedYear, monthIndex)}
					<div class="rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
						<!-- Month header -->
						<h3 class="mb-3 text-center text-sm font-semibold text-gray-900">
							{MONTH_NAMES[monthIndex]}
						</h3>

						<!-- Day headers -->
						<div class="mb-2 grid grid-cols-7 gap-1">
							{#each WEEKDAY_LABELS as label}
								<div class="text-center text-[10px] font-semibold text-gray-500">{label[0]}</div>
							{/each}
						</div>

						<!-- Calendar days -->
						{#if data.contributions[selectedYear]}
							<div class="grid grid-cols-7 gap-1">
								{#each calendarDays as day}
									{@const dateStr = format(day, 'yyyy-MM-dd')}
									{@const dayData = data.contributions[selectedYear][dateStr]}
									{@const isCurrentMonth = day.getMonth() === monthIndex}
									{@const isToday = dateStr === format(new Date(), 'yyyy-MM-dd')}
									{@const isJunkFree = dayData?.every((log) => log.junkFree)}

									<button
										class="group relative aspect-square rounded border {isToday ? 'border-blue-500 ring-2 ring-blue-300' : 'border-transparent'} flex items-center justify-center text-[10px] font-medium transition-all hover:scale-110 hover:z-10 {!isCurrentMonth ? 'opacity-20' : ''}"
										style="background-color: {dayData ? (isJunkFree ? '#2b984b' : getColor(dayData.length)) : '#fafafa'}"
										onmouseenter={() => hoveredDay = dateStr}
										onmouseleave={() => hoveredDay = null}
										onclick={() => handleDateClick(dateStr)}
									>
										<span class="{dayData && !isJunkFree ? 'text-white' : 'text-gray-700'}">
											{day.getDate()}
										</span>

										<!-- Tooltip popup -->
										{#if hoveredDay === dateStr && dayData}
											<div class="absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-xl">
												<div class="font-semibold">{format(day, 'MMM d, yyyy')}</div>
												<div class="mt-1">
													{#if isJunkFree}
														<span class="text-green-400">✓ Junk-free day!</span>
													{:else}
														<span>{dayData.length} contribution{dayData.length !== 1 ? 's' : ''}</span>
													{/if}
												</div>
												<!-- Arrow pointing down -->
												<div class="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
											</div>
										{/if}
									</button>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- Mobile view: monthly calendar -->
		<div class="flex flex-col rounded-[4px] border border-gray-300 md:hidden">
			<!-- Month navigation header -->
			<div class="flex items-center justify-between border-b border-gray-300 p-3">
				<button
					onclick={previousMonth}
					class="rounded p-2 hover:bg-gray-100 active:bg-gray-200"
					aria-label="Previous month"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
				</button>

				<div class="flex flex-col items-center">
					<h3 class="text-lg font-semibold">{MONTH_NAMES[selectedMonth]} {selectedYear}</h3>
					<button
						onclick={goToCurrentMonth}
						class="text-xs text-blue-600 hover:underline"
					>
						Today
					</button>
				</div>

				<button
					onclick={nextMonth}
					class="rounded p-2 hover:bg-gray-100 active:bg-gray-200"
					aria-label="Next month"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</button>
			</div>

			<!-- Calendar grid -->
			<div class="relative p-3">
				<!-- Day headers -->
				<div class="mb-2 grid grid-cols-7 gap-1">
					{#each WEEKDAY_LABELS as label}
						<div class="text-center text-xs font-semibold text-gray-600">{label}</div>
					{/each}
				</div>

				<!-- Calendar days -->
				{#if data.contributions[selectedYear]}
					{@const calendarDays = getCalendarDays(selectedYear, selectedMonth)}
					<div class="grid grid-cols-7 gap-1">
						{#each calendarDays as day}
							{@const dateStr = format(day, 'yyyy-MM-dd')}
							{@const dayData = data.contributions[selectedYear][dateStr]}
							{@const isCurrentMonth = day.getMonth() === selectedMonth}
							{@const isToday = dateStr === format(new Date(), 'yyyy-MM-dd')}
							{@const isJunkFree = dayData?.every((log) => log.junkFree)}

							<button
								class="relative aspect-square rounded-lg border-2 {isToday ? 'border-blue-500' : 'border-transparent'} flex items-center justify-center p-1 {!isCurrentMonth ? 'opacity-30' : ''} transition-transform active:scale-95"
								style="background-color: {dayData ? (isJunkFree ? '#2b984b' : getColor(dayData.length)) : '#fafafa'}"
								onmouseenter={() => hoveredDay = dateStr}
								onmouseleave={() => hoveredDay = null}
								onclick={() => {
									hoveredDay = hoveredDay === dateStr ? null : dateStr;
									handleDateClick(dateStr);
								}}
							>
								<span class="text-xs font-medium {dayData && !isJunkFree ? 'text-white' : 'text-gray-700'}">
									{day.getDate()}
								</span>

								<!-- Tooltip popup -->
								{#if hoveredDay === dateStr && dayData}
									<div class="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg">
										<div class="font-semibold">{format(day, 'MMM d, yyyy')}</div>
										<div class="mt-1">
											{#if isJunkFree}
												<span class="text-green-400">✓ Junk-free day!</span>
											{:else}
												<span>{dayData.length} contribution{dayData.length !== 1 ? 's' : ''}</span>
											{/if}
										</div>
										<!-- Arrow pointing down -->
										<div class="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
									</div>
								{/if}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
	<LogFeed logs={data.logs} />
</section>
