<script lang="ts">
	import LogForm from '$lib/components/LogForm.svelte';
	import LogFeed from '$lib/components/LogFeed.svelte';
	import Graph from '$lib/components/Graph.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	console.log(data);
</script>

<section class="flex flex-col gap-6 md:py-24">
	<div>
		<h1 class="mb-4 text-6xl font-bold">Log your junkfood intake</h1>
		<h2 class="text-2xl font-semibold">234 contrubutions of junkfood this last year</h2>
	</div>
	<LogForm />
	<Graph />
	<LogFeed />
</section>
