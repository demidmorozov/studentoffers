import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const urls = new Set();
async function walk(directory) {
  for (const file of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, file.name);
    if (file.isDirectory()) await walk(path);
    else if (path.endsWith('.html')) {
      const html = await readFile(path, 'utf8');
      for (const [, url] of html.matchAll(/href="(https?:[^"\s]+)"/g)) urls.add(url.replaceAll('&amp;', '&'));
    }
  }
}
await walk('dist');
const results = [];
const remaining = [...urls];
async function worker() {
  while (remaining.length) {
    const url = remaining.shift();
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(15000), redirect: 'follow', headers: { 'User-Agent': 'StudentOffers-LinkCheck/1.0' } });
      const result = { url, status: response.status, finalUrl: response.url, reachable: response.ok };
      await response.body?.cancel();
      results.push(result);
      console.log(`${response.status} ${url}`);
    } catch (error) { results.push({ url, reachable: false, error: String(error) }); console.log(`UNCONFIRMED ${url}: ${error.message}`); }
  }
}
await Promise.all(Array.from({ length: 5 }, worker));
await writeFile('external-link-report.json', JSON.stringify({ checkedAt: new Date().toISOString(), note: 'Reachability only; HTTP success does not independently verify offer terms.', results }, null, 2));
console.log(`Checked ${results.length} external URLs; ${results.filter(r => !r.reachable).length} need manual confirmation. See external-link-report.json.`);
