import { getLocale } from '$lib/paraglide/runtime'

export async function load({ locals,fetch }) {
	const payload = locals.payload;
	const timelineEvents = await payload.find({
		collection: "timeline",
		locale: getLocale(),
		pagination: false,
		overrideAccess: true,
	});
    return timelineEvents
}

