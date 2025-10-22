<script lang="ts">
	import { format } from 'date-fns';

	let { selectedDate = format(new Date(), 'yyyy-MM-dd') } = $props();
</script>

<form class="rounded-lg border border-gray-300 bg-white p-6 shadow-sm" method="POST" action="?/addLog">
	<h2 class="mb-4 text-lg font-semibold text-gray-900">Add Entry</h2>

	<div class="flex flex-col gap-3 md:flex-row md:items-end">
		<div class="flex-auto">
			<label class="mb-1 block text-sm font-medium text-gray-700" for="description">
				Description
			</label>
			<input
				class="w-full rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
				type="text"
				id="description"
				name="description"
				placeholder="What did you eat or resist?"
			/>
		</div>

		<div>
			<label class="mb-1 block text-sm font-medium text-gray-700" for="date">
				Date
			</label>
			<input
				class="rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
				required
				value={selectedDate}
				type="date"
				id="date"
				name="date"
			/>
		</div>

		<label class="flex items-center gap-2 rounded-lg border border-gray-300 p-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50" for="junkfree">
			<input
				class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-200"
				type="checkbox"
				id="junkfree"
				name="junkfree"
			/>
			<span>Junk-free day</span>
		</label>

		<button
			class="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800"
			type="submit"
		>
			Add Entry
		</button>
	</div>
</form>
