import { getLocale } from '$lib/paraglide/runtime'
// import { getPayload } from "payload";
// import config from "@payload-config";

export async function load({ locals,fetch }) {
	const payload = locals.payload;
	const projects = await payload.find({
		where: {
			shown: {
				equals: true,
			},
		},
		collection: "projects",
		locale: getLocale(),
		pagination: false,
		overrideAccess: true,
	});
    return projects
}

