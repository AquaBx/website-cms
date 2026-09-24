import type { Handle } from '@sveltejs/kit';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';

import { getPayload, type Payload } from 'payload'
import config from 'aquabx-config/payload.config'
import { sequence } from '@sveltejs/kit/hooks';

let payload: Payload | null = null

const handleParaglide: Handle = ({ event, resolve }) => paraglideMiddleware(event.request, ({ request, locale }) => {
	event.request = request;

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale).replace('%paraglide.dir%', getTextDirection(locale))
	});
});

const handlePayload: Handle = async ({ event, resolve }) => {
    if (!payload) {
        payload = await getPayload({ config });
    }

	event.locals.payload = payload;

    return resolve(event);
};

export const handle: Handle = sequence(handlePayload, handleParaglide);