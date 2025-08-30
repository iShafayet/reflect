/**
 * Crypto utilities for secure hash generation
 * Uses Web Crypto API for modern browsers with fallback support
 */

/**
 * Generate SHA-256 hash of the given data
 * @param data - String or ArrayBuffer to hash
 * @returns Promise<string> - Hex-encoded hash
 */
export async function sha256(data: string | ArrayBuffer): Promise<string> {
	try {
		const encoder = new TextEncoder();
		const dataBuffer = typeof data === 'string' ? encoder.encode(data) : data;
		
		const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
		return arrayBufferToHex(hashBuffer);
	} catch (error) {
		console.error('SHA-256 hash generation failed:', error);
		throw new Error('Failed to generate SHA-256 hash');
	}
}

/**
 * Generate a shorter hash using SHA-256 and truncating to specified length
 * @param data - String or ArrayBuffer to hash
 * @param length - Length of the truncated hash (default: 16)
 * @returns Promise<string> - Truncated hex-encoded hash
 */
export async function shortHash(data: string | ArrayBuffer, length: number = 16): Promise<string> {
	const fullHash = await sha256(data);
	return fullHash.substring(0, length);
}

/**
 * Generate a hash suitable for localStorage keys
 * @param data - String to hash
 * @returns Promise<string> - Short hash suitable for keys
 */
export async function localStorageKey(data: string): Promise<string> {
	return await shortHash(data, 12);
}

/**
 * Convert ArrayBuffer to hex string
 * @param buffer - ArrayBuffer to convert
 * @returns string - Hex-encoded string
 */
function arrayBufferToHex(buffer: ArrayBuffer): string {
	const uint8Array = new Uint8Array(buffer);
	return Array.from(uint8Array)
		.map(byte => byte.toString(16).padStart(2, '0'))
		.join('');
}

/**
 * Check if Web Crypto API is available
 * @returns boolean - True if crypto is available
 */
export function isCryptoAvailable(): boolean {
	return typeof crypto !== 'undefined' && 
		   typeof crypto.subtle !== 'undefined' && 
		   typeof crypto.subtle.digest === 'function';
}

/**
 * Fallback hash function for older browsers
 * @param data - String to hash
 * @returns string - Simple hash (not cryptographically secure)
 */
export function fallbackHash(data: string): string {
	let hash = 0;
	if (data.length === 0) return hash.toString(16);
	
	for (let i = 0; i < data.length; i++) {
		const char = data.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32-bit integer
	}
	
	return Math.abs(hash).toString(16);
}

/**
 * Generate hash with fallback support
 * @param data - String to hash
 * @returns Promise<string> - Hash string
 */
export async function hash(data: string): Promise<string> {
	if (isCryptoAvailable()) {
		return await sha256(data);
	} else {
		console.warn('Web Crypto API not available, using fallback hash');
		return fallbackHash(data);
	}
}
