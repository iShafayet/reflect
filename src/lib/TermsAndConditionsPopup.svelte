<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	
	export let linkHash: string;
	
	const dispatch = createEventDispatcher();
	let popupElement: HTMLDivElement;
	let dontShowAgain = false;
	
	onMount(() => {
		// Check if user previously selected "do not show again" for this link
		const tocHidden = localStorage.getItem(`toc_hidden_${linkHash}`);
		if (tocHidden === 'true') {
			dontShowAgain = true;
		}
		
		// Focus the popup when it opens for keyboard navigation
		if (popupElement) {
			popupElement.focus();
		}
	});
	
	function closePopup() {
		dispatch('close');
	}
	
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			event.stopPropagation();
		}
	}

	function handleCheckboxChange() {
		if (dontShowAgain) {
			localStorage.setItem(`toc_hidden_${linkHash}`, 'true');
		} else {
			localStorage.removeItem(`toc_hidden_${linkHash}`);
		}
	}
</script>

<div 
	class="popup-backdrop" 
	on:click={(event) => {
		if (event.target === event.currentTarget) {
			event.preventDefault();
			event.stopPropagation();
		}
	}}
	on:keydown={handleKeydown}
	role="dialog"
	aria-modal="true"
	aria-labelledby="toc-title"
	tabindex="-1"
	bind:this={popupElement}
>
	<div class="popup-content">
		<div class="popup-header">
			<h2 id="toc-title">Terms and Conditions</h2>
		</div>
		
		<div class="popup-body">
			<div class="simple-content">
				<p><strong>Welcome! Here's everything you need to know to use our service safely:</strong></p>
				
				<ol>
					<li>
						<strong>Your Privacy is Protected:</strong> We don't store any of your content on our servers. Everything stays in your browser and is encoded in the link itself. Only the person who creates the link is responsible for what's shared.
					</li>
					
					<li>
						<strong>We Can't See Your Content:</strong> Since we don't store anything, we have no way to know what content is being shared through our service. This means we can't be held responsible for what users choose to share.
					</li>
					
					<li>
						<strong>No Search Indexing:</strong> We don't index or catalog any links. However, our hosting provider (GitHub) may keep standard server logs for their own technical purposes.
					</li>
					
					<li>
						<strong>Free Service:</strong> This is a free tool provided as-is. While we try our best, we can't guarantee it will always work perfectly or be available 24/7.
					</li>
					
					<li>
						<strong>Standard Legal Protection:</strong> Like most websites, we need to protect ourselves from legal issues related to user-generated content. Since users control what gets shared, any legal responsibility stays with the person sharing the content, not with us.
					</li>
				</ol>
				
				<p><em>These are standard terms to help us provide this free service safely. By continuing, you're agreeing to these simple rules.</em></p>
				
				<div class="attribution">
					<p>This is a free service brought to you by <a href="https://ishafayet.me" target="_blank" rel="noopener noreferrer">Sayem Shafayet</a>, a FOSS enthusiast.</p>
				</div>
			</div>
		</div>
		
		<div class="popup-checkbox">
			<label class="checkbox-label">
				<input 
					type="checkbox" 
					bind:checked={dontShowAgain}
					class="checkbox-input"
					on:change={handleCheckboxChange}
				/>
				<span class="checkbox-text">Do not show again for this link</span>
			</label>
		</div>
		
		<div class="popup-footer">
			<button 
				class="got-it-btn" 
				on:click={() => {
					closePopup();
				}}
				type="button"
			>I Understand</button>
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
		max-height: 80vh;
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
	

	
	.popup-body {
		padding: 1.5rem 2rem;
		max-height: 50vh;
		overflow-y: auto;
	}
	
	.simple-content {
		color: #34495e;
		line-height: 1.6;
	}
	
	.simple-content p {
		margin: 0 0 1rem 0;
	}
	
	.simple-content ol {
		margin: 0 0 1.5rem 0;
		padding-left: 1.5rem;
	}
	
	.simple-content li {
		margin-bottom: 1rem;
	}
	
	.simple-content li:last-child {
		margin-bottom: 0;
	}
	
	.attribution {
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid #e0e0e0;
		text-align: center;
		font-size: 0.9rem;
		color: #7f8c8d;
	}
	
	.attribution a {
		color: #3498db;
		text-decoration: none;
		font-weight: 600;
	}
	
	.attribution a:hover {
		text-decoration: underline;
	}
	
	.popup-checkbox {
		padding: 1rem 2rem;
		border-top: 1px solid #e0e0e0;
		background: #f8f9fa;
	}
	
	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		cursor: pointer;
		font-size: 0.9rem;
		color: #5a6c7d;
	}
	
	.checkbox-input {
		width: 18px;
		height: 18px;
		cursor: pointer;
	}
	
	.checkbox-text {
		user-select: none;
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

	/* Mobile-first responsive design for small phones */
	@media (max-width: 480px) {
		.popup-backdrop {
			padding: 0.5rem;
		}

		.popup-content {
			margin: 0;
			max-width: 100%;
			max-height: calc(100vh - 1rem);
			border-radius: 8px;
		}

		.popup-header {
			padding: 1rem 1.25rem 0.75rem 1.25rem;
		}

		.popup-header h2 {
			font-size: 1.25rem;
		}



		.popup-body {
			padding: 1rem 1.25rem;
		}

		.simple-content p {
			font-size: 0.9rem;
			margin-bottom: 0.75rem;
		}

		.simple-content ol {
			margin-bottom: 1.25rem;
			padding-left: 1.25rem;
		}

		.simple-content li {
			margin-bottom: 0.75rem;
			font-size: 0.85rem;
			line-height: 1.5;
		}

		.simple-content strong {
			font-size: 0.9rem;
		}

		.attribution {
			margin-top: 1.5rem;
			padding-top: 1.25rem;
			font-size: 0.8rem;
		}

		/* .popup-checkbox {
			padding: 0.75rem 1.25rem;
		} */

		.checkbox-label {
			font-size: 0.8rem;
			gap: 0.5rem;
		}

		.popup-footer {
			padding: 0.75rem 1.25rem 1.25rem 1.25rem;
		}

		.got-it-btn {
			width: 100%;
			padding: 1rem;
			font-size: 1rem;
		}
	}

	@media (max-width: 768px) and (min-width: 481px) {
		.popup-content {
			margin: 1.5rem;
			max-width: 90%;
		}

		.popup-header h2 {
			font-size: 1.4rem;
		}

		.simple-content li {
			font-size: 0.9rem;
		}
	}
</style>
