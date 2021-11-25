const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    minify: true,
    outDir: path.resolve(__dirname, './min'),
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'cache',
      fileName: (format) => `index.${format}.min.js`,
    },
    rollupOptions: {
    }
  }
})
