<script lang="ts">
	import { browser } from '$app/environment';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { setLocale, locale } from '$translation/i18n-svelte';
	import type { Locales } from '$translation/i18n-types';
	import { locales } from '$translation/i18n-util';
	import { loadLocaleAsync } from '$translation/i18n-util.async';
	import { replaceLocaleInUrl } from '$lib/utils';
	import * as Select from '$lib/components/ui/select';

	const switchLocale = async (newLocale: Locales, updateHistoryState = true) => {
		if (!newLocale || $locale === newLocale) return;

		// load new dictionary from server
		await loadLocaleAsync(newLocale);

		// select locale
		setLocale(newLocale);

		if (updateHistoryState) {
			// update url to reflect locale changes
			history.pushState({ locale: newLocale }, '', replaceLocaleInUrl($page.url, newLocale));
		}

		// run the `load` function again
		invalidateAll();
	};

	// update `lang` attribute
	$: browser && document.querySelector('html')!.setAttribute('lang', $locale);

	// update locale when navigating via browser back/forward buttons
	const handlePopStateEvent = async ({ state }: PopStateEvent) =>
		switchLocale(state.locale, false);

	// update locale when page store changes
	function updateLocale(lang: Locales) {
		switchLocale(lang, false);
		history.replaceState(
			{ ...history.state, locale: lang },
			'',
			replaceLocaleInUrl($page.url, lang)
		);
	}

	$: if (browser) {
		const urlLang = $page.params.lang as Locales;
		const selectedLang = selectedLanguage?.value as Locales;

		const lang = selectedLang || urlLang;

		updateLocale(lang);
	}

	let selectedLanguage = { value: 'en' };
</script>

<svelte:window on:popstate={handlePopStateEvent} />

<Select.Root bind:selected={selectedLanguage}>
	<Select.Trigger class="w-[180px]">
		<Select.Value placeholder="Select a Locale" />
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>Locales</Select.Label>
			{#each locales as l}
				<Select.Item value={l} label={l}>{l}</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
	<Select.Input name="locale" />
</Select.Root>
