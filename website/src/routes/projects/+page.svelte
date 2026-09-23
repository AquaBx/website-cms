<script lang="ts">
	import ProjectCard from "$lib/components/Cards/ProjectCard.svelte";
	import { m } from "$lib/paraglide/messages";

  let {data:projects} = $props()

</script>

<main
	class="min-h-dvh w-dvw flex items-center flex-col text-slate-900 px-4 py-12"
>
	<div
		class="flex flex-col items-center gap-2 text-center pt-8 pb-16 print:hidden"
	>
		<h1
			class="text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
		>
			{m.projects()}
		</h1>
		<div class="h-1 w-12 bg-slate-900 rounded-full mt-2"></div>
	</div>
	<div
		class="mx-auto grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] max-w-4xl w-full gap-4"
	>
		{#each projects.docs as el}
      <ProjectCard {el}></ProjectCard>
    {/each}
	</div>
</main>
