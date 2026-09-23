<script lang="ts">
	import { page } from "$app/state";
	import { m } from "$lib/paraglide/messages";
	import {
		House,
		Briefcase,
		Image,
		Music,
		FileText,
		Flag,
		Newspaper,
	} from "@steeze-ui/lucide-icons";
	import { Icon } from "@steeze-ui/svelte-icon";

	const links = [
		{ href: "/", label: m.home, icon: House },
		{ href: "/timeline", label: m.timeline, icon: Flag },
		{ href: "/blog", label: m.blog, icon: Newspaper },
		{ href: "/projects", label: m.projects, icon: Briefcase },
		// { href: "/gallery", label: m.gallery, icon: Image },
		// { href: "/music", label: m.music, icon: Music },
		{ href: "/cv", label: m.cv, icon: FileText },
	];
</script>

<nav
	class="rounded-full bg-white/20 border-white/30 backdrop-blur-xl fixed bottom-6 left-1/2 -translate-x-1/2 p-2 border shadow-2xl z-50 flex gap-1"
>
	{#each links as link}
		{@const active = page.url.pathname === link.href}
		{@const class1 = active
			? "rounded-full bg-sky-500/40 border-sky-500/5O text-sky-900"
			: "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}
		<a
			href={link.href}
			class={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 group ${class1}`}
		>
			<Icon
				src={link.icon}
				class={`size-4 transition-transform group-hover:scale-110`}
			/>
			<span class="text-sm font-bold tracking-tight">
				{link.label()}
			</span>
		</a>
	{/each}
</nav>
