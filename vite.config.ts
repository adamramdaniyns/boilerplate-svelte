import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
// Remove Node's 'path' import and use Vite's built-in aliasing
export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	resolve: {
		alias: {
			'@': '/src'
		}
	},
	optimizeDeps: {
		include: ['bits-ui']
	},
	ssr: {
		noExternal: ['bits-ui']
	}
});
