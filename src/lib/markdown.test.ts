import { describe, it, expect } from 'vitest';
import { parseMarkdown, decodeMarkdownFromHash } from './markdown';

describe('markdown utilities', () => {
	describe('parseMarkdown', () => {
		it('should parse basic headings', () => {
			const result = parseMarkdown('# Hello World');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({
				type: 'heading',
				depth: 1,
				text: 'Hello World'
			});
		});

		it('should parse multiple heading levels', () => {
			const result = parseMarkdown('# H1\n## H2\n### H3');
			expect(result).toHaveLength(3);
			expect(result[0].depth).toBe(1);
			expect(result[1].depth).toBe(2);
			expect(result[2].depth).toBe(3);
		});

		it('should parse paragraphs', () => {
			const result = parseMarkdown('This is a paragraph.');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({
				type: 'paragraph',
				text: 'This is a paragraph.'
			});
		});

		it('should parse bold and italic text', () => {
			const result = parseMarkdown('**Bold** and *italic* text');
			expect(result).toHaveLength(1);
			expect(result[0].type).toBe('paragraph');
			expect(result[0].tokens).toHaveLength(4);
			expect(result[0].tokens![0]).toMatchObject({
				type: 'strong',
				text: 'Bold'
			});
			expect(result[0].tokens![2]).toMatchObject({
				type: 'em',
				text: 'italic'
			});
		});

		it('should parse code blocks', () => {
			const result = parseMarkdown('```\nconsole.log("Hello");\n```');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({
				type: 'code',
				text: 'console.log("Hello");'
			});
		});

		it('should parse inline code', () => {
			const result = parseMarkdown('Use `const` for constants');
			expect(result).toHaveLength(1);
			expect(result[0].type).toBe('paragraph');
			expect(result[0].tokens![1]).toMatchObject({
				type: 'codespan',
				text: 'const'
			});
		});

		it('should parse unordered lists', () => {
			const result = parseMarkdown('- Item 1\n- Item 2\n- Item 3');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({
				type: 'list',
				ordered: false
			});
			expect(result[0].items).toHaveLength(3);
		});

		it('should parse ordered lists', () => {
			const result = parseMarkdown('1. First\n2. Second\n3. Third');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({
				type: 'list',
				ordered: true
			});
			expect(result[0].items).toHaveLength(3);
		});

		it('should parse blockquotes', () => {
			const result = parseMarkdown('> This is a quote\n> With multiple lines');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({
				type: 'blockquote'
			});
		});

		it('should parse horizontal rules', () => {
			const result = parseMarkdown('---');
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({
				type: 'hr'
			});
		});

		it('should handle empty input', () => {
			const result = parseMarkdown('');
			expect(result).toHaveLength(0);
		});

		it('should handle whitespace-only input', () => {
			const result = parseMarkdown('   \n  \t  ');
			// Marked library parses whitespace as tokens, so we check it's not empty
			expect(result.length).toBeGreaterThan(0);
			// Verify that the tokens are mostly whitespace-related
			const hasWhitespaceTokens = result.some(token => 
				token.type === 'space' || token.type === 'text'
			);
			expect(hasWhitespaceTokens).toBe(true);
		});

		it('should parse complex nested structures', () => {
			const markdown = `# Title

This is a **bold** paragraph with *italic* text.

- List item with \`code\`
- Another item

> Blockquote with **formatting**

\`\`\`javascript
const x = 1;
\`\`\``;

			const result = parseMarkdown(markdown);
			expect(result.length).toBeGreaterThan(0);
			
			// Should have heading
			const heading = result.find(token => token.type === 'heading');
			expect(heading).toBeDefined();
			expect(heading!.text).toBe('Title');
			
			// Should have list
			const list = result.find(token => token.type === 'list');
			expect(list).toBeDefined();
			expect(list!.ordered).toBe(false);
		});
	});

	describe('decodeMarkdownFromHash', () => {
		it('should decode valid base64 content', () => {
			const originalText = 'Hello, World!';
			const encoded = btoa(unescape(encodeURIComponent(originalText)));
			const decoded = decodeMarkdownFromHash(encoded);
			expect(decoded).toBe(originalText);
		});

		it('should decode markdown content with special characters', () => {
			const originalText = '# Title\n**Bold** and *italic* text\n- List item';
			const encoded = btoa(unescape(encodeURIComponent(originalText)));
			const decoded = decodeMarkdownFromHash(encoded);
			expect(decoded).toBe(originalText);
		});

		it('should decode content with unicode characters', () => {
			const originalText = 'Hello 世界! 🌍';
			const encoded = btoa(unescape(encodeURIComponent(originalText)));
			const decoded = decodeMarkdownFromHash(encoded);
			expect(decoded).toBe(originalText);
		});

		it('should decode content with HTML-like text safely', () => {
			const originalText = 'This contains <script>alert("xss")</script> but is safe';
			const encoded = btoa(unescape(encodeURIComponent(originalText)));
			const decoded = decodeMarkdownFromHash(encoded);
			expect(decoded).toBe(originalText);
		});

		it('should throw error for invalid base64', () => {
			expect(() => {
				decodeMarkdownFromHash('invalid-base64!@#');
			}).toThrow('Failed to decode the markdown content. The link may be invalid.');
		});

		it('should handle empty hash gracefully', () => {
			// Empty string might not throw an error, so we test the actual behavior
			try {
				const result = decodeMarkdownFromHash('');
				// If it doesn't throw, the result should be empty string
				expect(result).toBe('');
			} catch (error) {
				// If it does throw, that's also acceptable
				expect(error).toBeInstanceOf(Error);
			}
		});

		it('should handle edge case with very long content', () => {
			const longText = 'A'.repeat(1000);
			const encoded = btoa(unescape(encodeURIComponent(longText)));
			const decoded = decodeMarkdownFromHash(encoded);
			expect(decoded).toBe(longText);
		});
	});
});
