<script lang="ts">
	import { format } from 'date-fns';
	const today = format(new Date(), 'yyyy-MM-dd');
</script>

<form class="flex flex-col gap-2 md:flex-row" method="POST" action="?/addLog">
	<input
		class="flex-auto rounded-[4px] border border-black p-3"
		type="text"
		id="description"
		name="description"
		placeholder="What did you eat or resist to eat?"
		required
	/>
	<input
		class="rounded-[4px] border border-black p-3"
		required
		value={today}
		type="date"
		id="date"
		name="date"
	/>
	<label class="rounded-[4px] border border-black p-3" for="junkfree"
		>Did you resist your inner demons?
		<input
			class="ml-2 rounded-[4px] border border-black"
			type="checkbox"
			id="junkfree"
			name="junkfree"
		/>
	</label>

	<button class="rounded-[4px] border border-black bg-black p-3 text-white" type="submit"
		>Submit</button
	>
</form>
