<script lang="ts">
	// import { Tag } from "@payload-types";
	let { tag }: { tag: Tag } = $props();
</script>

<div
	class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-tight shadow-sm hover:border-sky-200 hover:bg-sky-50 transition-colors"
>
	<!-- <Icon src={mapping[icon] ? mapping[icon] : BadgeInfo} class="size-3 text-slate-400"></Icon> -->
	<span class="truncate max-w-30">{tag.name}</span>
</div>
