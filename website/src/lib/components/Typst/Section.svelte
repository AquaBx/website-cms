<script lang="ts">
	let {
		title,
		items,
		selectedList = $bindable(),
		getLabel,
	}: {
		title: string;
		items: any[];
		selectedList: string[];
		getLabel: (item: any) => string;
	} = $props();

	const toggleItem = (id: string) => {
		const i = selectedList.indexOf(id);
		if (i !== -1) {
			delete selectedList[i];
		} else {
			selectedList.push(id);
		}
		selectedList = [...selectedList];
	};
</script>

{#if items.length > 0}
	<div class="flex flex-col gap-2">
		<h3 class="font-bold text-slate-800">{title}</h3>
		<div class="flex flex-wrap gap-2">
			{#each items as item}
				{@const isChecked = selectedList.includes(item.id)}
				<label
					class={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border cursor-pointer transition ${
						isChecked
							? "bg-slate-900 text-white border-slate-900"
							: "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
					}`}
				>
					<input
						type="checkbox"
						class="hidden"
						checked={isChecked}
						onchange={() => toggleItem(item.id)}
					/>
					{getLabel(item)}
				</label>
			{/each}
		</div>
	</div>
{/if}
