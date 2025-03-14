
import tailwindcss from '@tailwindcss/vite'
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import proxyOptions from './proxyOptions';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(),tailwindcss()],
	server: {
		port: 8080,
		proxy: proxyOptions,
		
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	build: {
		outDir: '../lbf_ui/public/customer_portal',
		emptyOutDir: true,
		target: 'es2015',
	},
});
