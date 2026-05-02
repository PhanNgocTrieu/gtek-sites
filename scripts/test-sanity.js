import fs from 'fs/promises';
import path from 'path';

// Load .env.local if present (simple parser, no external deps)
async function loadLocalEnv(filename = '.env.local') {
  try {
    const file = path.resolve(process.cwd(), filename);
    const content = await fs.readFile(file, 'utf8');
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const idx = line.indexOf('=');
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      let val = line.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  } catch (err) {
    // ignore if file missing
  }
}

await loadLocalEnv();

const { createClient } = await import('next-sanity');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});

try {
  const data = await client.fetch(`*[_type == "project"][0..2]{_id, title}`);
  console.log('OK — fetched:', Array.isArray(data) ? data.length : 0, 'projects');
} catch (err) {
  console.error('Sanity fetch error:', err.message || err);
  process.exit(1);
}
