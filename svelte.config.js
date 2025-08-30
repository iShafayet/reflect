import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-static generates static files for deployment to any web server
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: true
		}),
		
		// Configure hash routing for static deployment
		router: {
			type: 'hash'
		},
		
		// Ensure all routes are prerendered for static generation
		prerender: {
			handleHttpError: ({ path, message }) => {
				// Ignore missing routes during build
				if (path.startsWith('/view')) {
					return;
				}
				// Throw error for other missing routes
				throw new Error(message);
			}
		}
	}
};

export default config;
