import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/** การตั้งค่า Vite พร้อมปลั๊กอิน React และ Tailwind CSS v4 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
});

