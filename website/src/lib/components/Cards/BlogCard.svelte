<script lang="ts">
	// import { Media, Post, Tag } from "@payload-types";
	import Badge from "$lib/components/Badge.svelte";

	let { content, tags, title, createdAt, summary, id, ...el }: Post =
		$props();

	const options: Intl.DateTimeFormatOptions = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	};
</script>

<a
	href={"/blog/" + id}
	class="flex flex-col p-4 border border-slate-200 shadow-md bg-white rounded-2xl overflow-hidden"
>
	<h2 class="font-black text-2xl leading-tight">
		{title}
	</h2>

	<span class="text-sm text-slate-500 mb-2">
		{new Date(createdAt).toLocaleDateString("fr", options)}
	</span>
	{#if el.coverImage}
		<img
			alt={(el.coverImage as Media).alt}
			width={(el.coverImage as Media).width || 0}
			height={(el.coverImage as Media).height || 0}
			class="mb-2 object-cover w-full aspect-video"
			src={(el.coverImage as Media).url || ""}
		/>
	{/if}

	<div class="mb-2">
		<p class="text-slate-600 line-clamp-3">
			{summary}
		</p>
	</div>

	<div class="flex gap-4">
		{#each tags as tag}
			<Badge tag={tag as Tag}></Badge>
		{/each}
	</div>
</a>
