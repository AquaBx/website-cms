export async function load({ locals, fetch }) {
	const payload = locals.payload;
	const globals = await payload.findGlobal({
		slug: "global-settings",
		overrideAccess: true,
	});
	return globals
}