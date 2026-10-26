import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';

const root = resolve('dist');
const files = [];
async function walk(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, item.name);
    if (item.isDirectory()) await walk(path);
    else if (path.endsWith('.html')) files.push(path);
  }
}
await walk(root);
const failures = [];
let checked = 0;
for (const file of files) {
  const html = await readFile(file, 'utf8');
  for (const [, href] of html.matchAll(/(?:href|src)="([^"]*)"/g)) {
    if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(href)) continue;
    const [pathname, hash] = href.split('#');
    const path = pathname.split('?')[0];
    const target = !path ? file : path.startsWith('/') ? resolve(root, `.${decodeURIComponent(path)}`) : resolve(dirname(file), decodeURIComponent(path));
    let resource = target;
    try {
      if ((await stat(target)).isDirectory()) resource = join(target, 'index.html');
      await stat(resource);
      if (hash && resource.endsWith('.html')) {
        const content = resource === file ? html : await readFile(resource, 'utf8');
        if (!content.includes(`id="${decodeURIComponent(hash)}"`)) failures.push(`${file}: missing anchor ${href}`);
      }
    } catch { failures.push(`${file}: missing resource ${href}`); }
    checked++;
  }
  if (!html.includes('<html lang="en"')) failures.push(`${file}: missing English language`);
  if ((html.match(/<h1(?:\s|>)/g) ?? []).length !== 1) failures.push(`${file}: expected exactly one h1`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) failures.push(`${file}: missing description`);
}
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Validated ${files.length} HTML pages and ${checked} internal links/assets/anchors. No broken routes.`);
