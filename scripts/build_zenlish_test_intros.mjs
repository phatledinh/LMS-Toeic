import fs from 'node:fs';

const inputPath = 'scraped-data/zenlish-test-2-2026/test-2-2026.raw-parts.json';
const outputPath = 'frontend/client/src/data/zenlishTestIntros.js';

const parts = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const typeByPart = {
  'Part 1': 'LISTENING_PART1',
  'Part 2': 'LISTENING_PART2',
  'Part 3': 'LISTENING_PART3',
  'Part 4': 'LISTENING_PART4',
  'Part 5': 'READING_PART5',
  'Part 6': 'READING_PART6',
  'Part 7': 'READING_PART7',
};

function decodeHtml(value) {
  if (!value) return '';
  return String(value)
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '-')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

const intros = {};

for (const part of parts) {
  const type = typeByPart[part.term_name];
  if (!type) continue;

  intros[type] = {
    title: part.term_name,
    html: decodeHtml(part.term_desc || ''),
    audioUrl: part.term_audio || null,
  };
}

const output = [
  '// Generated from scraped-data/zenlish-test-2-2026/test-2-2026.raw-parts.json',
  '// Run: node scripts/build_zenlish_test_intros.mjs',
  '',
  `export const ZENLISH_TEST_2_INTROS = ${JSON.stringify(intros, null, 2)};`,
  '',
].join('\n');

fs.mkdirSync('frontend/client/src/data', { recursive: true });
fs.writeFileSync(outputPath, output, 'utf8');
console.log(outputPath);
