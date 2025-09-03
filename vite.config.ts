import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib'
  
  return {
    plugins: [
      react({
        jsxRuntime: 'automatic'
      }),
      ...(isLib ? [
        dts({
          insertTypesEntry: true,
          exclude: ['**/*.test.*', '**/*.spec.*', 'examples/**', 'stories/**']
        })
      ] : [])
    ],
    
    ...(isLib ? {
      // Library build configuration
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.tsx'),
          name: 'ReactLabelDesigner',
          formats: ['es', 'umd'],
          fileName: (format) => `index.${format}.js`
        },
        rollupOptions: {
          external: ['react', 'react-dom', 'react/jsx-runtime'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              'react/jsx-runtime': 'react/jsx-runtime'
            }
          }
        }
      }
    } : {
      // Development configuration
      build: {
        outDir: 'dev-dist'
      }
    }),
    
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode === 'development' ? 'development' : 'production')
    },

    test: {
      globals: true,
      environment: 'jsdom'
    }
  }
})