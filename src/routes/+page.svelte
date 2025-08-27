<script lang="ts">
	import { marked } from 'marked';
	import { onMount } from 'svelte';

	let markdownInput = '';
	let shareableLink = '';
	let characterCount = 0;
	let showCopyNotification = false;
	const maxCharacters = 400;

	function generateLink() {
		if (markdownInput.trim()) {
			const encoded = btoa(unescape(encodeURIComponent(markdownInput)));
			shareableLink = `${window.location.origin}/view#${encoded}`;
		}
	}

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(shareableLink);
			showCopyNotification = true;
			setTimeout(() => {
				showCopyNotification = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy: ', err);
			// Fallback for older browsers
			const textArea = document.createElement('textarea');
			textArea.value = shareableLink;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand('copy');
			document.body.removeChild(textArea);
			showCopyNotification = true;
			setTimeout(() => {
				showCopyNotification = false;
			}, 2000);
		}
	}

	$: characterCount = markdownInput.length;
</script>

<svelte:head>
	<title>Reflect - Share Your Thoughts</title>
</svelte:head>

<main class="container">
	<div class="header">
		<h1>Reflect</h1>
		<p>Share your thoughts in markdown format</p>
	</div>

	<div class="input-section">
		<div class="input-header">
			<label for="markdown-input">Enter your markdown (max {maxCharacters} characters):</label>
			<span class="character-count {characterCount > maxCharacters ? 'exceeded' : characterCount > maxCharacters * 0.8 ? 'warning' : ''}">
				{characterCount}/{maxCharacters}
				{#if characterCount > 0}
					<span class="remaining">({maxCharacters - characterCount} remaining)</span>
				{/if}
			</span>
		</div>
		
		<textarea
			id="markdown-input"
			bind:value={markdownInput}
			placeholder="Write your markdown here...&#10;&#10;Example:&#10;# Hello World&#10;This is **bold** and *italic* text.&#10;- List item 1&#10;- List item 2"
			maxlength={maxCharacters}
			rows="8"
		></textarea>

		<button 
			on:click={generateLink} 
			disabled={!markdownInput.trim() || characterCount > maxCharacters}
			class="generate-btn"
		>
			Generate Link
		</button>
	</div>

	{#if shareableLink}
		<div class="link-section">
			<h3>Your shareable link:</h3>
			<div class="link-container">
				<input type="text" readonly value={shareableLink} class="link-input" />
				<button on:click={copyToClipboard} class="copy-btn">Copy</button>
			</div>
			<p class="link-info">Anyone with this link can view your rendered markdown</p>
		</div>
	{/if}

	{#if showCopyNotification}
		<div class="copy-notification">
			✅ Link copied to clipboard!
		</div>
	{/if}

	{#if markdownInput.trim()}
		<div class="preview-section">
			<h3>Preview:</h3>
			<div class="preview-content">{@html marked(markdownInput)}</div>
		</div>
	{/if}
</main>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	.header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.header h1 {
		font-size: 3rem;
		margin: 0;
		color: #2c3e50;
		font-weight: 700;
	}

	.header p {
		font-size: 1.2rem;
		color: #7f8c8d;
		margin: 0.5rem 0 0 0;
	}

	.input-section {
		margin-bottom: 2rem;
	}

	.input-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.input-header label {
		font-weight: 600;
		color: #2c3e50;
	}

	.character-count {
		font-size: 0.9rem;
		color: #7f8c8d;
	}

	.character-count.warning {
		color: #f39c12;
		font-weight: 600;
	}

	.character-count.exceeded {
		color: #e74c3c;
		font-weight: 600;
	}

	.remaining {
		font-size: 0.8rem;
		opacity: 0.8;
	}

	textarea {
		width: 100%;
		padding: 1rem;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 0.9rem;
		line-height: 1.5;
		resize: vertical;
		transition: border-color 0.2s ease;
	}

	textarea:focus {
		outline: none;
		border-color: #3498db;
	}

	.generate-btn {
		margin-top: 1rem;
		padding: 0.75rem 2rem;
		background: #3498db;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.generate-btn:hover:not(:disabled) {
		background: #2980b9;
	}

	.generate-btn:disabled {
		background: #bdc3c7;
		cursor: not-allowed;
	}

	.link-section {
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: #f8f9fa;
		border-radius: 8px;
		border-left: 4px solid #27ae60;
	}

	.link-section h3 {
		margin: 0 0 1rem 0;
		color: #2c3e50;
	}

	.link-container {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.link-input {
		flex: 1;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-family: monospace;
		font-size: 0.9rem;
		background: white;
	}

	.copy-btn {
		padding: 0.75rem 1rem;
		background: #27ae60;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 600;
		transition: background-color 0.2s ease;
	}

	.copy-btn:hover {
		background: #229954;
	}

	.link-info {
		margin: 0;
		font-size: 0.9rem;
		color: #7f8c8d;
	}

	.preview-section {
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		padding: 1.5rem;
		background: white;
	}

	.preview-section h3 {
		margin: 0 0 1rem 0;
		color: #2c3e50;
	}

	.preview-content {
		line-height: 1.6;
		color: #2c3e50;
	}

	.preview-content :global(h1) {
		font-size: 2rem;
		margin: 1.5rem 0 1rem 0;
		color: #2c3e50;
	}

	.preview-content :global(h2) {
		font-size: 1.5rem;
		margin: 1.25rem 0 0.75rem 0;
		color: #2c3e50;
	}

	.preview-content :global(h3) {
		font-size: 1.25rem;
		margin: 1rem 0 0.5rem 0;
		color: #2c3e50;
	}

	.preview-content :global(p) {
		margin: 0.75rem 0;
	}

	.preview-content :global(ul), .preview-content :global(ol) {
		margin: 0.75rem 0;
		padding-left: 1.5rem;
	}

	.preview-content :global(li) {
		margin: 0.25rem 0;
	}

	.preview-content :global(strong) {
		font-weight: 600;
	}

	.preview-content :global(em) {
		font-style: italic;
	}

	.preview-content :global(blockquote) {
		margin: 1rem 0;
		padding: 0.5rem 1rem;
		border-left: 4px solid #3498db;
		background: #f8f9fa;
		font-style: italic;
	}

	.preview-content :global(code) {
		background: #f1f2f6;
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 0.9rem;
	}

	.preview-content :global(pre) {
		background: #f1f2f6;
		padding: 1rem;
		border-radius: 6px;
		overflow-x: auto;
		margin: 1rem 0;
	}

	.preview-content :global(pre code) {
		background: none;
		padding: 0;
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
</style>
