<script lang="ts">
	import type { Timeline } from "aquabx-config/payload-types";
	import { Calendar, MapPin } from "@steeze-ui/lucide-icons";
	import FormattedDate from "$lib/components/FormattedDate.svelte";
	import { Icon } from "@steeze-ui/svelte-icon";
	import { m } from "$lib/paraglide/messages";
	import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";

	let { element }: { element: Timeline } = $props();
</script>

<div
	class="flex-1 p-6 md:p-8 flex flex-col gap-4 group relative bg-white border border-slate-200 rounded-2xl overflow-hidden"
>
	<div class="flex justify-between items-start">
		<div class="flex flex-col gap-1">
			<h3
				class="text-2xl font-bold tracking-tight text-slate-900 transition-colors"
			>
				{element.title}
			</h3>

			<div
				class="flex gap-1.5 items-center text-sm text-slate-400 font-medium"
			>
				<Icon src={MapPin} class="size-3.5" />
				<span>{element.company} - {element.location}</span>
			</div>
		</div>

		<div class="hidden sm:flex flex-col items-end gap-1">
			<div
				class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-md"
			>
				<Icon src={Calendar} class="size-3" />
				<FormattedDate date={element.startDate}></FormattedDate> —
				{#if element.endDate}
					<FormattedDate date={element.endDate}></FormattedDate>
				{:else}
					{m.today()}
				{/if}
			</div>
		</div>
	</div>

	<div
		class="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm md:text-base"
	>
		{#if element.description}
			{@html convertLexicalToHTML({data:element.description})}
		{/if}
	</div>
</div>
