<script lang="ts">
	import '$main/app.css';
	import { page } from '$app/stores';
	import { setLocale } from '$translation/i18n-svelte';
	import type { LayoutData } from './$types';
	import Header from '$component/Header.svelte';

	export let data: LayoutData;
	// at the very top, set the locale before you access the store and before the actual rendering takes place
	setLocale(data.locale);
</script>

<Header />

<main class="flex items-center justify-center min-h-screen">
	<slot />
</main>

<svelte:head>
	<title>{$page.data.greeting}</title>
</svelte:head>
