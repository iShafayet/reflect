<script lang="ts">
	import type { MarkdownToken } from './markdown';
	import MarkdownHeadingRenderer from './MarkdownHeadingRenderer.svelte';
	import MarkdownParagraphRenderer from './MarkdownParagraphRenderer.svelte';
	import MarkdownInlineRenderer from './MarkdownInlineRenderer.svelte';
	import MarkdownListRenderer from './MarkdownListRenderer.svelte';
	import MarkdownBlockquoteRenderer from './MarkdownBlockquoteRenderer.svelte';

	export let tokens: MarkdownToken[];
</script>

<div class="markdown-content">
	{#each tokens as token}
		{#if token.type === 'heading'}
			<MarkdownHeadingRenderer depth={token.depth || 1} tokens={token.tokens || []} />
		{:else if token.type === 'paragraph'}
			<MarkdownParagraphRenderer tokens={token.tokens || []} />
		{:else if token.type === 'text'}
			{token.text}
		{:else if token.type === 'strong'}
			<strong>
				<MarkdownInlineRenderer tokens={token.tokens || []} />
			</strong>
		{:else if token.type === 'em'}
			<em>
				<MarkdownInlineRenderer tokens={token.tokens || []} />
			</em>
		{:else if token.type === 'code'}
			<pre><code>{token.text}</code></pre>
		{:else if token.type === 'codespan'}
			<code>{token.text}</code>
		{:else if token.type === 'list'}
			<MarkdownListRenderer ordered={token.ordered || false} items={token.items || []} />
		{:else if token.type === 'list_item'}
			<li>
				<MarkdownInlineRenderer tokens={token.tokens || []} />
			</li>
		{:else if token.type === 'blockquote'}
			<MarkdownBlockquoteRenderer tokens={token.tokens || []} />
		{:else if token.type === 'hr'}
			<hr>
		{:else if token.type === 'space'}
			{' '}
		{:else if token.type === 'br'}
			<br>
		{/if}
	{/each}
</div>

<style>
	.markdown-content {
		line-height: 1.6;
		color: #2c3e50;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		word-wrap: break-word;
		overflow-wrap: break-word;
		hyphens: auto;
	}

	.markdown-content :global(h1) {
		font-size: 2.5rem;
		margin: 2rem 0 1.5rem 0;
		color: #2c3e50;
		border-bottom: 2px solid #ecf0f1;
		padding-bottom: 0.5rem;
	}

	.markdown-content :global(h2) {
		font-size: 2rem;
		margin: 1.75rem 0 1.25rem 0;
		color: #2c3e50;
	}

	.markdown-content :global(h3) {
		font-size: 1.5rem;
		margin: 1.5rem 0 1rem 0;
		color: #2c3e50;
	}

	.markdown-content :global(h4) {
		font-size: 1.25rem;
		margin: 1.25rem 0 0.75rem 0;
		color: #2c3e50;
	}

	.markdown-content :global(h5) {
		font-size: 1.1rem;
		margin: 1rem 0 0.75rem 0;
		color: #2c3e50;
	}

	.markdown-content :global(h6) {
		font-size: 1rem;
		margin: 1rem 0 0.75rem 0;
		color: #2c3e50;
	}

	.markdown-content :global(p) {
		margin: 1rem 0;
		word-wrap: break-word;
		overflow-wrap: break-word;
		white-space: pre-wrap;
	}

	.markdown-content :global(ul),
	.markdown-content :global(ol) {
		margin: 1rem 0;
		padding-left: 2rem;
	}

	.markdown-content :global(li) {
		margin: 0.5rem 0;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	.markdown-content :global(strong) {
		font-weight: 600;
		color: #1a252f;
	}

	.markdown-content :global(em) {
		font-style: italic;
	}

	.markdown-content :global(blockquote) {
		margin: 1.5rem 0;
		padding: 1rem 1.5rem;
		border-left: 4px solid #3498db;
		background: #f8f9fa;
		font-style: italic;
		color: #5a6c7d;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	.markdown-content :global(blockquote p) {
		margin: 0.5rem 0;
	}

	.markdown-content :global(code) {
		background: #f1f2f6;
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 0.9rem;
		color: #e74c3c;
	}

	.markdown-content :global(pre) {
		background: #2c3e50;
		color: #ecf0f1;
		padding: 1.5rem;
		border-radius: 6px;
		overflow-x: auto;
		margin: 1.5rem 0;
	}

	.markdown-content :global(pre code) {
		background: none;
		padding: 0;
		color: inherit;
	}

	.markdown-content :global(hr) {
		border: none;
		border-top: 2px solid #ecf0f1;
		margin: 2rem 0;
	}

	/* Mobile-first responsive design for small phones */
	@media (max-width: 480px) {
		.markdown-content {
			font-size: 0.9rem;
			line-height: 1.5;
		}

		.markdown-content :global(h1) {
			font-size: 1.75rem;
			margin: 1.25rem 0 1rem 0;
			padding-bottom: 0.25rem;
		}

		.markdown-content :global(h2) {
			font-size: 1.5rem;
			margin: 1.25rem 0 0.75rem 0;
		}

		.markdown-content :global(h3) {
			font-size: 1.25rem;
			margin: 1rem 0 0.5rem 0;
		}

		.markdown-content :global(h4) {
			font-size: 1.1rem;
			margin: 0.75rem 0 0.5rem 0;
		}

		.markdown-content :global(h5) {
			font-size: 1rem;
			margin: 0.75rem 0 0.5rem 0;
		}

		.markdown-content :global(h6) {
			font-size: 0.95rem;
			margin: 0.75rem 0 0.5rem 0;
		}

		.markdown-content :global(p) {
			margin: 0.75rem 0;
			line-height: 1.5;
		}

		.markdown-content :global(ul),
		.markdown-content :global(ol) {
			margin: 0.75rem 0;
			padding-left: 1.5rem;
		}

		.markdown-content :global(li) {
			margin: 0.25rem 0;
			line-height: 1.4;
		}

		.markdown-content :global(blockquote) {
			margin: 1rem 0;
			padding: 0.75rem 1rem;
			border-left-width: 3px;
		}

		.markdown-content :global(blockquote p) {
			margin: 0.25rem 0;
			font-size: 0.85rem;
		}

		.markdown-content :global(code) {
			padding: 0.15rem 0.3rem;
			font-size: 0.8rem;
		}

		.markdown-content :global(pre) {
			padding: 0.75rem;
			margin: 0.75rem 0;
			font-size: 0.75rem;
			line-height: 1.3;
		}

		.markdown-content :global(hr) {
			margin: 1.5rem 0;
		}
	}

	@media (max-width: 768px) and (min-width: 481px) {
		.markdown-content :global(h1) {
			font-size: 2rem;
		}

		.markdown-content :global(h2) {
			font-size: 1.75rem;
		}

		.markdown-content :global(h3) {
			font-size: 1.4rem;
		}

		.markdown-content :global(pre) {
			font-size: 0.8rem;
		}
	}
</style>
