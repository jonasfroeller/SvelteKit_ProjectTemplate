<script lang="ts">
	import { page } from '$app/stores';
	import { buttonVariants } from '$lib/components/ui/button';
</script>

<section class="flex flex-col items-center justify-center h-screen text-center">
	<h1 class="text-8xl">{$page.status} {$page?.error?.message}</h1>
	<p class="mb-4 text-4xl text-primary">Path: {$page.url.pathname}</p>
	<a href="/" class={buttonVariants({ variant: 'outline' })}> Home </a>
</section>
