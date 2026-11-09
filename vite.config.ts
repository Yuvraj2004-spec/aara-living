import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({plugins:[react(),tailwindcss()],optimizeDeps:{include:['@huggingface/transformers']},test:{environment:'jsdom',include:['src/**/*.test.ts']}});
