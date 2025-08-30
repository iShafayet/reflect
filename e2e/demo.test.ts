import { expect, test } from '@playwright/test';
import { TEST_CONSTANTS } from './test-constants';

test.describe('Basic App Functionality', () => {
	test('should load home page with correct structure', async ({ page }) => {
		await page.goto('/');
		
		// Check page title
		await expect(page).toHaveTitle('Reflect - Share Your Thoughts');
		
		// Check main elements are present
		await expect(page.locator('h1')).toHaveText('Reflect');
		await expect(page.locator('p')).toHaveText('Share your thoughts in markdown format');
		
		// Check form elements
		await expect(page.locator('#markdown-input')).toBeVisible();
		await expect(page.locator('.generate-btn')).toBeVisible();
		
		// Check initial state
		await expect(page.locator('.character-count')).toContainText(`0/${TEST_CONSTANTS.MAX_CHARACTERS}`);
		await expect(page.locator('.link-section')).not.toBeVisible();
		await expect(page.locator('.preview-section')).not.toBeVisible();
	});

	test('should handle responsive design', async ({ page }) => {
		await page.goto('/');
		
		// Test mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await expect(page.locator('.header h1')).toBeVisible();
		await expect(page.locator('#markdown-input')).toBeVisible();
		
		// Test tablet viewport
		await page.setViewportSize({ width: 768, height: 1024 });
		await expect(page.locator('.header h1')).toBeVisible();
		await expect(page.locator('#markdown-input')).toBeVisible();
		
		// Test desktop viewport
		await page.setViewportSize({ width: 1200, height: 800 });
		await expect(page.locator('.header h1')).toBeVisible();
		await expect(page.locator('#markdown-input')).toBeVisible();
	});
});
