import { Readable } from 'node:stream';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function localAudioProxyPlugin(): Plugin {
  return {
    name: 'local-audio-proxy',
    configureServer(server) {
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
  plugins: [react(), tailwindcss(), localAudioProxyPlugin()],
});
