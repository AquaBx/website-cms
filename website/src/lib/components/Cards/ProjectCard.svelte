<script lang="ts">
	// import { Project, Tag } from "@payload-types";
	import Badge from "$lib/components/Badge.svelte";

	let { content, title, createdAt, id, url, tags, ...el }: Project = $props();
</script>

<a
	href={url || ""}
	class="flex flex-col p-4 border border-slate-200 shadow-md bg-white rounded-2xl overflow-hidden"
>
	<h2 class="font-black text-2xl leading-tight">
		{title}
	</h2>

	<div class="mb-2">
		<p class="text-slate-600 line-clamp-3">
			{content}
			<!-- {/* <RichText data={ as any}></RichText> */} -->
		</p>
	</div>

	{#each tags || [] as tag}
		<Badge tag={tag as Tag}></Badge>
	{/each}
</a>
