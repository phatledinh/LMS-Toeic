-- Add image links for Listening Part 1 demo questions.
-- The DB stores only the link; the image file is served by Spring Boot static resources.

SET @part1_topic_id = (
    SELECT id FROM topics WHERE slug = 'demo-online-test-1-part-1' LIMIT 1
);

SET @part1_exercise_id = (
    SELECT id FROM exercises
    WHERE topic_id = @part1_topic_id
      AND exercise_type = 'LISTENING_PART1'
    LIMIT 1
);

UPDATE exercise_question_groups
SET image_url = '/demo-assets/listening-part1-office.svg'
WHERE exercise_id = @part1_exercise_id
  AND order_index = 1;
