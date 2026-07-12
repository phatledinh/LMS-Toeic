const fs = require('fs');
const file = 'c:/Project/LMS Toeic/backend/src/main/resources/db/migration/V3__consolidated_course_data.sql';
let content = fs.readFileSync(file, 'utf8');

const vocabRegex = /-- Bảng decks \(bộ flashcard\)[\s\S]*?(?=\n-- ==========================================\r?\n-- Original File: V10__insert_lessons_part1\.sql)/;
content = content.replace(vocabRegex, '');

const headerRegex = /video_url,\s*doc_url,\s*doc_file_name,\s*/g;
content = content.replace(headerRegex, '');

const valuesRegex = /('[^']*'),\s*'.*?',\s*'.*?',\s*'.*?',\s*(\d+)/g;
content = content.replace(valuesRegex, "$1,\n        $2");

fs.writeFileSync(file, content);
console.log('Done');
