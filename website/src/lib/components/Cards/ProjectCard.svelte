<script lang="ts">
	import type { Project, Tag } from "aquabx-config/payload-types";
	import Badge from "$lib/components/Badge.svelte";
	import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";

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
			{#if content}
				{@html convertLexicalToHTML({ data: content })}
			{/if}
		</p>
	</div>

	{#each tags || [] as tag}
		<Badge tag={tag as Tag}></Badge>
	{/each}
</a>
