<script lang="ts">
	import { getMediaUrl } from "$lib";
	import { iconMap } from "$lib/icons";
	import { m } from "$lib/paraglide/messages";
	import type { Media } from "@payload-types";
	import { CircleAlert } from "@steeze-ui/lucide-icons";
	import { Icon } from "@steeze-ui/svelte-icon";
    // import { Media } from "@payload-types";

	const age = Math.floor(
		(Date.now() - new Date(2003, 5, 19).getTime()) / 31556952000,
	);

	let {data:globals} = $props()
</script>

<main
	class="min-h-[80dvh] w-dvw flex items-center flex-col justify-center text-slate-900 px-4 py-12"
>
	<div
		class="max-w-5xl w-full flex flex-col md:flex-row items-center gap-12 md:gap-16"
	>
		<div class="relative group">
			<div
				class="absolute -inset-4 bg-sky-100 rounded-2xl scale-95 group-hover:scale-100 transition-transform duration-500 opacity-50"
			></div>
			<img
				src={getMediaUrl((globals.photo as Media).url) || ""}
				alt={(globals.photo as Media).alt || ""}
				width={(globals.photo as Media).width || 0}
				height={(globals.photo as Media).height || 0}
				class="w-64 md:w-80 aspect-3/4 rounded-xl shadow-2xl object-cover relative z-10 transition-all duration-500 group-hover:-translate-y-2"
			/>
		</div>

		<div class="flex flex-col gap-6 flex-1 text-center md:text-left">
			<div class="flex flex-col gap-2">
				<h1
					class="text-5xl md:text-7xl font-black tracking-tighter text-slate-900"
				>
					{globals.name}<span class="text-sky-500">.</span>
				</h1>
			</div>

			<p class="text-lg leading-relaxed text-slate-600 max-w-2xl">
				{m.description({ age })}
			</p>

			<div
				class="flex gap-6 justify-center md:justify-start items-center mt-4"
			>
				{#each globals.socials as { name, icon, link, id }}
					<a
						target="_blank"
						class="size-6 transition-all duration-300 text-slate-400 hover:scale-110"
						href={link}
					>
						<Icon src={iconMap.get(icon) || CircleAlert}></Icon>
					</a>
				{/each}
			</div>
		</div>
	</div>
</main>
