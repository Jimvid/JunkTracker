<script lang="ts">
	let { isLoggedIn } = $props();
</script>

<nav
	class="flex flex-col items-center justify-between gap-4 border-b border-black px-4 py-4 sm:flex-row"
>
	<div class="flex items-center gap-1 font-bold">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			fill="currentcolor"
			viewBox="0 0 256 256"
			><path
				d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM112,168a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm0-120H96V40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8Z"
			></path></svg
		>
		<a href="/">
			<span class="text-xl uppercase"> JunkTracker </span>
		</a>
	</div>

	<ul class="flex items-center gap-4">
		{#if isLoggedIn}
			<li><a href="/dashboard">Dashboard</a></li>
			<span class="text-gray-500">|</span>
			<li>
				<form action="/logout" method="post">
					<button type="submit">Logout</button>
				</form>
				<!-- <a href="/logout">Logout</a> -->
			</li>
		{:else}
			<li><a href="/login">Login</a></li>
		{/if}
	</ul>
</nav>
