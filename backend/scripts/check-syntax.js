import { spawnSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const ignored = new Set(['node_modules', 'uploads']);
const files = [];

function collectJsFiles(directory) {
  for (const entry of readdirSync(directory)) {
    if (ignored.has(entry)) continue;

    const fullPath = join(directory, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      collectJsFiles(fullPath);
    } else if (entry.endsWith('.js')) {
      files.push(fullPath);
    }
  }
}

collectJsFiles(root);

for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

console.log(`Syntax check passed for ${files.length} backend JavaScript files.`);
