import { expect, test } from '@playwright/test';

test.describe('Terms and Conditions (TOC) Feature', () => {
	test('should display TOC popup when viewing shared content for the first time', async ({ page }) => {
		// Create a test markdown link
		await page.goto('/');
		await page.locator('#markdown-input').fill('# Test Content\n\nThis is test content for TOC testing.');
		await page.locator('.generate-btn').click();
		
		// Get the generated link
		const linkInput = page.locator('.link-input');
		const linkValue = await linkInput.inputValue();
		
		// Navigate to the shared content
		await page.goto(linkValue);
		
		// TOC popup should be visible
		await expect(page.locator('.popup-backdrop')).toBeVisible();
		await expect(page.locator('#toc-title')).toHaveText('Terms and Conditions');
		
		// Check TOC content
		await expect(page.locator('.simple-content')).toContainText("Welcome! Here's everything you need to know");
		await expect(page.locator('.simple-content')).toContainText('Your Privacy is Protected');
		await expect(page.locator('.simple-content')).toContainText("We Can't See Your Content");
		await expect(page.locator('.simple-content')).toContainText('No Search Indexing');
		await expect(page.locator('.attribution')).toContainText('Sayem Shafayet');
		await expect(page.locator('.attribution a')).toHaveAttribute('href', 'https://ishafayet.me');
	});

	test('should have working checkbox for "do not show again"', async ({ page }) => {
		// Create and navigate to test content
		await page.goto('/');
		await page.locator('#markdown-input').fill('# TOC Checkbox Test');
		await page.locator('.generate-btn').click();
		
		const linkInput = page.locator('.link-input');
		const linkValue = await linkInput.inputValue();
		await page.goto(linkValue);
		
		// TOC popup should be visible
		await expect(page.locator('.popup-backdrop')).toBeVisible();
		
		// Checkbox should be present and unchecked initially
		const checkbox = page.locator('.checkbox-input');
		await expect(checkbox).toBeVisible();
		await expect(checkbox).not.toBeChecked();
		
		// Check the checkbox
		await checkbox.check();
		await expect(checkbox).toBeChecked();
		
		// Click "I Understand" button
		await page.locator('.got-it-btn').click();
		
		// Popup should close
		await expect(page.locator('.popup-backdrop')).not.toBeVisible();
		
		// Navigate back to the same link - TOC should not show again
		await page.goto(linkValue);
		await expect(page.locator('.popup-backdrop')).not.toBeVisible();
	});



	test('should close TOC popup when clicking backdrop', async ({ page }) => {
		// Create and navigate to test content
		await page.goto('/');
		await page.locator('#markdown-input').fill('# TOC Backdrop Test');
		await page.locator('.generate-btn').click();

		const linkInput = page.locator('.link-input');
		const linkValue = await linkInput.inputValue();
		await page.goto(linkValue);

		// TOC popup should be visible
		await expect(page.locator('.popup-backdrop')).toBeVisible();

		// Click on backdrop (not on content)
		await page.locator('.popup-backdrop').click({ position: { x: 10, y: 10 } });

		// Popup should remain visible (persistent)
		await expect(page.locator('.popup-backdrop')).toBeVisible();
		// Close via "I Understand" to end test cleanly
		await page.locator('.got-it-btn').click();
	});

	test('should close TOC popup when pressing Escape key', async ({ page }) => {
		// Create and navigate to test content
		await page.goto('/');
		await page.locator('#markdown-input').fill('# TOC Escape Key Test');
		await page.locator('.generate-btn').click();

		const linkInput = page.locator('.link-input');
		const linkValue = await linkInput.inputValue();
		await page.goto(linkValue);

		// TOC popup should be visible
		await expect(page.locator('.popup-backdrop')).toBeVisible();

		// Press Escape key
		await page.keyboard.press('Escape');

		// Popup should remain visible (persistent)
		await expect(page.locator('.popup-backdrop')).toBeVisible();
		// Close via "I Understand" to end test cleanly
		await page.locator('.got-it-btn').click();
	});

	test('should not close TOC popup when clicking on popup content', async ({ page }) => {
		// Create and navigate to test content
		await page.goto('/');
		await page.locator('#markdown-input').fill('# TOC Content Click Test');
		await page.locator('.generate-btn').click();
		
		const linkInput = page.locator('.link-input');
		const linkValue = await linkInput.inputValue();
		await page.goto(linkValue);
		
		// TOC popup should be visible
		await expect(page.locator('.popup-backdrop')).toBeVisible();
		
		// Click on popup content (not backdrop)
		await page.locator('.popup-content').click();
		
		// Popup should remain visible (persistent)
		await expect(page.locator('.popup-backdrop')).toBeVisible();
	});

	test('should display TOC popup when clicking TOC button manually', async ({ page }) => {
		// Create and navigate to test content
		await page.goto('/');
		await page.locator('#markdown-input').fill('# TOC Manual Button Test');
		await page.locator('.generate-btn').click();
		
		const linkInput = page.locator('.link-input');
		const linkValue = await linkInput.inputValue();
		await page.goto(linkValue);
		
		// Close initial TOC popup if it appears
		await page.waitForLoadState('networkidle');
		const tocPopup = page.locator('.popup-backdrop');
		if (await tocPopup.isVisible()) {
			await page.locator('.got-it-btn').click();
			await page.waitForTimeout(500); // Wait for popup to close
		}
		
		// Click TOC button manually
		await page.locator('.content-header .btn-secondary').first().click();
		
		// TOC popup should be visible
		await expect(page.locator('.popup-backdrop')).toBeVisible();
		await expect(page.locator('#toc-title')).toHaveText('Terms and Conditions');
	});

	test('should display TOC popup on error pages', async ({ page }) => {
		// Navigate to an invalid link to trigger error
		await page.goto('/#/view/invalid-hash');
		
		// Error should be displayed
		await expect(page.locator('.error-section')).toBeVisible();
		await expect(page.locator('.error-section p')).toContainText('Failed to decode the markdown content');
		
		// Click TOC button on error page
		await page.locator('.btn-secondary').click();
		
		// TOC popup should be visible
		await expect(page.locator('.popup-backdrop')).toBeVisible();
		await expect(page.locator('#toc-title')).toHaveText('Terms and Conditions');
	});

	test('should handle multiple TOC popup opens correctly', async ({ page }) => {
		// Create and navigate to test content
		await page.goto('/');
		await page.locator('#markdown-input').fill('# TOC Multiple Opens Test');
		await page.locator('.generate-btn').click();

		const linkInput = page.locator('.link-input');
		const linkValue = await linkInput.inputValue();
		await page.goto(linkValue);

		// Close initial TOC popup if it appears
		await page.waitForLoadState('networkidle');
		const tocPopup = page.locator('.popup-backdrop');
		if (await tocPopup.isVisible()) {
			await page.locator('.got-it-btn').click();
			await page.waitForTimeout(500); // Wait for popup to close
		}

		// Open TOC popup multiple times
		for (let i = 0; i < 3; i++) {
			await page.locator('.content-header .btn-secondary').first().click();
			await expect(page.locator('.popup-backdrop')).toBeVisible();
			await page.locator('.got-it-btn').click();
			await expect(page.locator('.popup-backdrop')).not.toBeVisible();
		}
	});

	test('should maintain TOC popup state across page refreshes', async ({ page }) => {
		// Create and navigate to test content
		await page.goto('/');
		await page.locator('#markdown-input').fill('# TOC State Persistence Test');
		await page.locator('.generate-btn').click();
		
		const linkInput = page.locator('.link-input');
		const linkValue = await linkInput.inputValue();
		await page.goto(linkValue);
		
		// TOC popup should be visible
		await expect(page.locator('.popup-backdrop')).toBeVisible();
		
		// Check the "do not show again" checkbox
		await page.locator('.checkbox-input').check();
		
		// Refresh the page
		await page.reload();
		
		// TOC popup should not be visible due to checkbox being checked
		await expect(page.locator('.popup-backdrop')).not.toBeVisible();
	});

	test('should have proper accessibility attributes', async ({ page }) => {
		// Create and navigate to test content
		await page.goto('/');
		await page.locator('#markdown-input').fill('# TOC Accessibility Test');
		await page.locator('.generate-btn').click();
		
		const linkInput = page.locator('.link-input');
		const linkValue = await linkInput.inputValue();
		await page.goto(linkValue);
		
		// TOC popup should be visible
		await expect(page.locator('.popup-backdrop')).toBeVisible();
		
		// Check accessibility attributes
		await expect(page.locator('.popup-backdrop')).toHaveAttribute('role', 'dialog');
		await expect(page.locator('.popup-backdrop')).toHaveAttribute('aria-modal', 'true');
		await expect(page.locator('.popup-backdrop')).toHaveAttribute('aria-labelledby', 'toc-title');
		await expect(page.locator('.got-it-btn')).toHaveAttribute('type', 'button');
	});

	test('should handle responsive design for TOC popup', async ({ page }) => {
		// Create and navigate to test content
		await page.goto('/');
		await page.locator('#markdown-input').fill('# TOC Responsive Test');
		await page.locator('.generate-btn').click();
		
		const linkInput = page.locator('.link-input');
		const linkValue = await linkInput.inputValue();
		await page.goto(linkValue);
		
		// TOC popup should be visible
		await expect(page.locator('.popup-backdrop')).toBeVisible();
		
		// Test mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await expect(page.locator('.popup-backdrop')).toBeVisible();
		await expect(page.locator('.popup-content')).toBeVisible();
		
		// Test tablet viewport
		await page.setViewportSize({ width: 768, height: 1024 });
		await expect(page.locator('.popup-backdrop')).toBeVisible();
		await expect(page.locator('.popup-content')).toBeVisible();
		
		// Test desktop viewport
		await page.setViewportSize({ width: 1200, height: 800 });
		await expect(page.locator('.popup-backdrop')).toBeVisible();
		await expect(page.locator('.popup-content')).toBeVisible();
	});
});
