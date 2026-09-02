-- Demo online TOEIC-style tests for the client "De thi online" flow.
-- Questions are original sample content for local demonstration.

INSERT INTO sections (title, slug, description, order_index, is_active)
SELECT 'De thi online TOEIC Demo',
       'de-thi-online-toeic-demo',
       'Bo de demo dung de chay thu giao dien thi truc tuyen',
       99,
       TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM sections WHERE slug = 'de-thi-online-toeic-demo'
);

SET @demo_section_id = (SELECT id FROM sections WHERE slug = 'de-thi-online-toeic-demo' LIMIT 1);

INSERT INTO topics (section_id, title, slug, description, order_index, is_active)
SELECT @demo_section_id,
       'Mini Test 1 - Part 5',
       'demo-online-test-1-part-5',
       'Incomplete Sentences demo',
       1,
       TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE slug = 'demo-online-test-1-part-5'
);

INSERT INTO topics (section_id, title, slug, description, order_index, is_active)
SELECT @demo_section_id,
       'Mini Test 1 - Part 6',
       'demo-online-test-1-part-6',
       'Text Completion demo',
       2,
       TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE slug = 'demo-online-test-1-part-6'
);

INSERT INTO topics (section_id, title, slug, description, order_index, is_active)
SELECT @demo_section_id,
       'Mini Test 1 - Part 7',
       'demo-online-test-1-part-7',
       'Reading Comprehension demo',
       3,
       TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE slug = 'demo-online-test-1-part-7'
);

SET @part5_topic_id = (SELECT id FROM topics WHERE slug = 'demo-online-test-1-part-5' LIMIT 1);
SET @part6_topic_id = (SELECT id FROM topics WHERE slug = 'demo-online-test-1-part-6' LIMIT 1);
SET @part7_topic_id = (SELECT id FROM topics WHERE slug = 'demo-online-test-1-part-7' LIMIT 1);

INSERT INTO exercises (topic_id, exercise_type, total_questions, order_index, is_active)
SELECT @part5_topic_id, 'READING_PART5', 8, 1, TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE topic_id = @part5_topic_id AND exercise_type = 'READING_PART5'
);

INSERT INTO exercises (topic_id, exercise_type, total_questions, order_index, is_active)
SELECT @part6_topic_id, 'READING_PART6', 4, 1, TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE topic_id = @part6_topic_id AND exercise_type = 'READING_PART6'
);

INSERT INTO exercises (topic_id, exercise_type, total_questions, order_index, is_active)
SELECT @part7_topic_id, 'READING_PART7', 4, 1, TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE topic_id = @part7_topic_id AND exercise_type = 'READING_PART7'
);

SET @part5_exercise_id = (
    SELECT id FROM exercises WHERE topic_id = @part5_topic_id AND exercise_type = 'READING_PART5' LIMIT 1
);
SET @part6_exercise_id = (
    SELECT id FROM exercises WHERE topic_id = @part6_topic_id AND exercise_type = 'READING_PART6' LIMIT 1
);
SET @part7_exercise_id = (
    SELECT id FROM exercises WHERE topic_id = @part7_topic_id AND exercise_type = 'READING_PART7' LIMIT 1
);

INSERT INTO exercise_questions
(exercise_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part5_exercise_id, 1,
       'The quarterly sales report must be submitted _____ Friday afternoon.',
       'by', 'during', 'until', 'among',
       'A',
       'Use "by" for a deadline.'
WHERE NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part5_exercise_id AND question_number = 1
);

INSERT INTO exercise_questions
(exercise_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part5_exercise_id, 2,
       'All employees are required to wear their identification badges while _____ the building.',
       'enter', 'entered', 'entering', 'entry',
       'C',
       'After "while", the -ing form can describe an ongoing action.'
WHERE NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part5_exercise_id AND question_number = 2
);

INSERT INTO exercise_questions
(exercise_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part5_exercise_id, 3,
       'The new software update is expected to improve system _____ significantly.',
       'perform', 'performer', 'performance', 'performed',
       'C',
       'A noun is needed after "system".'
WHERE NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part5_exercise_id AND question_number = 3
);

INSERT INTO exercise_questions
(exercise_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part5_exercise_id, 4,
       'Please contact the front desk if you have _____ questions about your reservation.',
       'any', 'few', 'each', 'another',
       'A',
       '"Any questions" is the natural phrase in this context.'
WHERE NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part5_exercise_id AND question_number = 4
);

INSERT INTO exercise_questions
(exercise_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part5_exercise_id, 5,
       'The marketing team will meet tomorrow to discuss the _____ campaign.',
       'propose', 'proposed', 'proposal', 'proposing',
       'B',
       'An adjective is needed before "campaign".'
WHERE NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part5_exercise_id AND question_number = 5
);

INSERT INTO exercise_questions
(exercise_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part5_exercise_id, 6,
       'Because the shipment was delayed, the manager _____ the delivery schedule.',
       'revised', 'revision', 'revising', 'revises',
       'A',
       'The sentence describes a completed past action.'
WHERE NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part5_exercise_id AND question_number = 6
);

INSERT INTO exercise_questions
(exercise_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part5_exercise_id, 7,
       'The conference room is large enough to _____ up to eighty participants.',
       'accommodate', 'accommodation', 'accommodating', 'accommodated',
       'A',
       '"To" is followed by the base form of the verb.'
WHERE NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part5_exercise_id AND question_number = 7
);

INSERT INTO exercise_questions
(exercise_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part5_exercise_id, 8,
       'The finance department reviews expense reports _____ than any other department.',
       'careful', 'carefully', 'more carefully', 'most careful',
       'C',
       '"Than" signals a comparative adverb.'
WHERE NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part5_exercise_id AND question_number = 8
);

INSERT INTO exercise_question_groups (exercise_id, order_index, passage)
SELECT @part6_exercise_id,
       1,
       'To: All Staff\nFrom: Human Resources\nSubject: Office Relocation\n\nOur main office will move to the Greenview Business Center next month. The new location is closer to the train station and offers additional meeting rooms. Employees will receive updated access cards before the move. Please pack personal items by March 25. The facilities team will provide labeled boxes and instructions. If you have special equipment that requires careful handling, contact HR by the end of this week.'
WHERE NOT EXISTS (
    SELECT 1 FROM exercise_question_groups WHERE exercise_id = @part6_exercise_id AND order_index = 1
);

SET @part6_group_id = (
    SELECT id FROM exercise_question_groups WHERE exercise_id = @part6_exercise_id AND order_index = 1 LIMIT 1
);

INSERT INTO exercise_questions
(exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part6_exercise_id, @part6_group_id, 1,
       'What is the purpose of the notice?',
       'To announce an office move', 'To request a budget report', 'To introduce a new manager', 'To cancel a meeting',
       'A',
       'The memo explains that the main office will move next month.'
WHERE NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part6_exercise_id AND question_number = 1
);

INSERT INTO exercise_questions
(exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part6_exercise_id, @part6_group_id, 2,
       'What is mentioned about the new location?',
       'It has a larger cafeteria.', 'It is closer to public transportation.', 'It is in another country.', 'It requires visitor passes.',
       'B',
       'The passage says the location is closer to the train station.'
WHERE NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part6_exercise_id AND question_number = 2
);

INSERT INTO exercise_questions
(exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part6_exercise_id, @part6_group_id, 3,
       'When should employees pack personal items?',
       'By March 25', 'By the end of April', 'Before the next staff meeting', 'After receiving invoices',
       'A',
       'The notice states that personal items should be packed by March 25.'
WHERE NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part6_exercise_id AND question_number = 3
);

INSERT INTO exercise_questions
(exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part6_exercise_id, @part6_group_id, 4,
       'Who should contact HR?',
       'Employees with special equipment', 'New clients visiting the office', 'Train station staff', 'Building security guards',
       'A',
       'Employees with special equipment are asked to contact HR.'
WHERE NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part6_exercise_id AND question_number = 4
);

INSERT INTO exercise_question_groups (exercise_id, order_index, passage)
SELECT @part7_exercise_id,
       1,
       'Riverdale Catering\nCustomer Notice\n\nBeginning June 1, Riverdale Catering will offer a new online ordering system for corporate lunches and private events. Customers may select menus, confirm delivery times, and upload guest lists directly through the website. Orders placed at least three business days in advance will receive a 10 percent discount. For urgent requests, customers should call the sales office before 10:00 A.M. Same-day orders cannot be guaranteed during weekends or holidays.'
WHERE NOT EXISTS (
    SELECT 1 FROM exercise_question_groups WHERE exercise_id = @part7_exercise_id AND order_index = 1
);

SET @part7_group_id = (
    SELECT id FROM exercise_question_groups WHERE exercise_id = @part7_exercise_id AND order_index = 1 LIMIT 1
);

INSERT INTO exercise_questions
(exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part7_exercise_id, @part7_group_id, 1,
       'What is being introduced?',
       'A new online ordering system', 'A weekend cooking class', 'A delivery fee increase', 'A restaurant branch',
       'A',
       'The notice announces a new online ordering system.'
WHERE NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part7_exercise_id AND question_number = 1
);

INSERT INTO exercise_questions
(exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part7_exercise_id, @part7_group_id, 2,
       'What can customers upload through the website?',
       'Payment receipts', 'Guest lists', 'Kitchen photos', 'Employee schedules',
       'B',
       'The website lets customers upload guest lists.'
WHERE NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part7_exercise_id AND question_number = 2
);

INSERT INTO exercise_questions
(exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part7_exercise_id, @part7_group_id, 3,
       'How can customers receive a discount?',
       'By ordering three business days in advance', 'By picking up meals in person', 'By joining a training session', 'By paying in cash',
       'A',
       'Orders placed at least three business days ahead receive 10 percent off.'
WHERE NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part7_exercise_id AND question_number = 3
);

INSERT INTO exercise_questions
(exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT @part7_exercise_id, @part7_group_id, 4,
       'What should customers do for urgent requests?',
       'Call the sales office before 10:00 A.M.', 'Send a package to headquarters', 'Visit the kitchen after lunch', 'Wait until the next holiday',
       'A',
       'Urgent requests should be made by calling the sales office before 10:00 A.M.'
WHERE NOT EXISTS (
    SELECT 1 FROM exercise_questions WHERE exercise_id = @part7_exercise_id AND question_number = 4
);
