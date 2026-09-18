import 'dotenv/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

function serverlessApiPlugin() {
  return {
    name: 'serverless-api-middleware',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url) return next();
        const url = new URL(req.url, 'http://localhost');
        const pathname = url.pathname.replace(/\/$/, '');

        if (pathname === '/api/token') {
          try {
            const { default: handler } = await import('./api/token');
            return handler(req, res);
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ success: false, error: err.message || 'API error' }));
          }
        }

        if (pathname === '/api/transactions') {
          try {
            const { default: handler } = await import('./api/transactions');
            return handler(req, res);
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ success: false, error: err.message || 'API error' }));
          }
        }

        if (pathname === '/api/ura' || pathname === '/api') {
          try {
            const { default: handler } = await import('./api/index');
            return handler(req, res);
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ success: false, error: err.message || 'API error' }));
          }
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), serverlessApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
