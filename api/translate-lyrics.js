export const config = {
  runtime: 'edge',
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function callGoogleTranslate(text, source, target, client) {
  const url = `https://translate.googleapis.com/translate_a/single?client=${client}&sl=${encodeURIComponent(
    source
  )}&tl=${encodeURIComponent(target)}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
    },
  });
  if (!res.ok) {
    throw new Error(`Google translate HTTP ${res.status}`);
  }
  const data = await res.json();
  if (!Array.isArray(data?.[0])) {
    throw new Error('Unexpected Google translate response');
  }
  return data[0].map((seg) => (Array.isArray(seg) && seg[0] ? String(seg[0]) : '')).join('');
}

async function callMyMemory(line, source, target) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    line
  )}&langpair=${encodeURIComponent(source)}|${encodeURIComponent(target)}`;
  const res = await fetch(url);
  if (!res.ok) return '';
  const data = await res.json();
  return typeof data?.responseData?.translatedText === 'string'
    ? data.responseData.translatedText
    : '';
}

async function lookupWord(word, source, target) {
  for (const client of ['dict-chrome-ex', 'gtx']) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=${client}&sl=${encodeURIComponent(
        source
      )}&tl=${encodeURIComponent(target)}&dt=t&dt=bd&dt=rm&q=${encodeURIComponent(word)}`;
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) continue;
      const data = await res.json();
      if (!Array.isArray(data?.[0])) continue;

      const meaning = data[0]
        .map((seg) => (Array.isArray(seg) && typeof seg[0] === 'string' ? seg[0] : ''))
        .join('')
        .trim();

      let romanization = '';
      for (const seg of data[0]) {
        if (Array.isArray(seg) && typeof seg[3] === 'string' && seg[3].trim()) {
          romanization = seg[3].trim();
          break;
        }
      }

      const dictEntries = Array.isArray(data[1])
        ? data[1]
            .filter((entry) => Array.isArray(entry) && typeof entry[0] === 'string' && Array.isArray(entry[1]))
            .map((entry) => ({
              pos: entry[0],
              terms: entry[1].filter((t) => typeof t === 'string').slice(0, 4),
            }))
        : [];

      if (meaning) {
        return { word, meaning, romanization, dictEntries };
      }
    } catch {
      // Try next client
    }
  }

  try {
    const fallback = (await callMyMemory(word, source, target)).trim();
    return { word, meaning: fallback, romanization: '', dictEntries: [] };
  } catch {
    return { word, meaning: '', romanization: '', dictEntries: [] };
  }
}

async function translateChunk(chunkLines, source, target) {
  if (chunkLines.length === 0) return [];
  const joined = chunkLines.join('\n');

  for (const client of ['dict-chrome-ex', 'gtx']) {
    try {
      const translated = await callGoogleTranslate(joined, source, target, client);
      const split = translated.split('\n').map((s) => s.trim());
      if (split.length === chunkLines.length) {
        return split;
      }
      if (chunkLines.length > 1) {
        const mid = Math.ceil(chunkLines.length / 2);
        const left = await translateChunk(chunkLines.slice(0, mid), source, target);
        const right = await translateChunk(chunkLines.slice(mid), source, target);
        return [...left, ...right];
      }
      return [translated.replace(/\s+/g, ' ').trim()];
    } catch {
      // Try next client
    }
  }

  if (chunkLines.length > 1) {
    const mid = Math.ceil(chunkLines.length / 2);
    const left = await translateChunk(chunkLines.slice(0, mid), source, target);
    const right = await translateChunk(chunkLines.slice(mid), source, target);
    return [...left, ...right];
  }

  try {
    const fallback = await callMyMemory(chunkLines[0], source, target);
    return [fallback];
  } catch {
    return [''];
  }
}

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const source = typeof body?.source === 'string' && body.source ? body.source : 'ru';
  const target = typeof body?.target === 'string' && body.target ? body.target : 'ko';

  if (body?.mode === 'word') {
    const rawWord = typeof body?.word === 'string' ? body.word.trim() : '';
    if (!rawWord || rawWord.length > 80) {
      return new Response(JSON.stringify({ error: 'Invalid word payload' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }
    const result = await lookupWord(rawWord, source, target);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=604800',
      },
    });
  }

  const lines = body?.lines;

  if (!Array.isArray(lines) || lines.length > 200 || lines.some((l) => typeof l !== 'string')) {
    return new Response(JSON.stringify({ error: 'Invalid lines payload' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const uniqueLines = [];
  const seen = new Set();
  for (const raw of lines) {
    const trimmed = raw.trim();
    if (trimmed && !seen.has(trimmed)) {
      seen.add(trimmed);
      uniqueLines.push(trimmed);
    }
  }

  const map = new Map();
  const MAX_CHUNK_CHARS = 900;
  let currentBatch = [];
  let currentLen = 0;

  const flushBatch = async () => {
    if (currentBatch.length === 0) return;
    const translated = await translateChunk(currentBatch, source, target);
    currentBatch.forEach((src, i) => {
      map.set(src, translated[i] || '');
    });
    currentBatch = [];
    currentLen = 0;
  };

  for (const line of uniqueLines) {
    if (currentBatch.length > 0 && currentLen + line.length + 1 > MAX_CHUNK_CHARS) {
      await flushBatch();
    }
    currentBatch.push(line);
    currentLen += line.length + 1;
  }
  await flushBatch();

  const translations = lines.map((raw) => {
    const trimmed = raw.trim();
    return trimmed ? map.get(trimmed) || '' : '';
  });

  return new Response(JSON.stringify({ translations }), {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
