<script lang="ts">
	import { m } from "$lib/paraglide/messages";
	import Section from "./Section.svelte";
	import Typst from "./Typst.svelte";
	import { CV } from "./cv";
	import type {
		Tag,
		GlobalSetting,
		Timeline,
		Project,
	} from "aquabx-config/payload-types";

	interface CVBuilderProps {
		locale: string;
		messages: {
			work: string;
			projects: string;
			studies: string;
			contests: string;
			volunteering: string;
		};
		globals: GlobalSetting;
		data: {
			projects: Project[];
			work: Timeline[];
			education: Timeline[];
			volunteering: Timeline[];
			competition: Timeline[];
		};
		avatar_name: string;
		avatar: Uint8Array<ArrayBuffer>;
	}

	const {
		locale,
		messages,
		avatar_name,
		globals,
		data,
		avatar,
	}: CVBuilderProps = $props();

	let resume = $state("");
	let selectedProjects: string[] = $state([]);
	let selectedWork: string[] = $state([]);
	let selectedEducation: string[] = $state([]);
	let selectedVolunteering: string[] = $state([]);
	let selectedCompetition: string[] = $state([]);

	// Construction dynamique du CV selon la sélection
	const mailObj = {
		icon: "envelope",
		name: globals.mail,
		link: `mailto:${globals.mail}`,
	};
	const phoneObj = {
		icon: "phone",
		name: globals.phone,
		link: `tel:${globals.phone}`,
	};
	const addressObj = {
		icon: "house",
		name: globals.address,
		link: `https://maps.apple.com/?q=:${globals.address}`,
	};

	let main = $derived.by(() => {
		const main = new CV();
		main.setHeader(
			globals.name,
			avatar_name,
			[mailObj, phoneObj, addressObj],
			globals.socials
				.filter((el) => el.cvShown)
				.map(({ cvShown, ...el }) => el),
		);
		if (resume !== "") {
			main.setDescription(m.summary(), resume);
		}
		const filteredWork = data.work.filter((item) =>
			selectedWork.includes(item.id),
		);
		const filteredProjects = data.projects.filter((item) =>
			selectedProjects.includes(item.id),
		);
		const filteredEducation = data.education.filter((item) =>
			selectedEducation.includes(item.id),
		);
		const filteredCompetition = data.competition.filter((item) =>
			selectedCompetition.includes(item.id),
		);
		const filteredVolunteering = data.volunteering.filter((item) =>
			selectedVolunteering.includes(item.id),
		);
		if (filteredWork.length > 0)
			main.addTimelineBlock(messages.work, filteredWork);
		if (filteredProjects.length > 0)
			main.addProject(messages.projects, filteredProjects);
		if (filteredEducation.length > 0)
			main.addTimelineBlock(messages.studies, filteredEducation);
		if (filteredCompetition.length > 0)
			main.addTimelineBlock(messages.contests, filteredCompetition);
		if (filteredVolunteering.length > 0)
			main.addTimelineBlock(messages.volunteering, filteredVolunteering);
		main.addLanguage("Français", "Native");
		main.addLanguage("Anglais", "C1");
		main.addLanguage("Espagnol", "B1");
		main.addLanguage("Polonais", "Basics");
		main.addCertification("Toeic", "965/990", 2024);
		main.addCertification("Sensibilisation aux ODD", "", 2023);
		main.addCertification("Baccalauréat", "Highest Honors", 2021);
		main.addCertification("Permis B", "", 2021);
		main.addCertification("PSC1", "", 2018);
		for (const { tags } of filteredProjects) {
			((tags as Tag[]) || []).forEach((tag: Tag) => {
				main.addTag(tag);
			});
		}
		console.log(main.content(locale))
		return main.content(locale);
	});
</script>

<div class="w-full max-w-4xl flex flex-col gap-8">
	<div
		class="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col gap-6 print:hidden"
	>
		<h2 class="text-xl font-bold">Sélectionner les éléments à inclure</h2>

		<input type="text" bind:value={resume} />
		<Section
			title={messages.work}
			items={data.work}
			bind:selectedList={selectedWork}
			getLabel={(i) => i.title || i.company}
		></Section>
		<Section
			title={messages.projects}
			items={data.projects}
			bind:selectedList={selectedProjects}
			getLabel={(i) => i.title}
		></Section>
		<Section
			title={messages.studies}
			items={data.education}
			bind:selectedList={selectedEducation}
			getLabel={(i) => i.title || i.school}
		></Section>
		<Section
			title={messages.contests}
			items={data.competition}
			bind:selectedList={selectedCompetition}
			getLabel={(i) => i.title}
		></Section>

		<Section
			title={messages.volunteering}
			items={data.volunteering}
			bind:selectedList={selectedVolunteering}
			getLabel={(i) => i.title}
		></Section>
	</div>

	<div
		class="mx-auto grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] w-full gap-4"
	>
		<Typst {avatar_name} {main} {avatar} />
	</div>
</div>
