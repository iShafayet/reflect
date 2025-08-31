<script lang="ts">
	import type { MarkdownToken } from './markdown';
	import MarkdownNestedTokenRenderer from './MarkdownNestedTokenRenderer.svelte';
	import { renderNestedTokens } from './MarkdownUtils';

	export let depth: number;
	export let tokens: MarkdownToken[];

	$: headingTag = `h${depth}`;
	$: processedTokens = renderNestedTokens(tokens || []);
</script>

<svelte:element this={headingTag}>
	<MarkdownNestedTokenRenderer tokens={processedTokens} />
</svelte:element>
