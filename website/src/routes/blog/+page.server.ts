import { getLocale } from '$lib/paraglide/runtime'
// import { getPayload } from "payload";
// import config from "@payload-config";

export async function load({ locals,fetch }) {
	const payload = locals.payload;
	const posts = await payload.find({
		collection: "posts",
		locale: getLocale(),
		pagination: false,
		overrideAccess: true,
	});
    return posts
}

