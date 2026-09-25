<script lang="ts">

	import {
		BriefcaseBusiness,
		CircleHelp,
		GraduationCap,
		HandHeart,
		Swords,
	} from "@steeze-ui/lucide-icons";
	import { Icon } from "@steeze-ui/svelte-icon";
	import TimelineCard from "$lib/components/Cards/TimelineCard.svelte";
	import { m } from "$lib/paraglide/messages";

	const CATEGORY_STYLES = {
		volunteering: {
			color: "bg-pink-400/30 text-pink-600 border-pink-600",
			icon: HandHeart,
		},
		work: {
			color: "bg-yellow-400/30 text-yellow-600 border-yellow-600",
			icon: BriefcaseBusiness,
		},
		education: {
			color: "bg-green-400/30 text-green-600 border-green-600",
			icon: GraduationCap,
		},
		competition: {
			color: "bg-red-400/30 text-red-600 border-red-600",
			icon: Swords,
		},
		default: {
			color: "bg-gray-400/30 text-gray-600 border-gray-600",
			icon: CircleHelp,
		},
	};


  let {data:timelineEvents} = $props()

</script>

<main
	class="min-h-dvh w-dvw mb-16 flex items-center flex-col text-slate-900 px-4 py-12"
>
	<div
		class="flex flex-col items-center gap-2 text-center pt-8 pb-16 print:hidden"
	>
		<h1
			class="text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
		>
			{m.timeline()}
		</h1>
		<div class="h-1 w-12 bg-slate-900 rounded-full mt-2"></div>
	</div>

	<div class="mx-auto flex flex-col relative max-w-4xl w-full">
		<div
			class="absolute left-5 top-0 bottom-0 w-1 bg-slate-200 -translate-x-1/2"
		></div>

		{#each timelineEvents.docs as element}
			{@const choice =
				CATEGORY_STYLES[element.type as keyof typeof CATEGORY_STYLES] ||
				CATEGORY_STYLES.default}

			<div class="relative flex gap-4 mb-12 last:mb-0">
				<div class="flex flex-col items-center justify-center z-10">
					<div
						class="bg-white p-1 rounded-full border border-slate-100 shadow-sm"
					>
						<Icon
							src={choice.icon}
							class={`size-8 p-1.5 rounded-full ${
								choice.color.split(" ")[0]
							} ${choice.color.split(" ")[1]}`}
						/>
					</div>
				</div>

				<TimelineCard {element}></TimelineCard>
			</div>
		{/each}
	</div>
</main>
