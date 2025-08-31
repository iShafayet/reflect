<script lang="ts">
	import { onMount } from 'svelte';
	import { parseMarkdown, decodeMarkdownFromHash } from '$lib/markdown';
	import MarkdownRenderer from '$lib/MarkdownRenderer.svelte';
	import TermsAndConditionsPopup from '$lib/TermsAndConditionsPopup.svelte';
	import { localStorageKey } from '$lib/crypto-utils';
	import { prefillContentOnce } from '$lib/stores';

	let markdownContent = '';
	let decodedContent = '';
	let error = '';
	let parsedTokens: any[] = [];
	let showTOCPopup = false;
	let currentLinkHash = '';
	let showCopyNotification = false;

	onMount(async () => {
		// Get the hash from the URL - with hash routing, it will be like #/view/encodedContent
		const hash = window.location.hash.substring(1); // Remove the #

		// Extract the encoded content from the hash
		// Hash format: /view/encodedContent
		const parts = hash.split('/');
		if (parts.length < 3 || parts[1] !== 'view') {
			error = 'Invalid URL format. Expected: /#/view/encodedContent';
			return;
		}

		const encodedContent = parts[2];
		if (!encodedContent) {
			error = 'No markdown content found in the URL.';
			return;
		}

		try {
			// Decode the base64 content using the utility function
			decodedContent = decodeMarkdownFromHash(encodedContent);
			markdownContent = decodedContent;
			// Parse markdown to tokens
			parsedTokens = parseMarkdown(markdownContent);

			// Generate link hash for localStorage tracking
			currentLinkHash = await localStorageKey(encodedContent);

			// Check if TOC should be shown for this link
			const tocHidden = localStorage.getItem(`toc_hidden_${currentLinkHash}`);
			if (!tocHidden) {
				showTOCPopup = true;
			}
		} catch (e) {
			error = 'Failed to decode the markdown content. The link may be invalid.';
			console.error('Decoding error:', e);
		}
	});

	function createNew() {
		window.location.href = '/';
	}

	function copyToClipboard() {
		navigator.clipboard.writeText(decodedContent).then(() => {
			showCopyNotification = true;
			setTimeout(() => {
				showCopyNotification = false;
			}, 2000);
		}).catch(err => {
			console.error('Failed to copy content:', err);
		});
	}

	function forkContent() {
		// Set the content in the store for the creation page to use
		prefillContentOnce.set(decodedContent);
		// Redirect to creation page
		window.location.href = '/';
	}
</script>

<svelte:head>
	<title>Reflect - Shared Content</title>
</svelte:head>

<main class="container">
	{#if error}
		<div class="error-section">
			<div class="logo-container">
				<img src="/logo.png" alt="Reflect Logo" class="logo" />
				<h1>Reflect</h1>
			</div>
			<div class="error-icon">⚠️</div>
			<h2>Error</h2>
			<p>{error}</p>
			<div class="error-actions">
				<button
					on:click={() => {
						currentLinkHash = 'error';
						showTOCPopup = true;
					}}
					class="btn btn-secondary">TOC</button
				>
				<button on:click={createNew} class="btn btn-primary">Create New</button>
			</div>
		</div>
	{:else if markdownContent}
		<div class="content-section">
			<div class="content-header">
				<div class="logo-container">
					<img src="/logo.png" alt="Reflect Logo" class="logo" />
					<h1>Reflect</h1>
				</div>
				<div class="actions desktop-actions">
					<button
						on:click={() => {
							showTOCPopup = true;
						}}
						class="btn btn-secondary">TOC</button
					>
					<button on:click={createNew} class="btn btn-primary">Create New</button>
				</div>
			</div>

			<div class="markdown-content">
				<MarkdownRenderer tokens={parsedTokens} />
			</div>

			<div class="mobile-actions">
				<button
					on:click={() => {
						showTOCPopup = true;
					}}
					class="btn btn-secondary">TOC</button
				>
				<button on:click={createNew} class="btn btn-primary">Create New</button>
			</div>

			<div class="raw-section">
				<details>
					<summary>View Raw Markdown</summary>
					<div class="raw-content-container">
						<div class="raw-actions">
							<button on:click={copyToClipboard} class="btn btn-secondary btn-small">
								📋 Copy to Clipboard
							</button>
							<button on:click={forkContent} class="btn btn-primary btn-small">
								🔀 Fork
							</button>
						</div>
						<pre class="raw-content">{decodedContent}</pre>
					</div>
				</details>
			</div>
		</div>
	{:else}
		<div class="loading-section">
			<div class="loading-spinner"></div>
			<p>Loading content...</p>
		</div>
	{/if}

	{#if showTOCPopup && currentLinkHash}
		<TermsAndConditionsPopup linkHash={currentLinkHash} on:close={() => (showTOCPopup = false)} />
	{/if}

	{#if showCopyNotification}
		<div class="copy-notification">
			✅ Content copied to clipboard!
		</div>
	{/if}
</main>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.logo-container {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.logo {
		width: 48px;
		height: 48px;
		object-fit: contain;
	}

	.logo-container h1 {
		font-size: 2rem;
		margin: 0;
		color: #2c3e50;
		font-weight: 700;
	}

	.error-section {
		text-align: center;
		padding: 3rem 2rem;
		background: #fff5f5;
		border: 1px solid #fed7d7;
		border-radius: 8px;
	}

	.error-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	.error-section h2 {
		color: #c53030;
		margin: 0 0 1rem 0;
	}

	.error-section p {
		color: #742a2a;
		margin: 0 0 2rem 0;
		font-size: 1.1rem;
	}

	.error-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}

	.content-section {
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		overflow: hidden;
	}

	.content-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid #e0e0e0;
		background: #f8f9fa;
	}

	.actions {
		display: flex;
		gap: 0.75rem;
	}

	.desktop-actions {
		display: flex;
		gap: 0.75rem;
	}

	.mobile-actions {
		display: none; /* Hide on desktop */
		flex-direction: column;
		gap: 0.75rem;
		padding: 1.5rem;
		border-top: 1px solid #e0e0e0;
		background: #f8f9fa;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 6px;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		text-decoration: none;
		display: inline-block;
	}

	.btn-primary {
		background: #3498db;
		color: white;
	}

	.btn-primary:hover {
		background: #2980b9;
	}

	.btn-secondary {
		background: #95a5a6;
		color: white;
	}

	.btn-secondary:hover {
		background: #7f8c8d;
	}

	.btn-small:hover {
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.copy-notification {
		position: fixed;
		top: 20px;
		right: 20px;
		background: #27ae60;
		color: white;
		padding: 1rem 1.5rem;
		border-radius: 6px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		animation: slideIn 0.3s ease-out;
		z-index: 1000;
	}

	@keyframes slideIn {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	.markdown-content {
		padding: 2rem;
		line-height: 1.6;
		color: #2c3e50;
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

	.markdown-content :global(p) {
		margin: 1rem 0;
	}

	.markdown-content :global(ul),
	.markdown-content :global(ol) {
		margin: 1rem 0;
		padding-left: 2rem;
	}

	.markdown-content :global(li) {
		margin: 0.5rem 0;
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

	.markdown-content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1.5rem 0;
	}

	.markdown-content :global(th),
	.markdown-content :global(td) {
		border: 1px solid #ddd;
		padding: 0.75rem;
		text-align: left;
	}

	.markdown-content :global(th) {
		background: #f8f9fa;
		font-weight: 600;
	}

	.raw-section {
		padding: 1.5rem;
		border-top: 1px solid #e0e0e0;
		background: #f8f9fa;
	}

	.raw-content-container {
		margin-top: 1rem;
	}

	.raw-actions {
		display: flex;
		gap: 0.75rem;
		margin-bottom: 1rem;
		justify-content: flex-start;
	}

	.btn-small {
		padding: 0.5rem 1rem;
		font-size: 0.85rem;
	}

	.raw-section summary {
		cursor: pointer;
		font-weight: 600;
		color: #2c3e50;
		margin-bottom: 1rem;
	}

	.raw-section summary:hover {
		color: #3498db;
	}

	.raw-content {
		background: #2c3e50;
		color: #ecf0f1;
		padding: 1rem;
		border-radius: 6px;
		overflow-x: auto;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 0.85rem;
		line-height: 1.4;
		margin: 0;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.loading-section {
		text-align: center;
		padding: 3rem 2rem;
	}

	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #3498db;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 1rem;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.loading-section p {
		color: #7f8c8d;
		font-size: 1.1rem;
		margin: 0;
	}

	@media (max-width: 768px) {
		.container {
			padding: 1rem;
			min-height: 100vh;
		}

		.content-header {
			flex-direction: column;
			gap: 1rem;
			align-items: stretch;
		}

		.logo-container {
			justify-content: center;
		}

		.logo-container h1 {
			font-size: 2.5rem;
		}

		.actions {
			justify-content: center;
		}

		.error-actions {
			flex-direction: column;
			align-items: center;
		}

		.mobile-actions {
			display: flex; /* Show on mobile */
		}

		.desktop-actions {
			display: none; /* Hide on mobile */
		}
	}

	/* Mobile-first responsive design for small phones */
	@media (max-width: 480px) {
		.container {
			padding: 0.75rem;
			margin: 0;
			max-width: 100%;
			min-height: 100vh;
		}

		.logo {
			width: 40px;
			height: 40px;
		}

		.logo-container h1 {
			font-size: 1.75rem;
		}

		.content-header {
			padding: 1rem;
			flex-direction: column;
			gap: 1rem;
			align-items: stretch;
		}

		.actions {
			flex-direction: column;
			gap: 0.75rem;
		}

		.btn {
			width: 100%;
			padding: 1rem;
			font-size: 1rem;
		}

		.markdown-content {
			padding: 1rem;
		}

		.markdown-content :global(h1) {
			font-size: 2rem;
			margin: 1.5rem 0 1rem 0;
		}

		.markdown-content :global(h2) {
			font-size: 1.75rem;
			margin: 1.25rem 0 0.75rem 0;
		}

		.markdown-content :global(h3) {
			font-size: 1.5rem;
			margin: 1rem 0 0.5rem 0;
		}

		.markdown-content :global(h4) {
			font-size: 1.25rem;
			margin: 1rem 0 0.5rem 0;
		}

		.markdown-content :global(ul),
		.markdown-content :global(ol) {
			padding-left: 1.5rem;
		}

		.markdown-content :global(blockquote) {
			padding: 0.75rem 1rem;
			margin: 1rem 0;
		}

		.markdown-content :global(pre) {
			padding: 1rem;
			margin: 1rem 0;
			font-size: 0.8rem;
		}

		.raw-section {
			padding: 1rem;
		}

		.raw-actions {
			flex-direction: column;
			gap: 0.5rem;
		}

		.btn-small {
			width: 100%;
			padding: 0.75rem;
		}

		.raw-content {
			padding: 0.75rem;
			font-size: 0.75rem;
			line-height: 1.3;
		}

		.error-section {
			padding: 2rem 1rem;
		}

		.error-icon {
			font-size: 3rem;
		}

		.error-section h2 {
			font-size: 1.5rem;
		}

		.error-section p {
			font-size: 1rem;
		}

		.error-actions {
			flex-direction: column;
			gap: 0.75rem;
		}

		.loading-section {
			padding: 2rem 1rem;
		}

		.loading-spinner {
			width: 32px;
			height: 32px;
		}
	}

	@media (max-width: 768px) and (min-width: 481px) {
		.container {
			padding: 1.5rem;
			min-height: 100vh;
		}

		.content-header {
			flex-direction: column;
			gap: 1rem;
			align-items: stretch;
		}

		.logo-container {
			justify-content: center;
		}

		.logo-container h1 {
			font-size: 2.25rem;
		}

		.actions {
			flex-direction: column;
			gap: 0.75rem;
		}

		.btn {
			width: 100%;
		}

		.raw-actions {
			flex-direction: column;
			gap: 0.5rem;
		}

		.btn-small {
			width: 100%;
			padding: 0.75rem;
		}
	}
</style>
