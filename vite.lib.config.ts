import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.app.json',
      include: ['src/vite-env.d.ts', 'src/components/**/*.ts', 'src/components/**/*.vue'],
      entryRoot: 'src/components',
      outDirs: ['dist'],
      insertTypesEntry: true,
      afterDiagnostic(diagnostics) {
        if (diagnostics.length)
          throw new Error('Library declaration generation reported type errors.')
      },
    }),
  ],
  build: {
    lib: {
      entry: 'src/components/index.ts',
      name: 'VueMobileNav',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
      cssFileName: 'style',
    },
    rollupOptions: { external: ['vue', '@iconify/vue'] },
    copyPublicDir: false,
  },
})
