export const config = {
	maxCharacters: parseInt(import.meta.env.VITE_MAX_CHARACTERS || '1200'),
	appName: import.meta.env.VITE_APP_NAME || 'Reflect',
	appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Share your thoughts in markdown format'
};
