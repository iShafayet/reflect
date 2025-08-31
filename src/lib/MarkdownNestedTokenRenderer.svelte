<script lang="ts">
	import type { MarkdownToken } from './markdown';

	export let tokens: any[];
</script>

{#each tokens as item}
	{#if typeof item === 'string'}
		{item}
	{:else if item.type === 'strong'}
		<strong>
			{#each item.content as contentItem}
				{#if typeof contentItem === 'string'}
					{contentItem}
				{:else if contentItem.type === 'em'}
					<em>
						{#each contentItem.content as deepItem}
							{deepItem}
						{/each}
					</em>
				{:else if contentItem.type === 'codespan'}
					<code>{contentItem.content}</code>
				{/if}
			{/each}
		</strong>
	{:else if item.type === 'em'}
		<em>
			{#each item.content as contentItem}
				{#if typeof contentItem === 'string'}
					{contentItem}
				{:else if contentItem.type === 'strong'}
					<strong>
						{#each contentItem.content as deepItem}
							{deepItem}
						{/each}
					</strong>
				{:else if contentItem.type === 'codespan'}
					<code>{contentItem.content}</code>
				{/if}
			{/each}
		</em>
	{:else if item.type === 'codespan'}
		<code>{item.content}</code>
	{/if}
{/each}
