import { marked } from 'marked';

// Configure marked options
marked.setOptions({
	breaks: true, // Convert line breaks to <br>
	gfm: true // GitHub Flavored Markdown
});

// Define token types for better type safety
export interface MarkdownToken {
	type: string;
	text?: string;
	depth?: number;
	ordered?: boolean;
	items?: MarkdownToken[];
	tokens?: MarkdownToken[];
}

// Function to parse markdown content to tokens
export function parseMarkdown(content: string): MarkdownToken[] {
	return marked.lexer(content);
}

// Function to safely decode base64 markdown content from URL hash
export function decodeMarkdownFromHash(hash: string): string {
	try {
		return decodeURIComponent(escape(atob(hash)));
	} catch {
		throw new Error('Failed to decode the markdown content. The link may be invalid.');
	}
}

// Function to escape HTML to prevent injection
export function escapeHtml(text: string): string {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}
