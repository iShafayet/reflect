import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
	sha256, 
	shortHash, 
	localStorageKey, 
	isCryptoAvailable, 
	fallbackHash, 
	hash 
} from './crypto-utils';

// Mock crypto.subtle for testing
const mockDigest = vi.fn();
const mockCrypto = {
	subtle: {
		digest: mockDigest
	}
};

describe('Crypto Utils', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Reset global crypto
		Object.defineProperty(globalThis, 'crypto', {
			value: mockCrypto,
			writable: true
		});
	});

	describe('isCryptoAvailable', () => {
		it('should return true when crypto is available', () => {
			expect(isCryptoAvailable()).toBe(true);
		});

		it('should return false when crypto is not available', () => {
			Object.defineProperty(globalThis, 'crypto', {
				value: undefined,
				writable: true
			});
			expect(isCryptoAvailable()).toBe(false);
		});
	});

	describe('SHA-256 function', () => {
		beforeEach(() => {
			// Mock successful digest response
			const mockBuffer = new ArrayBuffer(32);
			mockDigest.mockResolvedValue(mockBuffer);
		});

		it('should generate SHA-256 hash', async () => {
			const result = await sha256('test data');
			expect(mockDigest).toHaveBeenCalledWith('SHA-256', expect.any(Uint8Array));
			expect(result).toBe('0000000000000000000000000000000000000000000000000000000000000000');
		});

		it('should handle ArrayBuffer input', async () => {
			const arrayBuffer = new ArrayBuffer(8);
			await sha256(arrayBuffer);
			expect(mockDigest).toHaveBeenCalledWith('SHA-256', arrayBuffer);
		});

		it('should handle errors gracefully', async () => {
			mockDigest.mockRejectedValue(new Error('Crypto error'));
			await expect(sha256('test')).rejects.toThrow('Failed to generate SHA-256 hash');
		});
	});

	describe('shortHash', () => {
		beforeEach(() => {
			const mockBuffer = new ArrayBuffer(32);
			mockDigest.mockResolvedValue(mockBuffer);
		});

		it('should generate truncated hash', async () => {
			const result = await shortHash('test data', 8);
			expect(result).toBe('00000000');
		});

		it('should use default length of 16', async () => {
			const result = await shortHash('test data');
			expect(result).toBe('0000000000000000');
		});
	});

	describe('localStorageKey', () => {
		beforeEach(() => {
			const mockBuffer = new ArrayBuffer(32);
			mockDigest.mockResolvedValue(mockBuffer);
		});

		it('should generate 12-character hash', async () => {
			const result = await localStorageKey('test data');
			expect(result).toBe('000000000000');
		});
	});

	describe('fallbackHash', () => {
		it('should generate consistent hash for same input', () => {
			const hash1 = fallbackHash('test data');
			const hash2 = fallbackHash('test data');
			expect(hash1).toBe(hash2);
		});

		it('should handle empty string', () => {
			const result = fallbackHash('');
			expect(result).toBe('0');
		});

		it('should handle different inputs', () => {
			const hash1 = fallbackHash('test data');
			const hash2 = fallbackHash('different data');
			expect(hash1).not.toBe(hash2);
		});
	});

	describe('hash function with fallback', () => {
		it('should use crypto API when available', async () => {
			const mockBuffer = new ArrayBuffer(32);
			mockDigest.mockResolvedValue(mockBuffer);
			
			const result = await hash('test data');
			expect(mockDigest).toHaveBeenCalled();
			expect(result).toBe('0000000000000000000000000000000000000000000000000000000000000000');
		});

		it('should use fallback when crypto is not available', async () => {
			Object.defineProperty(globalThis, 'crypto', {
				value: undefined,
				writable: true
			});
			
			const result = await hash('test data');
			expect(result).toBe(fallbackHash('test data'));
		});
	});
});
