<script lang="ts">
	import { getMediaUrl } from "$lib";
	import CVBuilder from "$lib/components/Typst/CVBuilder.svelte";
	import { m } from "$lib/paraglide/messages";
	import { getLocale } from "$lib/paraglide/runtime";
	import type { Media } from "aquabx-config/payload-types";
	import path from "path";

	const { data } = $props();
	const {
		data: [globals, projects, work, education, volunteering, competition],
		avatar,
	} = $derived(data);
</script>

<main
	class="min-h-dvh w-dvw flex items-center flex-col text-slate-900 px-4 py-12"
>
	<div
		class="flex flex-col items-center gap-2 text-center pt-8 pb-8 print:hidden"
	>
		<h1
			class="text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
		>
			{m.cv()}
		</h1>
		<div class="h-1 w-12 bg-slate-900 rounded-full mt-2"></div>
	</div>

	<CVBuilder
		avatar_name={(globals.photo as Media).filename || ""}
		locale={getLocale()}
		messages={{
			work: m.work(),
			projects: m.projects(),
			studies: m.studies(),
			contests: m.contests(),
			volunteering: m.volunteering(),
		}}
		{globals}
		data={{
			projects: projects.docs,
			work: work.docs,
			education: education.docs,
			volunteering: volunteering.docs,
			competition: competition.docs,
		}}
		{avatar}
	/>
</main>
