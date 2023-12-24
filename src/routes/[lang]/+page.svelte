<script lang="ts">
	import LL from '$translation/i18n-svelte';
	import Icon from '@iconify/svelte';
</script>

<svelte:head>
	<title>{$LL.greeting()}</title>
</svelte:head>

<h1 class="flex items-end font-bold text-8xl">
	{$LL.greeting()}&nbsp;<Icon icon="bx:world" />!
</h1>
