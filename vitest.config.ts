import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/setupTests.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.tsx',
        'src/lib/**',
        'src/types/**',
        'src/utils/**',
        'src/integrations/**',
        'src/components/ui/**',
        'src/routes/**',
        'src/pages/**',
        'src/hooks/**',
        'src/contexts/**',
        'src/features/**',
      ],
      thresholds: {
        // Setting lower initial thresholds that we can gradually increase
        branches: 30,
        functions: 30,
        lines: 30,
        statements: 30
      }
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})