<script lang="ts">
	import template from "./template.typ?raw";
	import fontAwesomeLib from "./fontawesome/lib.typ?raw";
	import fontAwesomeLibImpl from "./fontawesome/lib-impl.typ?raw";
	import fontAwesomeLibMap from "./fontawesome/lib-gen-map.typ?raw";
	import fontAwesomeLibFunc from "./fontawesome/lib-gen-func.typ?raw";

	import siconslib from "./sicons/src/lib.typ?raw";
	import siconswasm from "./sicons/sicons.wasm?raw";

	import { TypstManager } from "./cv";
	import { onMount } from "svelte";

	const {
		main,
		avatar,
		avatar_name,
	}: { main: string; avatar_name: string; avatar: Uint8Array<ArrayBuffer> } =
		$props();

	let typst: TypstManager | undefined = $state();

	onMount(() => {
		typst = new TypstManager();
		const inputs = {
			"@preview/fontawesome:0.6.2": fontAwesomeLib,
			"lib-impl.typ": fontAwesomeLibImpl,
			"lib-gen-map.typ": fontAwesomeLibMap,
			"lib-gen-func.typ": fontAwesomeLibFunc,
			"/template.typ": template,

			"@preview/sicons:16.0.0": siconslib,
			"/sicons.wasm": siconswasm,
		};
		const binaryInputs: { [key: string]: Uint8Array } = {};

		binaryInputs[`/${avatar_name}`] = avatar;

		for (const [path, content] of Object.entries(inputs)) {
			typst.addSource(path, content);
		}

		for (const [path, content] of Object.entries(binaryInputs)) {
			typst.addBinarySource(path, content);
		}
	});

	let pdfPromise = $state<Promise<Uint8Array<ArrayBufferLike> | undefined>>();

	$effect(() => {
		if (typst) {
			typst.addSource("/main.typ", main);
			pdfPromise = typst.pdf();
		}
	});
</script>

<div class="flex-1 flex flex-col relative h-full w-full min-h-150">
	{#if pdfPromise}
		{#await pdfPromise}
			<div
				class="absolute inset-0 flex items-center justify-center bg-slate-50 bg-opacity-50 z-10 rounded-xl transition-all duration-300"
			>
				<div class="flex flex-col items-center gap-3">
					<div
						class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"
					></div>
					<span class="text-sm font-medium text-slate-600"
						>Compilation Typst en cours...</span
					>
				</div>
			</div>
		{:then compiled}
			{#if compiled}
				{@const blob = new Blob([compiled.buffer as ArrayBuffer], {
					type: "application/pdf",
				})}
				<iframe
					class="flex-1 w-full h-full border border-slate-200 rounded-xl shadow-lg"
					src={URL.createObjectURL(blob)}
					title="Typst CV Preview"
				></iframe>
			{:else}
				<div
					class="flex-1 flex items-center justify-center text-slate-400 bg-slate-100 rounded-xl border border-dashed border-slate-300"
				>
					Génération en cours...
				</div>
			{/if}
		{/await}
	{/if}
</div>
