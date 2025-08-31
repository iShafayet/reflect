<script lang="ts">
	import type { MarkdownToken } from './markdown';
	import MarkdownNestedTokenRenderer from './MarkdownNestedTokenRenderer.svelte';
	import { renderNestedTokens } from './MarkdownUtils';

	export let tokens: MarkdownToken[];

	$: processedTokens = renderNestedTokens(tokens || []);
</script>

{#each processedTokens as item}
	{#if typeof item === 'string'}
		{item}
	{:else if item.type === 'strong'}
		<strong>
			<MarkdownNestedTokenRenderer tokens={item.content} />
		</strong>
	{:else if item.type === 'em'}
		<em>
			<MarkdownNestedTokenRenderer tokens={item.content} />
		</em>
	{:else if item.type === 'codespan'}
		<code>{item.content}</code>
	{/if}
{/each}
