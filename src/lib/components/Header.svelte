<script lang="ts">
	import LocaleSwitcher from '$lib/components/LocaleSwitcher.svelte';
	import { Button } from './ui/button';
	import { toggleMode, setMode, mode } from "mode-watcher";
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	let m: "dark" | "light" | "system" = $mode ?? "system";

	onMount(() => {
		setMode(m);
	});
</script>

<header class="fixed top-0 flex justify-between w-full p-4">
	<LocaleSwitcher />
	<Button on:click={() => toggleMode()} variant="outline" size="icon">
		<Icon icon="bx:sun" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
		<Icon icon="bx:moon" class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
		<span class="sr-only">Toggle theme</span>
	</Button>
</header>
