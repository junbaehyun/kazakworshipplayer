import { Readable } from 'node:stream';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import translateLyricsHandler from './api/translate-lyrics.js';

function localApiProxyPlugin(): Plugin {
  return {
    name: 'local-api-proxy',
    configureServer(server) {
      server.middlewares.use('/api/translate-lyrics', async (req, res) => {
        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(Buffer.from(chunk));
          const bodyText = Buffer.concat(chunks).toString('utf8');
          const webReq = new Request('http://localhost/api/translate-lyrics', {
            method: req.method || 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: req.method === 'POST' ? bodyText : undefined,
          });
          const webRes = await translateLyricsHandler(webReq);
          res.statusCode = webRes.status;
          webRes.headers.forEach((v, k) => res.setHeader(k, v));
          res.end(await webRes.text());
        } catch {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Local translate proxy error' }));
        }
      });

      server.middlewares.use('/api/proxy-audio', async (req, res) => {
        const reqUrl = new URL(req.url || '', 'http://localhost');
        const rawUrl = reqUrl.searchParams.get('url');
        if (!rawUrl) {
          res.statusCode = 400;
          res.end('Missing url');
          return;
        }
        try {
          const target = new URL(rawUrl);
          if (target.protocol !== 'https:' || target.hostname !== 'repo.worshipleaderapp.com') {
            res.statusCode = 403;
            res.end('Host not allowed');
            return;
          }
          const upstream = await fetch(target.toString());
          if (!upstream.ok || !upstream.body) {
            res.statusCode = upstream.status || 502;
            res.end('Upstream error');
            return;
          }
          res.setHeader('Content-Type', upstream.headers.get('content-type') || 'audio/mpeg');
          const contentLength = upstream.headers.get('content-length');
          if (contentLength) res.setHeader('Content-Length', contentLength);
          Readable.fromWeb(upstream.body as Parameters<typeof Readable.fromWeb>[0]).pipe(res);
        } catch {
          res.statusCode = 500;
          res.end('Proxy error');
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localApiProxyPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
});
