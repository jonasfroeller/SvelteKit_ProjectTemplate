import { minify } from 'html-minifier';
import { building } from '$app/environment';
import { base } from '$app/paths';
import type { Locales } from '$translation/i18n-types.js';
import { detectLocale, i18n, isLocale } from '$translation/i18n-util';
import { loadAllLocales } from '$translation/i18n-util.sync';
import { redirect, type Handle, type RequestEvent } from '@sveltejs/kit';
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors';
import { getPathnameWithoutBase } from '$lib/utils';

loadAllLocales();
const L = i18n();

// https://kit.svelte.dev/docs/migrating#integrations-html-minifier
const minification_options = {
	useShortDoctype: true,
	trimCustomFragments: true,
	processConditionalComments: true,

	collapseBooleanAttributes: true,
	collapseWhitespace: true,
	conservativeCollapse: true,
	decodeEntities: true,
	html5: true,
	ignoreCustomComments: [/^#/],
	minifyCSS: true,
	minifyJS: false,
	removeAttributeQuotes: true,
	removeComments: false, // some hydration code needs comments, so leave them in
	removeOptionalTags: true,
	removeRedundantAttributes: true,
	removeScriptTypeAttributes: true,
	removeStyleLinkTypeAttributes: true,
	sortAttributes: true,
	sortClassName: true
};

export const handle: Handle = async ({ event, resolve }) => {
	// read language slug
	const [, lang] = getPathnameWithoutBase(event.url).split('/');

	// redirect to base locale if no locale slug was found
	if (!lang) {
		const locale = getPreferredLocale(event);

		redirect(307, `${base}/${locale}`);
	}

	// if slug is not a locale, use base locale (e.g. api endpoints)
	const locale = isLocale(lang) ? (lang as Locales) : getPreferredLocale(event);
	const LL = L[locale];

	// bind locale and translation functions to current request
	event.locals.locale = locale;
	event.locals.LL = LL;

	let page = '';
	return await resolve(event, {
		transformPageChunk: ({ html, done }) => {
			page += html;

			if (done) {
				// replace html lang attribute with correct language
				page.replace('%lang%', locale);
				return building ? minify(page, minification_options) : page;
			}
		}
	});
};

const getPreferredLocale = ({ request }: RequestEvent) => {
	// detect the preferred language the user has configured in his browser
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
	const acceptLanguageDetector = initAcceptLanguageHeaderDetector(request);

	return detectLocale(acceptLanguageDetector);
};
