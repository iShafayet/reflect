<script lang="ts">
	import type { MarkdownToken } from './markdown';
	import MarkdownNestedTokenRenderer from './MarkdownNestedTokenRenderer.svelte';
	import MarkdownParagraphRenderer from './MarkdownParagraphRenderer.svelte';
	import { renderNestedTokens } from './MarkdownUtils';

	export let tokens: MarkdownToken[];
</script>

<blockquote>
	{#each tokens || [] as subToken}
		{#if subToken.type === 'paragraph'}
			<MarkdownParagraphRenderer tokens={subToken.tokens || []} />
		{:else if subToken.type === 'text'}
			{subToken.text}
		{:else if subToken.type === 'strong'}
			<strong>
				<MarkdownNestedTokenRenderer tokens={renderNestedTokens(subToken.tokens || [])} />
			</strong>
		{:else if subToken.type === 'em'}
			<em>
				<MarkdownNestedTokenRenderer tokens={renderNestedTokens(subToken.tokens || [])} />
			</em>
		{:else if subToken.type === 'codespan'}
			<code>{subToken.text}</code>
		{/if}
	{/each}
</blockquote>
