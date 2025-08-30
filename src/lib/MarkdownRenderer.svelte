<script lang="ts">
	import type { MarkdownToken } from './markdown';

	export let tokens: MarkdownToken[];
</script>

<div class="markdown-content">
	{#each tokens as token}
		{#if token.type === 'heading'}
			{#if token.depth === 1}
				<h1>{token.text}</h1>
			{:else if token.depth === 2}
				<h2>{token.text}</h2>
			{:else if token.depth === 3}
				<h3>{token.text}</h3>
			{:else if token.depth === 4}
				<h4>{token.text}</h4>
			{:else if token.depth === 5}
				<h5>{token.text}</h5>
			{:else if token.depth === 6}
				<h6>{token.text}</h6>
			{/if}
		{:else if token.type === 'paragraph'}
			<p>{token.text}</p>
		{:else if token.type === 'text'}
			{token.text}
		{:else if token.type === 'strong'}
			<strong>{token.text}</strong>
		{:else if token.type === 'em'}
			<em>{token.text}</em>
		{:else if token.type === 'code'}
			<pre><code>{token.text}</code></pre>
		{:else if token.type === 'codespan'}
			<code>{token.text}</code>
		{:else if token.type === 'list'}
			{#if token.ordered}
				<ol>
					{#each token.items || [] as item}
						<li>
							{#each item.tokens || [] as subToken}
								{#if subToken.type === 'text'}
									{subToken.text}
								{:else if subToken.type === 'strong'}
									<strong>{subToken.text}</strong>
								{:else if subToken.type === 'em'}
									<em>{subToken.text}</em>
								{:else if subToken.type === 'codespan'}
									<code>{subToken.text}</code>
								{/if}
							{/each}
						</li>
					{/each}
				</ol>
			{:else}
				<ul>
					{#each token.items || [] as item}
						<li>
							{#each item.tokens || [] as subToken}
								{#if subToken.type === 'text'}
									{subToken.text}
								{:else if subToken.type === 'strong'}
									<strong>{subToken.text}</strong>
								{:else if subToken.type === 'em'}
									<em>{subToken.text}</em>
								{:else if subToken.type === 'codespan'}
									<code>{subToken.text}</code>
								{/if}
							{/each}
						</li>
					{/each}
				</ul>
			{/if}
		{:else if token.type === 'list_item'}
			<li>
				{#each token.tokens || [] as subToken}
					{#if subToken.type === 'text'}
						{subToken.text}
					{:else if subToken.type === 'strong'}
						<strong>{subToken.text}</strong>
					{:else if subToken.type === 'em'}
						<em>{subToken.text}</em>
					{:else if subToken.type === 'codespan'}
						<code>{subToken.text}</code>
					{/if}
				{/each}
			</li>
		{:else if token.type === 'blockquote'}
			<blockquote>
				{#each token.tokens || [] as subToken}
					{#if subToken.type === 'paragraph'}
						<p>{subToken.text}</p>
					{:else if subToken.type === 'text'}
						{subToken.text}
					{:else if subToken.type === 'strong'}
						<strong>{subToken.text}</strong>
					{:else if subToken.type === 'em'}
						<em>{subToken.text}</em>
					{:else if subToken.type === 'codespan'}
						<code>{subToken.text}</code>
					{/if}
				{/each}
			</blockquote>
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
</style>
