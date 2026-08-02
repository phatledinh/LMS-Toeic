-- Demo listening tests for the client "De thi online" flow.
-- Audio URLs are left empty so the client can use browser TTS from the transcript.
-- Replace audio_url with uploaded MP3 paths later for production-quality listening.

SET @demo_section_id = (SELECT id FROM sections WHERE slug = 'de-thi-online-toeic-demo' LIMIT 1);

INSERT INTO topics (section_id, title, slug, description, order_index, is_active)
SELECT @demo_section_id,
       'Mini Test 1 - Part 1',
       'demo-online-test-1-part-1',
       'Photographs demo',
       4,
       TRUE
WHERE @demo_section_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM topics WHERE slug = 'demo-online-test-1-part-1'
);

INSERT INTO topics (section_id, title, slug, description, order_index, is_active)
SELECT @demo_section_id,
       'Mini Test 1 - Part 2',
       'demo-online-test-1-part-2',
       'Question-Response demo',
       5,
       TRUE
WHERE @demo_section_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM topics WHERE slug = 'demo-online-test-1-part-2'
);

INSERT INTO topics (section_id, title, slug, description, order_index, is_active)
SELECT @demo_section_id,
       'Mini Test 1 - Part 3',
       'demo-online-test-1-part-3',
       'Conversations demo',
       6,
       TRUE
WHERE @demo_section_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM topics WHERE slug = 'demo-online-test-1-part-3'
);

INSERT INTO topics (section_id, title, slug, description, order_index, is_active)
SELECT @demo_section_id,
       'Mini Test 1 - Part 4',
       'demo-online-test-1-part-4',
       'Talks demo',
       7,
       TRUE
WHERE @demo_section_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM topics WHERE slug = 'demo-online-test-1-part-4'
);

SET @part1_topic_id = (SELECT id FROM topics WHERE slug = 'demo-online-test-1-part-1' LIMIT 1);
SET @part2_topic_id = (SELECT id FROM topics WHERE slug = 'demo-online-test-1-part-2' LIMIT 1);
SET @part3_topic_id = (SELECT id FROM topics WHERE slug = 'demo-online-test-1-part-3' LIMIT 1);
SET @part4_topic_id = (SELECT id FROM topics WHERE slug = 'demo-online-test-1-part-4' LIMIT 1);

INSERT INTO exercises (topic_id, exercise_type, total_questions, order_index, is_active)
SELECT @part1_topic_id, 'LISTENING_PART1', 1, 1, TRUE
WHERE @part1_topic_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM exercises WHERE topic_id = @part1_topic_id AND exercise_type = 'LISTENING_PART1'
);

INSERT INTO exercises (topic_id, exercise_type, total_questions, order_index, is_active)
SELECT @part2_topic_id, 'LISTENING_PART2', 1, 1, TRUE
WHERE @part2_topic_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM exercises WHERE topic_id = @part2_topic_id AND exercise_type = 'LISTENING_PART2'
);

INSERT INTO exercises (topic_id, exercise_type, total_questions, order_index, is_active)
SELECT @part3_topic_id, 'LISTENING_PART3', 3, 1, TRUE
WHERE @part3_topic_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM exercises WHERE topic_id = @part3_topic_id AND exercise_type = 'LISTENING_PART3'
);

INSERT INTO exercises (topic_id, exercise_type, total_questions, order_index, is_active)
SELECT @part4_topic_id, 'LISTENING_PART4', 3, 1, TRUE
WHERE @part4_topic_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM exercises WHERE topic_id = @part4_topic_id AND exercise_type = 'LISTENING_PART4'
);

SET @part1_exercise_id = (
    SELECT id FROM exercises WHERE topic_id = @part1_topic_id AND exercise_type = 'LISTENING_PART1' LIMIT 1
);
SET @part2_exercise_id = (
    SELECT id FROM exercises WHERE topic_id = @part2_topic_id AND exercise_type = 'LISTENING_PART2' LIMIT 1
);
SET @part3_exercise_id = (
    SELECT id FROM exercises WHERE topic_id = @part3_topic_id AND exercise_type = 'LISTENING_PART3' LIMIT 1
);
SET @part4_exercise_id = (
    SELECT id FROM exercises WHERE topic_id = @part4_topic_id AND exercise_type = 'LISTENING_PART4' LIMIT 1
);

INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, image_url, passage)
SELECT @part1_exercise_id,
       1,
       '',
       '',
       'Transcript
A. A man is arranging documents on a desk.
B. A woman is opening a car door.
C. Several people are waiting at a ticket counter.
D. A worker is repairing a streetlight.'
WHERE @part1_exercise_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM exercise_question_groups WHERE exercise_id = @part1_exercise_id AND order_index = 1
);

SET @part1_group_id = (
    SELECT id FROM exercise_question_groups WHERE exercise_id = @part1_exercise_id AND order_index = 1 LIMIT 1
);

INSERT INTO exercise_questions
(exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part1_exercise_id, @part1_group_id, 1,
       'Look at the picture and choose the statement that best describes it.',
       'A man is arranging documents on a desk.',
       'A woman is opening a car door.',
       'Several people are waiting at a ticket counter.',
       'A worker is repairing a streetlight.',
       'A',
       'The correct statement describes a man arranging documents on a desk.'
WHERE @part1_group_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part1_exercise_id AND question_number = 1
);

INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, passage)
SELECT @part2_exercise_id,
       1,
       '',
       'Transcript
Where can I find the meeting schedule?
A. It is posted near the reception desk.
B. About thirty minutes.
C. No, I have not met him yet.'
WHERE @part2_exercise_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM exercise_question_groups WHERE exercise_id = @part2_exercise_id AND order_index = 1
);

SET @part2_group_id = (
    SELECT id FROM exercise_question_groups WHERE exercise_id = @part2_exercise_id AND order_index = 1 LIMIT 1
);

INSERT INTO exercise_questions
(exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part2_exercise_id, @part2_group_id, 1,
       'Where can I find the meeting schedule?',
       'It is posted near the reception desk.',
       'About thirty minutes.',
       'No, I have not met him yet.',
       NULL,
       'A',
       'The question asks for a location, so the response about the reception desk is correct.'
WHERE @part2_group_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part2_exercise_id AND question_number = 1
);

INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, passage)
SELECT @part3_exercise_id,
       1,
       '',
       'Transcript
Woman: Hi, I am calling about the training session scheduled for Friday morning.
Man: It has been moved to Conference Room B because the main hall is being cleaned.
Woman: Thanks. Should I bring the printed workbook?
Man: No, the instructor will provide new copies when everyone arrives.

---

Dich nghia
Nguoi phu nu goi hoi ve buoi dao tao sang thu Sau. Nguoi dan ong noi buoi hoc da duoc chuyen sang phong hop B va khong can mang workbook in san.'
WHERE @part3_exercise_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM exercise_question_groups WHERE exercise_id = @part3_exercise_id AND order_index = 1
);

SET @part3_group_id = (
    SELECT id FROM exercise_question_groups WHERE exercise_id = @part3_exercise_id AND order_index = 1 LIMIT 1
);

INSERT INTO exercise_questions
(exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part3_exercise_id, @part3_group_id, 1,
       'What is the woman calling about?',
       'A training session', 'A job interview', 'A hotel reservation', 'A product delivery',
       'A',
       'She says she is calling about the training session scheduled for Friday morning.'
WHERE @part3_group_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part3_exercise_id AND question_number = 1
);

INSERT INTO exercise_questions
(exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part3_exercise_id, @part3_group_id, 2,
       'Where will the event take place?',
       'In Conference Room B', 'In the main hall', 'At a reception desk', 'At a downtown hotel',
       'A',
       'The man says it has been moved to Conference Room B.'
WHERE @part3_group_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part3_exercise_id AND question_number = 2
);

INSERT INTO exercise_questions
(exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part3_exercise_id, @part3_group_id, 3,
       'What does the man say about the workbook?',
       'New copies will be provided.', 'It must be purchased online.', 'It was left in the main hall.', 'It should be sent by email.',
       'A',
       'The instructor will provide new copies when everyone arrives.'
WHERE @part3_group_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part3_exercise_id AND question_number = 3
);

INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, passage)
SELECT @part4_exercise_id,
       1,
       '',
       'Transcript
Good afternoon, passengers. This is an announcement for train 428 to Central Station. The train will now depart from platform six instead of platform four. Boarding will begin in approximately ten minutes. Please keep your tickets ready for inspection and listen for further updates from station staff.

---

Dich nghia
Thong bao cho hanh khach di tau 428 den Central Station. Tau se khoi hanh tu san ga so sau thay vi san ga so bon, va viec len tau bat dau sau khoang muoi phut.'
WHERE @part4_exercise_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM exercise_question_groups WHERE exercise_id = @part4_exercise_id AND order_index = 1
);

SET @part4_group_id = (
    SELECT id FROM exercise_question_groups WHERE exercise_id = @part4_exercise_id AND order_index = 1 LIMIT 1
);

INSERT INTO exercise_questions
(exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part4_exercise_id, @part4_group_id, 1,
       'Who is the announcement for?',
       'Train passengers', 'Hotel guests', 'Office employees', 'Restaurant customers',
       'A',
       'The announcement begins by addressing passengers.'
WHERE @part4_group_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part4_exercise_id AND question_number = 1
);

INSERT INTO exercise_questions
(exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part4_exercise_id, @part4_group_id, 2,
       'What has changed?',
       'The departure platform', 'The ticket price', 'The final destination', 'The inspection policy',
       'A',
       'The train will depart from platform six instead of platform four.'
WHERE @part4_group_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part4_exercise_id AND question_number = 2
);

INSERT INTO exercise_questions
(exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part4_exercise_id, @part4_group_id, 3,
       'What are passengers asked to do?',
       'Keep their tickets ready', 'Move to platform four', 'Call the station office', 'Cancel their reservations',
       'A',
       'Passengers are asked to keep their tickets ready for inspection.'
WHERE @part4_group_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part4_exercise_id AND question_number = 3
);
