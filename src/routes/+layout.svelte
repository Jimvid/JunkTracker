<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import type { Snippet } from 'svelte';
	import '../app.css';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<main class="container mx-auto max-w-[1180px]">
	<Navbar isLoggedIn={data.isLoggedIn} />
	{@render children()}
</main>
