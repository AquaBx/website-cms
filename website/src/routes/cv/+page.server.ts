import { getMediaUrl } from '$lib';
import { getLocale } from '$lib/paraglide/runtime'
import type { Media } from "aquabx-config/payload-types";

export async function load({ locals, fetch }) {
	const commonOptions = {
		locale: getLocale(),
		pagination: false as const,
		overrideAccess: true,
	};
	const payload = locals.payload;

	const data = await Promise.all([
		payload.findGlobal({ slug: "global-settings", ...commonOptions }),
		payload.find({ collection: "projects", ...commonOptions }),
		payload.find({
			collection: "timeline",
			...commonOptions,
			where: { type: { equals: "work" } },
		}),
		payload.find({
			collection: "timeline",
			...commonOptions,
			where: { type: { equals: "education" } },
		}),
		payload.find({
			collection: "timeline",
			...commonOptions,
			where: { type: { equals: "volunteering" } },
		}),
		payload.find({
			collection: "timeline",
			...commonOptions,
			where: { type: { equals: "competition" } },
		}),
	])

	const file = await fetch(getMediaUrl((data[0].photo as Media).url))
	const avatar = await file.bytes()

	return {
		avatar,
		data
	}
}

