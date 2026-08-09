-- Use an external image URL for the demo Listening Part 1 question.
-- Frontend keeps absolute http/https URLs unchanged, so the image is read directly from this link.

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
SET image_url = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80'
WHERE exercise_id = @part1_exercise_id
  AND order_index = 1;
