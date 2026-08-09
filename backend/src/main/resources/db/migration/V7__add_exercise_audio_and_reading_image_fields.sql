SET @sql := IF(
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'exercises' AND column_name = 'full_audio_url'),
    'SELECT 1',
    'ALTER TABLE exercises ADD COLUMN full_audio_url VARCHAR(500)'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := IF(
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'exercises' AND column_name = 'audio_duration_ms'),
    'SELECT 1',
    'ALTER TABLE exercises ADD COLUMN audio_duration_ms INT'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := IF(
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'exercises' AND column_name = 'audio_version'),
    'SELECT 1',
    'ALTER TABLE exercises ADD COLUMN audio_version VARCHAR(100)'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := IF(
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'exercises' AND column_name = 'reading_image_mode'),
    'SELECT 1',
    'ALTER TABLE exercises ADD COLUMN reading_image_mode VARCHAR(50)'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := IF(
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'exercises' AND column_name = 'reading_image_url'),
    'SELECT 1',
    'ALTER TABLE exercises ADD COLUMN reading_image_url VARCHAR(500)'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := IF(
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'exercises' AND column_name = 'reading_image_urls'),
    'SELECT 1',
    'ALTER TABLE exercises ADD COLUMN reading_image_urls TEXT'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := IF(
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'exercise_question_groups' AND column_name = 'audio_start_ms'),
    'SELECT 1',
    'ALTER TABLE exercise_question_groups ADD COLUMN audio_start_ms INT'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := IF(
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'exercise_question_groups' AND column_name = 'audio_end_ms'),
    'SELECT 1',
    'ALTER TABLE exercise_question_groups ADD COLUMN audio_end_ms INT'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := IF(
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'exercise_question_groups' AND column_name = 'timeline_label'),
    'SELECT 1',
    'ALTER TABLE exercise_question_groups ADD COLUMN timeline_label VARCHAR(255)'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := IF(
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'exercise_questions' AND column_name = 'audio_start_ms'),
    'SELECT 1',
    'ALTER TABLE exercise_questions ADD COLUMN audio_start_ms INT'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := IF(
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'exercise_questions' AND column_name = 'audio_end_ms'),
    'SELECT 1',
    'ALTER TABLE exercise_questions ADD COLUMN audio_end_ms INT'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
