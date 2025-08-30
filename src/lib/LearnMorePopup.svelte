<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	
	const dispatch = createEventDispatcher();
	let popupElement: HTMLDivElement;
	
	onMount(() => {
		// Focus the popup when it opens for keyboard navigation
		if (popupElement) {
			popupElement.focus();
		}
	});
	
	function closePopup() {
		dispatch('close');
	}
	
	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closePopup();
		}
	}
	
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closePopup();
		}
	}
</script>

<div 
	class="popup-backdrop" 
	on:click={handleBackdropClick}
	on:keydown={handleKeydown}
	role="dialog"
	aria-modal="true"
	aria-labelledby="popup-title"
	tabindex="-1"
	bind:this={popupElement}
>
	<div class="popup-content">
		<div class="popup-header">
			<h2 id="popup-title">How Reflect Works</h2>
			<button 
				class="close-btn" 
				on:click={closePopup}
				aria-label="Close popup"
				type="button"
			>&times;</button>
		</div>
		
		<div class="popup-body">
			<div class="section">
				<h3>📝 Write Your Thoughts</h3>
				<p>Use the text area to write your content in markdown format. Markdown is a simple way to format text with:</p>
				<ul>
					<li><strong>Headers:</strong> Use # for main headings, ## for subheadings</li>
					<li><strong>Bold text:</strong> Wrap with ** or __</li>
					<li><strong>Italic text:</strong> Wrap with * or _</li>
					<li><strong>Lists:</strong> Use - or * for bullet points</li>
					<li><strong>Code:</strong> Use ` for inline code or ``` for code blocks</li>
					<li><strong>Links:</strong> [text](url)</li>
				</ul>
			</div>
			
			<div class="section">
				<h3>🔗 Generate Shareable Link</h3>
				<p>Once you've written your content, click "Generate Link" to create a unique, shareable URL. Your markdown is:</p>
				<ol>
					<li><strong>Encoded:</strong> Converted to a safe format for URLs</li>
					<li><strong>Stored:</strong> Embedded directly in the link (no database needed!)</li>
					<li><strong>Shareable:</strong> Anyone with the link can view your rendered content</li>
				</ol>
			</div>
			
			<div class="section">
				<h3>👀 Preview & Share</h3>
				<p>See a live preview of how your markdown will look when shared. The generated link:</p>
				<ul>
					<li>Works instantly - no waiting for processing</li>
					<li>Is completely private - only those with the link can see it</li>
					<li>Renders beautifully on any device</li>
					<li>Supports all standard markdown features</li>
				</ul>
			</div>
			
			<div class="section">
				<h3>💡 Perfect For</h3>
				<p>Reflect is ideal for sharing:</p>
				<ul>
					<li>Quick thoughts and ideas</li>
					<li>Documentation snippets</li>
					<li>Meeting notes</li>
					<li>Code explanations</li>
					<li>Personal reflections</li>
					<li>Any text you want to format and share</li>
				</ul>
			</div>
			
			<div class="section">
				<h3>🔒 Privacy & Security</h3>
				<p>Your content is never stored on our servers. Everything is:</p>
				<ul>
					<li><strong>Client-side:</strong> Processed entirely in your browser</li>
					<li><strong>Link-based:</strong> Content lives only in the URL you share</li>
					<li><strong>No tracking:</strong> We don't collect or store your data</li>
					<li><strong>Instant:</strong> No accounts or setup required</li>
				</ul>
			</div>
		</div>
		
		<div class="popup-footer">
			<button 
				class="got-it-btn" 
				on:click={closePopup}
				type="button"
			>Got it!</button>
		</div>
	</div>
</div>

<style>
	.popup-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2000;
		animation: fadeIn 0.2s ease-out;
	}
	
	.popup-content {
		background: white;
		border-radius: 12px;
		max-width: 600px;
		max-height: 90vh;
		overflow-y: auto;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		animation: slideUp 0.3s ease-out;
	}
	
	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem 2rem 1rem 2rem;
		border-bottom: 1px solid #e0e0e0;
	}
	
	.popup-header h2 {
		margin: 0;
		color: #2c3e50;
		font-size: 1.5rem;
		font-weight: 600;
	}
	
	.close-btn {
		background: none;
		border: none;
		font-size: 2rem;
		color: #7f8c8d;
		cursor: pointer;
		padding: 0;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: all 0.2s ease;
	}
	
	.close-btn:hover {
		background: #f8f9fa;
		color: #2c3e50;
	}
	
	.popup-body {
		padding: 1.5rem 2rem;
	}
	
	.section {
		margin-bottom: 2rem;
	}
	
	.section:last-child {
		margin-bottom: 0;
	}
	
	.section h3 {
		margin: 0 0 0.75rem 0;
		color: #2c3e50;
		font-size: 1.1rem;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	
	.section p {
		margin: 0 0 0.75rem 0;
		color: #34495e;
		line-height: 1.6;
	}
	
	.section ul, .section ol {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
		color: #34495e;
	}
	
	.section li {
		margin: 0.25rem 0;
		line-height: 1.5;
	}
	
	.popup-footer {
		padding: 1rem 2rem 1.5rem 2rem;
		border-top: 1px solid #e0e0e0;
		text-align: center;
	}
	
	.got-it-btn {
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
	
	.got-it-btn:hover {
		background: #2980b9;
	}
	
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	
	@keyframes slideUp {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
	
	@media (max-width: 768px) {
		.popup-content {
			margin: 1rem;
			max-height: calc(100vh - 2rem);
		}
		
		.popup-header,
		.popup-body,
		.popup-footer {
			padding-left: 1.5rem;
			padding-right: 1.5rem;
		}
	}
</style>
