<script lang="ts">
	let { isLoggedIn } = $props();
</script>

<nav
	class="mb-4 flex flex-row items-center justify-between gap-4 rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm"
>
	<div class="flex items-center gap-2 font-bold">
		<div class="rounded-full bg-gray-100 p-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				fill="currentcolor"
				viewBox="0 0 256 256"
				class="text-gray-700"
				><path
					d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM112,168a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm0-120H96V40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8Z"
				></path></svg
			>
		</div>
		<span class="text-xl font-bold text-gray-900"> JunkTracker </span>
	</div>

	<ul class="flex items-center gap-3">
		{#if isLoggedIn}
			<li>
				<form action="/logout" method="post">
					<button
						type="submit"
						class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
					>
						Logout
					</button>
				</form>
			</li>
		{:else}
			<li>
				<a
					href="/login"
					class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800"
				>
					Login
				</a>
			</li>
		{/if}
	</ul>
</nav>
