<script lang="ts">
	import {
		getLocale,
		locales,
		setLocale,
		type Locale,
	} from "$lib/paraglide/runtime";

	import * as emoji from "node-emoji";

	const handleChange = (el) => {
		if (!el.target.checked) {
			return;
		}
		const locale = el.target.name as Locale;
		if (locales.includes(locale)) {
			setLocale(locale);
		}
	};
</script>

<div
	class="rounded-full bg-white/20 border-white/30 backdrop-blur-xl flex justify-between items-center fixed top-4 right-4 p-1 border shadow-sm transition-all z-50"
>
	{#each locales as el, i}
		<div>
			<input
				class="hidden"
				type="radio"
				id={"lang-" + el}
				name={el}
				checked={el == getLocale()}
				onchange={handleChange}
				radioGroup="lang"
			/>
			<label
				for={"lang-" + el}
				class="select-none cursor-pointer aspect-square h-8 grid place-items-center"
				>{emoji.get(el === "en" ? "uk" : el)}</label
			>
		</div>
	{/each}

	<span
		class="transition-all -z-1 block aspect-square h-8 left-1 top-1 rounded-full bg-sky-500/20 absolute"
		style="transform: translateX({locales.indexOf(getLocale()) * 2}rem)"
	></span>
</div>

<!-- // return <label
//     class="flex justify-between items-center cursor-pointer fixed top-4 right-4 p-1 h-10 w-20 bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm rounded-full transition-all hover:shadow-md z-50 print:hidden"
// >
//     <input
//         type="checkbox"
//         value=""
//         class="sr-only peer hidden"
//         checked={getLocale() == "en"}
//         onChange={handleChange}
//     />
//     <span
//         class="size-8 grid place-items-center transition-all text-sm z-10 {lang ===
// 	'fr'
// 		? 'opacity-100'
// 		: 'opacity-40'}">🇫🇷</span
//     >
//     <span
//         class="size-8 grid place-items-center transition-all text-sm z-10 {lang ===
// 	'en'
// 		? 'opacity-100'
// 		: 'opacity-40'}">🇬🇧</span
//     >
//     <span
//         class="size-8 grid place-items-center transition-all rounded-full bg-slate-100 absolute left-1 peer-checked:left-11"
//     ></span>
// </label> -->
