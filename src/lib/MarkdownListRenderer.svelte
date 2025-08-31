<script lang="ts">
	import type { MarkdownToken } from './markdown';
	import MarkdownListItemRenderer from './MarkdownListItemRenderer.svelte';

	export let ordered: boolean;
	export let items: any[];
</script>

{#if ordered}
	<ol>
		{#each items || [] as item}
			<MarkdownListItemRenderer tokens={item.tokens || []} />
		{/each}
	</ol>
{:else}
	<ul>
		{#each items || [] as item}
			<MarkdownListItemRenderer tokens={item.tokens || []} />
		{/each}
	</ul>
{/if}
