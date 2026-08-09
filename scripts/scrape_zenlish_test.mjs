import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const [,, htmlPath, outDirArg] = process.argv;

if (!htmlPath || !outDirArg) {
  console.error('Usage: node scripts/scrape_zenlish_test.mjs <raw-html> <out-dir>');
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, 'utf8');
const outDir = path.resolve(outDirArg);
fs.mkdirSync(outDir, { recursive: true });

function extractExpression(variableName) {
  const marker = `let ${variableName} = `;
  const start = html.indexOf(marker);
  if (start === -1) {
    throw new Error(`Could not find ${variableName}`);
  }

  let index = start + marker.length;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let escaped = false;
  let parenDepth = 0;

  for (; index < html.length; index += 1) {
    const char = html[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (!inDouble && !inTemplate && char === "'") {
      inSingle = !inSingle;
      continue;
    }

    if (!inSingle && !inTemplate && char === '"') {
      inDouble = !inDouble;
      continue;
    }

    if (!inSingle && !inDouble && char === '`') {
      inTemplate = !inTemplate;
      continue;
    }

    if (inSingle || inDouble || inTemplate) {
      continue;
    }

    if (char === '(') parenDepth += 1;
    if (char === ')') parenDepth -= 1;

    if (char === ';' && parenDepth === 0) {
      return html.slice(start + marker.length, index);
    }
  }

  throw new Error(`Could not parse expression for ${variableName}`);
}

function evaluateExpression(variableName) {
  const expression = extractExpression(variableName);
  return vm.runInNewContext(expression, {}, { timeout: 1000 });
}

function stripHtml(value) {
  if (!value) return '';
  return String(value)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '-')
    .replace(/&#8217;/g, "'")
    .replace(/&#038;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractMediaUrls(...values) {
  const urls = new Set();
  for (const value of values) {
    if (!value) continue;
    const text = String(value)
      .replace(/&quot;/g, '"')
      .replace(/&#038;/g, '&')
      .replace(/&amp;/g, '&');
    for (const match of text.matchAll(/https?:\/\/[^"'\s<>]+/g)) {
      urls.add(match[0]);
    }
  }
  return [...urls];
}

const testId = evaluateExpression('$testID');
const duration = evaluateExpression('$testDuration');
const durationMeasure = evaluateExpression('$testDurationMeasure');
const parts = JSON.parse(evaluateExpression('$testParts'));

let questionCount = 0;
const flatQuestions = [];
const answerKey = [];
const mediaUrls = new Set();

for (const part of parts) {
  if (part.term_audio) mediaUrls.add(part.term_audio);
  for (const question of part.questions ?? []) {
    if (question.audio_url) mediaUrls.add(question.audio_url);
    extractMediaUrls(part.term_desc, question.content).forEach((url) => mediaUrls.add(url));

    for (const subQuestion of question.sub_questions ?? []) {
      questionCount += 1;
      const choices = (subQuestion.answer ?? []).map((choice) => ({
        choice: choice.choice,
        text: choice.choice_answer,
        is_correct: Boolean(choice.choice_right_answer),
      }));
      const correctChoices = choices.filter((choice) => choice.is_correct).map((choice) => choice.choice);

      flatQuestions.push({
        index: questionCount,
        part: part.term_name,
        part_type: part.term_type,
        group_title: question.title,
        question_id: question.question_id,
        sub_question_title: subQuestion.title,
        content_html: question.content,
        content_text: stripHtml(question.content),
        audio_url: question.audio_url || null,
        choices,
        correct_choices: correctChoices,
        explanation_html: subQuestion.explanation || '',
        explanation_text: stripHtml(subQuestion.explanation),
      });

      answerKey.push({
        index: questionCount,
        part: part.term_name,
        answer: correctChoices.join(','),
      });
    }
  }
}

const normalized = {
  source_url: 'https://zenlishtoeic.vn/stm-quizzes/test-2-2026/',
  scraped_at: new Date().toISOString(),
  test_id: testId,
  title: 'TEST 2 - 2026',
  duration,
  duration_measure: durationMeasure,
  parts_count: parts.length,
  question_count: questionCount,
  parts,
  flat_questions: flatQuestions,
  answer_key: answerKey,
  media_urls: [...mediaUrls],
};

const markdown = [
  '# TEST 2 - 2026',
  '',
  `Source: ${normalized.source_url}`,
  `Test ID: ${testId}`,
  `Duration: ${duration} ${durationMeasure}`,
  `Parts: ${parts.length}`,
  `Questions: ${questionCount}`,
  '',
  '## Answer Key',
  '',
  '| # | Part | Answer |',
  '|---:|---|---|',
  ...answerKey.map((item) => `| ${item.index} | ${item.part} | ${item.answer} |`),
  '',
  '## Questions',
  '',
  ...flatQuestions.flatMap((question) => [
    `### ${question.index}. ${question.part} - ${question.group_title}`,
    '',
    question.content_text ? `${question.content_text}\n` : '',
    question.audio_url ? `Audio: ${question.audio_url}\n` : '',
    ...question.choices.map((choice) => `- ${choice.choice}. ${choice.text}${choice.is_correct ? ' [correct]' : ''}`),
    '',
    question.explanation_text ? `Explanation:\n${question.explanation_text}` : '',
    '',
  ]),
].join('\n');

fs.writeFileSync(path.join(outDir, 'test-2-2026.raw-parts.json'), JSON.stringify(parts, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'test-2-2026.normalized.json'), JSON.stringify(normalized, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'test-2-2026.questions.json'), JSON.stringify(flatQuestions, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'test-2-2026.answer-key.json'), JSON.stringify(answerKey, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'test-2-2026.media-urls.txt'), `${[...mediaUrls].join('\n')}\n`, 'utf8');
fs.writeFileSync(path.join(outDir, 'test-2-2026.md'), markdown, 'utf8');

console.log(JSON.stringify({
  test_id: testId,
  parts: parts.length,
  questions: questionCount,
  media_urls: mediaUrls.size,
  out_dir: outDir,
}, null, 2));
