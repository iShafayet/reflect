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
			closePopup();
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
	on:click={(event) => event.target === event.currentTarget && closePopup()}
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
			<button 
				class="close-btn" 
				on:click={closePopup}
				aria-label="Close popup"
				type="button"
			>&times;</button>
		</div>
		
		<div class="popup-body">
			<div class="simple-content">
				<p><strong>By continuing to use this app, you agree to the following Terms and Conditions:</strong></p>
				
				<ol>
					<li>
						<strong>No Data Storage:</strong> The markdown content is absolutely not stored on our server. Everything is processed inside your browser. All data, regardless of content, is encoded from your link. All responsibility lies with the generator of the link.
					</li>
					
					<li>
						<strong>No Developer Responsibility:</strong> We (developers) take absolutely zero responsibility for what messages are shared, as we have no way to know what was shared.
					</li>
					
					<li>
						<strong>No Platform Indexing:</strong> Our platform does not index the links. However, our host (GitHub) may collect logs for their own purposes. We are not responsible for that.
					</li>
				</ol>
				
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
		max-height: 60vh;
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
</style>
