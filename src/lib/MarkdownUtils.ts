import type { MarkdownToken } from './markdown';

// Recursive function to safely render nested tokens
export function renderNestedTokens(tokenList: MarkdownToken[]): any[] {
	const result = [];
	for (const token of tokenList) {
		if (token.type === 'text') {
			// For text tokens, check if they have nested tokens (like in list items)
			if (token.tokens && token.tokens.length > 0) {
				// This is a text token with nested formatting tokens
				result.push(...renderNestedTokens(token.tokens));
			} else {
				// This is just plain text
				result.push(token.text || '');
			}
		} else if (token.type === 'strong') {
			result.push({
				type: 'strong',
				content: renderNestedTokens(token.tokens || [])
			});
		} else if (token.type === 'em') {
			result.push({
				type: 'em',
				content: renderNestedTokens(token.tokens || [])
			});
		} else if (token.type === 'codespan') {
			result.push({
				type: 'codespan',
				content: token.text || ''
			});
		} else {
			result.push(token.text || '');
		}
	}
	return result;
}
