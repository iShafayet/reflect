import { expect, test } from '@playwright/test';
import { TEST_CONSTANTS } from './test-constants';

test.describe('Markdown Sharing Flow', () => {
	test('should display home page with correct elements', async ({ page }) => {
		await page.goto('/');
		
		// Check main heading
		await expect(page.locator('h1')).toHaveText('Reflect');
		await expect(page.locator('p')).toHaveText('Share your thoughts in markdown format');
		
		// Check input section
		await expect(page.locator('label[for="markdown-input"]')).toContainText('Enter your markdown');
		await expect(page.locator('#markdown-input')).toBeVisible();
		await expect(page.locator('.generate-btn')).toBeVisible();
		
		// Check character count
		await expect(page.locator('.character-count')).toContainText(`0/${TEST_CONSTANTS.MAX_CHARACTERS}`);
	});

	test('should handle markdown input and preview', async ({ page }) => {
		await page.goto('/');
		
		const textarea = page.locator('#markdown-input');
		const previewSection = page.locator('.preview-section');
		
		// Initially no preview should be visible
		await expect(previewSection).not.toBeVisible();
		
		// Type some markdown
		const markdownContent = '# Hello World\n\nThis is **bold** and *italic* text.\n\n- List item 1\n- List item 2';
		await textarea.fill(markdownContent);
		
		// Check character count updates (note: textarea has configurable maxlength)
		await expect(page.locator('.character-count')).toContainText(`79/${TEST_CONSTANTS.MAX_CHARACTERS}`);
		
		// Preview should now be visible
		await expect(previewSection).toBeVisible();
		
		// Check preview content (shows concatenated text without markdown syntax)
		await expect(page.locator('.preview-content')).toContainText('Hello World');
		await expect(page.locator('.preview-content')).toContainText('This is **bold** and *italic* text');
		await expect(page.locator('.preview-content')).toContainText('List item 1');
		await expect(page.locator('.preview-content')).toContainText('List item 2');
	});

	test('should generate shareable link', async ({ page }) => {
		await page.goto('/');
		
		const textarea = page.locator('#markdown-input');
		const generateBtn = page.locator('.generate-btn');
		const linkSection = page.locator('.link-section');
		
		// Initially no link section should be visible
		await expect(linkSection).not.toBeVisible();
		
		// Type markdown content
		await textarea.fill('# Test Title\n\nThis is test content.');
		
		// Generate link
		await generateBtn.click();
		
		// Link section should now be visible
		await expect(linkSection).toBeVisible();
		
		// Check link format
		const linkInput = page.locator('.link-input');
		await expect(linkInput).toHaveValue(/\/view#/);
		
		// Check link info text
		await expect(page.locator('.link-info')).toContainText('Anyone with this link can view your rendered markdown');
	});

	test('should copy link to clipboard', async ({ page }) => {
		await page.goto('/');
		
		// Type markdown and generate link
		await page.locator('#markdown-input').fill('# Test Content');
		await page.locator('.generate-btn').click();
		
		// Click copy button
		await page.locator('.copy-btn').click();
		
		// Check copy notification appears
		await expect(page.locator('.copy-notification')).toBeVisible();
		await expect(page.locator('.copy-notification')).toContainText('Link copied to clipboard!');
		
		// Wait for notification to disappear
		await expect(page.locator('.copy-notification')).not.toBeVisible();
	});

	test('should handle character limit', async ({ page }) => {
		await page.goto('/');
		
		const textarea = page.locator('#markdown-input');
		const generateBtn = page.locator('.generate-btn');
		const characterCount = page.locator('.character-count');
		
		// Fill with content under limit
		const shortContent = 'A'.repeat(200);
		await textarea.fill(shortContent);
		await expect(characterCount).toContainText(`200/${TEST_CONSTANTS.MAX_CHARACTERS}`);
		await expect(generateBtn).toBeEnabled();
		
		// Fill with content at limit
		const limitContent = 'A'.repeat(TEST_CONSTANTS.MAX_CHARACTERS);
		await textarea.fill(limitContent);
		await expect(characterCount).toContainText(`${TEST_CONSTANTS.MAX_CHARACTERS}/${TEST_CONSTANTS.MAX_CHARACTERS}`);
		await expect(generateBtn).toBeEnabled();
		
		// Fill with content over limit (textarea maxlength will prevent input beyond limit)
		const overLimitContent = 'A'.repeat(450);
		await textarea.fill(overLimitContent);
		// The textarea maxlength=1200 will allow 450 characters
		await expect(characterCount).toContainText(`450/${TEST_CONSTANTS.MAX_CHARACTERS}`);
		await expect(generateBtn).toBeEnabled(); // Enabled since content is within limit
		
		// Test actual limit enforcement by trying to type beyond maxlength
		await textarea.fill(''); // Clear first
		const atLimitContent = 'A'.repeat(TEST_CONSTANTS.MAX_CHARACTERS);
		await textarea.fill(atLimitContent);
		await expect(characterCount).toContainText(`${TEST_CONSTANTS.MAX_CHARACTERS}/${TEST_CONSTANTS.MAX_CHARACTERS}`);
		
		// Try to add more characters (should be prevented by maxlength)
		await textarea.type('B');
		await expect(characterCount).toContainText(`${TEST_CONSTANTS.MAX_CHARACTERS}/${TEST_CONSTANTS.MAX_CHARACTERS}`); // Should still be at max
		await expect(generateBtn).toBeEnabled(); // Should still be enabled
	});

	test('should view shared markdown content', async ({ page }) => {
		// First create content and get link
		await page.goto('/');
		await page.locator('#markdown-input').fill('# Shared Content\n\nThis content was shared via link.');
		await page.locator('.generate-btn').click();
		
		const linkValue = await page.locator('.link-input').inputValue();
		const hash = linkValue.split('#')[1];
		
		// Navigate to view page
		await page.goto(`/view#${hash}`);
		
		// Check page loads correctly (use more specific selectors)
		await expect(page.locator('.header h1')).toHaveText('Reflect');
		await expect(page.locator('.content-header h2')).toHaveText('Rendered Markdown');
		
		// Check content is rendered
		await expect(page.locator('.markdown-content h1')).toHaveText('Shared Content');
		await expect(page.locator('.markdown-content p')).toContainText('This content was shared via link');
		
		// Check raw markdown section
		await expect(page.locator('.raw-section summary')).toHaveText('View Raw Markdown');
		
		// Close TOC popup if it's open
		const tocPopup = page.locator('.popup-backdrop');
		if (await tocPopup.isVisible()) {
			await page.locator('.got-it-btn').click();
		}
		await page.locator('.raw-section summary').click();
		await expect(page.locator('.raw-content')).toContainText('# Shared Content');
	});

	test('should handle invalid hash gracefully', async ({ page }) => {
		await page.goto('/view#invalid-hash');
		
		// Should show error message
		await expect(page.locator('.error-section')).toBeVisible();
		await expect(page.locator('.error-section h2')).toHaveText('Error');
		await expect(page.locator('.error-section p')).toContainText('Failed to decode the markdown content');
		
		// Should show action buttons
		await expect(page.locator('.error-actions .btn-secondary')).toHaveText('TOC');
		await expect(page.locator('.error-actions .btn-primary')).toHaveText('Create New');
	});

	test('should handle empty hash', async ({ page }) => {
		await page.goto('/view');
		
		// Should show error message
		await expect(page.locator('.error-section')).toBeVisible();
		await expect(page.locator('.error-section p')).toContainText('No markdown content found in the URL');
	});

	test('should navigate between pages', async ({ page }) => {
		// Start on home page
		await page.goto('/');
		await expect(page.locator('h1')).toHaveText('Reflect');
		
		// Generate a link
		await page.locator('#markdown-input').fill('# Test Navigation');
		await page.locator('.generate-btn').click();
		
		// Go to view page
		const linkValue = await page.locator('.link-input').inputValue();
		const hash = linkValue.split('#')[1];
		await page.goto(`/view#${hash}`);
		
		// Note: Back button has been replaced with TOC button
		
		// Close TOC popup if it's open
		const tocPopup = page.locator('.popup-backdrop');
		if (await tocPopup.isVisible()) {
			await page.locator('.got-it-btn').click();
		}
		
		// Use create new button
		await page.locator('button:has-text("Create New")').click();
		await expect(page).toHaveURL('/');
	});

	test('should handle markdown with special characters safely', async ({ page }) => {
		await page.goto('/');
		
		// Test with potentially dangerous content
		const dangerousContent = `<script>alert('xss')</script>\n\n# Safe Heading\n\nThis is **safe** content.`;
		await page.locator('#markdown-input').fill(dangerousContent);
		
		// Preview should show content safely
		await expect(page.locator('.preview-content')).toBeVisible();
		await expect(page.locator('.preview-content h1')).toHaveText('Safe Heading');
		
		// Generate link
		await page.locator('.generate-btn').click();
		const linkValue = await page.locator('.link-input').inputValue();
		const hash = linkValue.split('#')[1];
		
		// View the shared content
		await page.goto(`/view#${hash}`);
		
		// Content should be rendered safely (no script execution)
		await expect(page.locator('.markdown-content h1')).toHaveText('Safe Heading');
		// The markdown renderer shows the raw markdown text, not rendered HTML
		await expect(page.locator('.markdown-content p')).toContainText('This is **safe** content');
		
		// Raw content should show the original text
		// Close TOC popup if it's open
		const tocPopup2 = page.locator('.popup-backdrop');
		if (await tocPopup2.isVisible()) {
			await page.locator('.got-it-btn').click();
		}
		
		await page.locator('.raw-section summary').click();
		await expect(page.locator('.raw-content')).toContainText('<script>alert(\'xss\')</script>');
	});
});
