-- Normalize TOEIC online-test part order for existing data.
-- Some rows were edited through the admin UI before the part order was locked.

UPDATE topics topic
JOIN exercises exercise ON exercise.topic_id = topic.id
JOIN sections section ON section.id = topic.section_id
SET topic.order_index = CASE exercise.exercise_type
    WHEN 'LISTENING_PART1' THEN 1
    WHEN 'LISTENING_PART2' THEN 2
    WHEN 'LISTENING_PART3' THEN 3
    WHEN 'LISTENING_PART4' THEN 4
    WHEN 'READING_PART5' THEN 5
    WHEN 'READING_PART6' THEN 6
    WHEN 'READING_PART7' THEN 7
    ELSE topic.order_index
END
WHERE (
        LOWER(COALESCE(section.slug, '')) LIKE '%online%'
        OR LOWER(COALESCE(section.slug, '')) LIKE '%test-%'
        OR LOWER(COALESCE(section.title, '')) LIKE '%test%'
        OR LOWER(COALESCE(section.description, '')) LIKE '%[online_test]%'
    )
  AND exercise.exercise_type IN (
        'LISTENING_PART1',
        'LISTENING_PART2',
        'LISTENING_PART3',
        'LISTENING_PART4',
        'READING_PART5',
        'READING_PART6',
        'READING_PART7'
    );

UPDATE exercises exercise
JOIN topics topic ON topic.id = exercise.topic_id
JOIN sections section ON section.id = topic.section_id
SET exercise.order_index = CASE exercise.exercise_type
    WHEN 'LISTENING_PART1' THEN 1
    WHEN 'LISTENING_PART2' THEN 2
    WHEN 'LISTENING_PART3' THEN 3
    WHEN 'LISTENING_PART4' THEN 4
    WHEN 'READING_PART5' THEN 5
    WHEN 'READING_PART6' THEN 6
    WHEN 'READING_PART7' THEN 7
    ELSE exercise.order_index
END
WHERE (
        LOWER(COALESCE(section.slug, '')) LIKE '%online%'
        OR LOWER(COALESCE(section.slug, '')) LIKE '%test-%'
        OR LOWER(COALESCE(section.title, '')) LIKE '%test%'
        OR LOWER(COALESCE(section.description, '')) LIKE '%[online_test]%'
    )
  AND exercise.exercise_type IN (
        'LISTENING_PART1',
        'LISTENING_PART2',
        'LISTENING_PART3',
        'LISTENING_PART4',
        'READING_PART5',
        'READING_PART6',
        'READING_PART7'
    );
