<script lang="ts">
	let { date }: { date: string } = $props();
	let date2 = $derived(new Date(date));
</script>

<time dateTime={date2.toISOString()}>
	{date2.toLocaleDateString("fr-FR", { year: "numeric", month: "2-digit" })}
</time>
