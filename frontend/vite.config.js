import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite' // Agrega esta línea

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // escucha en 0.0.0.0 para que funcione en cualquier navegador (localhost, 127.0.0.1, etc.)
    port: 5173,
    strictPort: false, // si 5173 está ocupado, usa otro
  },
})