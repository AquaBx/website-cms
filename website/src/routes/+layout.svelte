<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import LangSelector from "$lib/components/LangSelector.svelte";
	import Navbar from "$lib/components/Navbar.svelte";

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div
	class="fixed inset-0 -z-1 opacity-40
	bg-[linear-gradient(to_right,#e7e5e4_1px,transparent_1px),linear-gradient(to_bottom,#e7e5e4_1px,transparent_1px)]
		bg-size-[40px_40px]
		mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]
		[-webkit-mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]
		print:hidden"
></div>

<LangSelector></LangSelector>

<Navbar></Navbar>

{@render children()}
