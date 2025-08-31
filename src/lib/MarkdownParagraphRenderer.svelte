<script lang="ts">
	import type { MarkdownToken } from './markdown';
	import MarkdownNestedTokenRenderer from './MarkdownNestedTokenRenderer.svelte';
	import { renderNestedTokens } from './MarkdownUtils';

	export let tokens: MarkdownToken[];

	$: processedTokens = renderNestedTokens(tokens || []);
</script>

<p>
	<MarkdownNestedTokenRenderer tokens={processedTokens} />
</p>
