<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<main class="container mx-auto max-w-[1120px]">
	{@render children()}
</main>
