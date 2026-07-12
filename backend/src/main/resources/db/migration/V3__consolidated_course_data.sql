SET FOREIGN_KEY_CHECKS=0;
-- ==========================================
-- Original File: V3__insert_sections_data.sql
-- ==========================================
-- =====================================================
-- V3__insert_sections_data.sql
-- Thêm dữ liệu mặc định cho bảng sections
-- =====================================================

INSERT INTO sections (title, slug, description, order_index, is_active) VALUES
('Từ vựng TOEIC', 'tu-vung-toeic', 'Tổng hợp từ vựng thường gặp trong bài thi TOEIC', 1, TRUE),
('Ngữ pháp TOEIC', 'ngu-phap-toeic', 'Hệ thống các chủ điểm ngữ pháp trọng tâm TOEIC', 2, TRUE),
('Part 1: Photographs - Nghe tranh', 'part-1-photographs-nghe-tranh', 'Luyện tập kỹ năng mô tả hình ảnh trong Part 1', 3, TRUE),
('Part 2: Question - Response - Hỏi - đáp', 'part-2-question-response-hoi-dap', 'Luyện tập trả lời các câu hỏi ngắn trong Part 2', 4, TRUE),
('Part 3: Conversations - Nghe hiểu đối thoại', 'part-3-conversations-nghe-hieu-doi-thoai', 'Luyện tập nghe hiểu các đoạn hội thoại trong Part 3', 5, TRUE),
('Part 4: Talks - Nghe hiểu bài nói', 'part-4-talks-nghe-hieu-bai-noi', 'Luyện tập nghe hiểu các bài nói ngắn trong Part 4', 6, TRUE),
('Part 5: Incomplete Sentences - Điền từ vào câu', 'part-5-incomplete-sentences-dien-tu-vao-cau', 'Luyện tập hoàn thành câu dựa trên ngữ pháp và từ vựng Part 5', 7, TRUE),
('Part 6: Text Completion - Điền từ vào đoạn văn', 'part-6-text-completion-dien-tu-vao-doan-van', 'Luyện tập hoàn thành đoạn văn Part 6', 8, TRUE),
('Part 7: Reading Comprehension - Đọc hiểu văn bản', 'part-7-reading-comprehension-doc-hieu-van-ban', 'Luyện kỹ năng đọc hiểu các văn bản khác nhau Part 7', 9, TRUE);


INSERT IGNORE INTO topics (section_id, title, slug, description, order_index, is_active) VALUES
(2, 'Kiến thức cơ bản 1: từ loại và cụm từ', 'kien-thuc-co-ban-1-tu-loai-va-cum-tu', 'Các khái niệm cơ bản về từ loại và cách hình thành cụm từ.', 1, TRUE),
(2, 'Kiến thức cơ bản 2: mệnh đề và câu', 'kien-thuc-co-ban-2-menh-de-va-cau', 'Cấu trúc mệnh đề và các loại câu cơ bản trong tiếng Anh.', 2, TRUE),
(2, 'Danh từ', 'danh-tu', 'Phân loại, vị trí và chức năng của danh từ trong câu.', 3, TRUE),
(2, 'Đại từ', 'dai-tu', 'Các loại đại từ nhân xưng, phản thân, chỉ định và cách sử dụng.', 4, TRUE),
(2, 'Tính từ', 'tinh-tu', 'Vị trí, chức năng và trật tự của tính từ.', 5, TRUE),
(2, 'Thì', 'thi', 'Tổng hợp các thì cơ bản và thường gặp nhất trong TOEIC.', 6, TRUE),
(2, 'Thể', 'the', 'Thể chủ động và bị động (Active and Passive Voice).', 7, TRUE),
(2, 'Động từ nguyên mẫu', 'dong-tu-nguyen-mau', 'Cách sử dụng Bare Infinitive (Động từ nguyên mẫu không to).', 8, TRUE),
(2, 'Động từ nguyên mẫu có ''to''', 'dong-tu-nguyen-mau-co-to', 'Cách sử dụng To-Infinitive (Động từ nguyên mẫu có to).', 9, TRUE),
(2, 'Danh động từ', 'danh-dong-tu', 'Cách sử dụng Gerund (V-ing) trong các trường hợp cụ thể.', 10, TRUE),
(2, 'Phân từ và cấu trúc phân từ', 'phan-tu-va-cau-truc-phan-tu', 'Hiện tại phân từ (V-ing) và Quá khứ phân từ (V-ed/V3).', 11, TRUE),
(2, 'Trạng từ', 'trang-tu', 'Phân loại, vị trí và chức năng của trạng từ trong câu.', 12, TRUE),
(2, 'Giới từ', 'gioi-tu', 'Cách sử dụng giới từ chỉ thời gian, nơi chốn và các cụm giới từ.', 13, TRUE),
(2, 'Liên từ', 'lien-tu', 'Liên từ kết hợp, liên từ tương quan và liên từ phụ thuộc.', 14, TRUE),
(2, 'Mệnh đề quan hệ', 'menh-de-quan-he', 'Mệnh đề quan hệ xác định, không xác định và rút gọn mệnh đề quan hệ.', 15, TRUE),
(2, 'Câu điều kiện', 'cau-dieu-kien', 'Câu điều kiện loại 1, 2, 3 và câu điều kiện hỗn hợp.', 16, TRUE),
(2, 'Cấu trúc phân từ', 'cau-truc-phan-tu', 'Bài tập nâng cao và các dạng đặc biệt của cấu trúc phân từ.', 17, TRUE),
(2, 'Cấu trúc so sánh', 'cau-truc-so-sanh', 'So sánh bằng, so sánh hơn và so sánh nhất.', 18, TRUE);

INSERT IGNORE INTO lessons (
    topic_id,
    title,
    slug,
    duration_minutes,
    order_index,
    is_active
)
VALUES
    -- Topic 1: Kiến thức cơ bản 1: từ loại và cụm từ
    ((SELECT id FROM topics WHERE slug = 'kien-thuc-co-ban-1-tu-loai-va-cum-tu'),
        'Kiến thức cơ bản 1: từ loại và cụm từ',
        'lesson-kien-thuc-co-ban-1-tu-loai-va-cum-tu',
        23,
        1,
        TRUE
    ),
    -- Topic 2: Kiến thức cơ bản 2: mệnh đề và câu
    ((SELECT id FROM topics WHERE slug = 'kien-thuc-co-ban-2-menh-de-va-cau'),
        'Kiến thức cơ bản 2: mệnh đề và câu',
        'lesson-kien-thuc-co-ban-2-menh-de-va-cau',
        20,
        1,
        TRUE
    ),
    -- Topic 3: Danh từ (2 bài học)
    ((SELECT id FROM topics WHERE slug = 'danh-tu'),
        'Phân loại Danh từ',
        'lesson-phan-loai-danh-tu',
        15,
        1,
        TRUE
    ),
    ((SELECT id FROM topics WHERE slug = 'danh-tu'),
        'Vị trí và chức năng của Danh từ',
        'lesson-vi-tri-va-chuc-nang-cua-danh-tu',
        20,
        2,
        TRUE
    ),
    -- Topic 4: Đại từ
    ((SELECT id FROM topics WHERE slug = 'dai-tu'),
        'Đại từ',
        'lesson-dai-tu',
        25,
        1,
        TRUE
    ),
    -- Topic 5: Tính từ
    ((SELECT id FROM topics WHERE slug = 'tinh-tu'),
        'Tính từ',
        'lesson-tinh-tu',
        20,
        1,
        TRUE
    ),
    -- Topic 6: Thì
    ((SELECT id FROM topics WHERE slug = 'thi'),
        'Thì',
        'lesson-thi',
        30,
        1,
        TRUE
    ),
    -- Topic 7: Thể
    ((SELECT id FROM topics WHERE slug = 'the'),
        'Thể',
        'lesson-the',
        15,
        1,
        TRUE
    ),
    -- Topic 8: Động từ nguyên mẫu
    ((SELECT id FROM topics WHERE slug = 'dong-tu-nguyen-mau'),
        'Động từ nguyên mẫu',
        'lesson-dong-tu-nguyen-mau',
        20,
        1,
        TRUE
    ),
    -- Topic 9: Động từ nguyên mẫu có ''to''
    ((SELECT id FROM topics WHERE slug = 'dong-tu-nguyen-mau-co-to'),
        'Động từ nguyên mẫu có to',
        'lesson-dong-tu-nguyen-mau-co-to',
        20,
        1,
        TRUE
    ),
    -- Topic 10: Danh động từ
    ((SELECT id FROM topics WHERE slug = 'danh-dong-tu'),
        'Danh động từ',
        'lesson-danh-dong-tu',
        25,
        1,
        TRUE
    ),
    -- Topic 11: Phân từ và cấu trúc phân từ
    ((SELECT id FROM topics WHERE slug = 'phan-tu-va-cau-truc-phan-tu'),
        'Phân từ và cấu trúc phân từ',
        'lesson-phan-tu-va-cau-truc-phan-tu',
        25,
        1,
        TRUE
    ),
    -- Topic 12: Trạng từ
    ((SELECT id FROM topics WHERE slug = 'trang-tu'),
        'Trạng từ',
        'lesson-trang-tu',
        20,
        1,
        TRUE
    ),
    -- Topic 13: Giới từ
    ((SELECT id FROM topics WHERE slug = 'gioi-tu'),
        'Giới từ',
        'lesson-gioi-tu',
        25,
        1,
        TRUE
    ),
    -- Topic 14: Liên từ
    ((SELECT id FROM topics WHERE slug = 'lien-tu'),
        'Liên từ',
        'lesson-lien-tu',
        20,
        1,
        TRUE
    ),
    -- Topic 15: Mệnh đề quan hệ
    ((SELECT id FROM topics WHERE slug = 'menh-de-quan-he'),
        'Mệnh đề quan hệ',
        'lesson-menh-de-quan-he',
        30,
        1,
        TRUE
    ),
    -- Topic 16: Câu điều kiện
    ((SELECT id FROM topics WHERE slug = 'cau-dieu-kien'),
        'Câu điều kiện',
        'lesson-cau-dieu-kien',
        25,
        1,
        TRUE
    );


-- ==========================================
-- Original File: V10__insert_lessons_part1.sql
-- ==========================================
-- =====================================================
-- V10__insert_lessons_part1.sql
-- Thêm topic Part 1 và các lesson tương ứng
-- =====================================================

-- 1. Thêm các topic cho Part 1 (vào section Part 1)
INSERT IGNORE INTO topics (section_id, title, slug, description, order_index, is_active) VALUES
((SELECT id FROM sections WHERE slug = 'part-1-photographs-nghe-tranh'), 'Tổng quan', 'topic-tong-quan-part-1', 'Tổng quan', 1, TRUE),
((SELECT id FROM sections WHERE slug = 'part-1-photographs-nghe-tranh'), 'Tranh tả người', 'topic-tranh-ta-nguoi-part-1', 'Tranh tả người', 2, TRUE),
((SELECT id FROM sections WHERE slug = 'part-1-photographs-nghe-tranh'), 'Tranh tả vật', 'topic-tranh-ta-vat-part-1', 'Tranh tả vật', 3, TRUE),
((SELECT id FROM sections WHERE slug = 'part-1-photographs-nghe-tranh'), 'Tranh tả cả người và vật', 'topic-tranh-ta-ca-nguoi-va-vat-part-1', 'Tranh tả cả người và vật', 4, TRUE),
((SELECT id FROM sections WHERE slug = 'part-1-photographs-nghe-tranh'), 'Luyện tập tổng hợp', 'topic-luyen-tap-tong-hop-part-1', 'Luyện tập tổng hợp', 5, TRUE);

-- 2. Thêm các bài học (lessons) cho topic Part 1
INSERT IGNORE INTO lessons (
    topic_id,
    title,
    slug,
    duration_minutes,
    order_index,
    is_active
) VALUES
-- Lesson 1: Tổng quan
((SELECT id FROM topics WHERE slug = 'topic-tong-quan-part-1'),
 'Tổng quan',
 'lesson-tong-quan-part-1',
        20,
 1,
 TRUE
),

-- Lesson 2: Tranh tả người
((SELECT id FROM topics WHERE slug = 'topic-tranh-ta-nguoi-part-1'),
 'Tranh tả người',
 'lesson-tranh-ta-nguoi',
        20,
 2,
 TRUE
),

-- Lesson 3: Tranh tả vật
((SELECT id FROM topics WHERE slug = 'topic-tranh-ta-vat-part-1'),
 'Tranh tả vật',
 'lesson-tranh-ta-vat',
        20,
 3,
 TRUE
),

-- Lesson 4: Tranh tả cả người và vật
((SELECT id FROM topics WHERE slug = 'topic-tranh-ta-ca-nguoi-va-vat-part-1'),
 'Tranh tả cả người và vật',
 'lesson-tranh-ta-ca-nguoi-va-vat',
        20,
 4,
 TRUE
),

-- Lesson 5: Luyện tập tổng hợp
((SELECT id FROM topics WHERE slug = 'topic-luyen-tap-tong-hop-part-1'),
 'Luyện tập tổng hợp',
 'lesson-luyen-tap-tong-hop-part-1',
        30,
 5,
 TRUE
);


-- ==========================================
-- Original File: V11__insert_lessons_part2.sql
-- ==========================================
-- =====================================================
-- V11__insert_lessons_part2.sql
-- Thêm topic Part 2 và các lesson tương ứng
-- =====================================================

-- 1. Thêm các topic cho Part 2
INSERT IGNORE INTO topics (section_id, title, slug, description, order_index, is_active) VALUES
((SELECT id FROM sections WHERE slug = 'part-2-question-response-hoi-dap'), 'Tổng quan', 'topic-tong-quan-part-2', 'Tổng quan', 1, TRUE),
((SELECT id FROM sections WHERE slug = 'part-2-question-response-hoi-dap'), 'Câu hỏi WHO', 'topic-cau-hoi-who-part-2', 'Câu hỏi WHO', 2, TRUE),
((SELECT id FROM sections WHERE slug = 'part-2-question-response-hoi-dap'), 'Câu hỏi WHAT', 'topic-cau-hoi-what-part-2', 'Câu hỏi WHAT', 3, TRUE),
((SELECT id FROM sections WHERE slug = 'part-2-question-response-hoi-dap'), 'Câu hỏi WHERE', 'topic-cau-hoi-where-part-2', 'Câu hỏi WHERE', 4, TRUE),
((SELECT id FROM sections WHERE slug = 'part-2-question-response-hoi-dap'), 'Câu hỏi WHEN', 'topic-cau-hoi-when-part-2', 'Câu hỏi WHEN', 5, TRUE),
((SELECT id FROM sections WHERE slug = 'part-2-question-response-hoi-dap'), 'Câu hỏi WHY', 'topic-cau-hoi-why-part-2', 'Câu hỏi WHY', 6, TRUE),
((SELECT id FROM sections WHERE slug = 'part-2-question-response-hoi-dap'), 'Câu hỏi HOW', 'topic-cau-hoi-how-part-2', 'Câu hỏi HOW', 7, TRUE),
((SELECT id FROM sections WHERE slug = 'part-2-question-response-hoi-dap'), 'Câu hỏi YES/NO', 'topic-cau-hoi-yes-no-part-2', 'Câu hỏi YES/NO', 8, TRUE),
((SELECT id FROM sections WHERE slug = 'part-2-question-response-hoi-dap'), 'Câu hỏi lựa chọn', 'topic-cau-hoi-lua-chon-part-2', 'Câu hỏi lựa chọn', 9, TRUE),
((SELECT id FROM sections WHERE slug = 'part-2-question-response-hoi-dap'), 'Câu hỏi đuôi', 'topic-cau-hoi-duoi-part-2', 'Câu hỏi đuôi', 10, TRUE),
((SELECT id FROM sections WHERE slug = 'part-2-question-response-hoi-dap'), 'Câu đề nghị, yêu cầu', 'topic-cau-de-nghi-yeu-cau-part-2', 'Câu đề nghị, yêu cầu', 11, TRUE),
((SELECT id FROM sections WHERE slug = 'part-2-question-response-hoi-dap'), 'Câu trần thuật', 'topic-cau-tran-thuat-part-2', 'Câu trần thuật', 12, TRUE),
((SELECT id FROM sections WHERE slug = 'part-2-question-response-hoi-dap'), 'Luyện tập tổng hợp', 'topic-luyen-tap-tong-hop-part-2', 'Luyện tập tổng hợp', 13, TRUE);

-- 2. Thêm các bài học (lessons) cho topic Part 2
INSERT IGNORE INTO lessons (
    topic_id,
    title,
    slug,
    duration_minutes,
    order_index,
    is_active
) VALUES
-- Lesson 1: Tổng quan
((SELECT id FROM topics WHERE slug = 'topic-tong-quan-part-2'),
 'Tổng quan',
 'lesson-tong-quan-part-2',
        20,
 1,
 TRUE
),

-- Lesson 2: Câu hỏi WHO
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-who-part-2'),
 'Câu hỏi WHO',
 'lesson-cau-hoi-who',
        20,
 2,
 TRUE
),

-- Lesson 3: Câu hỏi WHAT
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-what-part-2'),
 'Câu hỏi WHAT',
 'lesson-cau-hoi-what',
        20,
 3,
 TRUE
),

-- Lesson 4: Câu hỏi WHERE
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-where-part-2'),
 'Câu hỏi WHERE',
 'lesson-cau-hoi-where',
        20,
 4,
 TRUE
),

-- Lesson 5: Câu hỏi WHEN
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-when-part-2'),
 'Câu hỏi WHEN',
 'lesson-cau-hoi-when',
        20,
 5,
 TRUE
),

-- Lesson 6: Câu hỏi WHY
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-why-part-2'),
 'Câu hỏi WHY',
 'lesson-cau-hoi-why',
        20,
 6,
 TRUE
),

-- Lesson 7: Câu hỏi HOW
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-how-part-2'),
 'Câu hỏi HOW',
 'lesson-cau-hoi-how',
        20,
 7,
 TRUE
),

-- Lesson 8: Câu hỏi YES/NO
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-yes-no-part-2'),
 'Câu hỏi YES/NO',
 'lesson-cau-hoi-yes-no',
        20,
 8,
 TRUE
),

-- Lesson 9: Câu hỏi lựa chọn
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-lua-chon-part-2'),
 'Câu hỏi lựa chọn',
 'lesson-cau-hoi-lua-chon',
        20,
 9,
 TRUE
),

-- Lesson 10: Câu hỏi đuôi
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-duoi-part-2'),
 'Câu hỏi đuôi',
 'lesson-cau-hoi-duoi',
        20,
 10,
 TRUE
),

-- Lesson 11: Câu đề nghị, yêu cầu
((SELECT id FROM topics WHERE slug = 'topic-cau-de-nghi-yeu-cau-part-2'),
 'Câu đề nghị, yêu cầu',
 'lesson-cau-de-nghi-yeu-cau',
        20,
 11,
 TRUE
),

-- Lesson 12: Câu trần thuật
((SELECT id FROM topics WHERE slug = 'topic-cau-tran-thuat-part-2'),
 'Câu trần thuật',
 'lesson-cau-tran-thuat',
        20,
 12,
 TRUE
),

-- Lesson 13: Luyện tập tổng hợp
((SELECT id FROM topics WHERE slug = 'topic-luyen-tap-tong-hop-part-2'),
 'Luyện tập tổng hợp',
 'lesson-luyen-tap-tong-hop-part-2',
        30,
 13,
 TRUE
);


-- ==========================================
-- Original File: V12__insert_lessons_part3.sql
-- ==========================================
-- =====================================================
-- V12__insert_lessons_part3.sql
-- Thêm topic Part 3 và các lesson tương ứng
-- =====================================================

-- 1. Thêm các topic cho Part 3
INSERT IGNORE INTO topics (section_id, title, slug, description, order_index, is_active) VALUES
((SELECT id FROM sections WHERE slug = 'part-3-conversations-nghe-hieu-doi-thoai'), 'Tổng quan', 'topic-tong-quan-part-3', 'Tổng quan', 1, TRUE),
((SELECT id FROM sections WHERE slug = 'part-3-conversations-nghe-hieu-doi-thoai'), 'Câu hỏi về chủ đề, mục đích', 'topic-cau-hoi-ve-chu-de-muc-dich-part-3', 'Câu hỏi về chủ đề, mục đích', 2, TRUE),
((SELECT id FROM sections WHERE slug = 'part-3-conversations-nghe-hieu-doi-thoai'), 'Câu hỏi về địa điểm hội thoại', 'topic-cau-hoi-ve-dia-diem-hoi-thoai-part-3', 'Câu hỏi về địa điểm hội thoại', 3, TRUE),
((SELECT id FROM sections WHERE slug = 'part-3-conversations-nghe-hieu-doi-thoai'), 'Câu hỏi về danh tính người nói', 'topic-cau-hoi-ve-danh-tinh-nguoi-noi-part-3', 'Câu hỏi về danh tính người nói', 4, TRUE),
((SELECT id FROM sections WHERE slug = 'part-3-conversations-nghe-hieu-doi-thoai'), 'Câu hỏi về chi tiết cuộc hội thoại', 'topic-cau-hoi-ve-chi-tiet-cuoc-hoi-thoai-part-3', 'Câu hỏi về chi tiết cuộc hội thoại', 5, TRUE),
((SELECT id FROM sections WHERE slug = 'part-3-conversations-nghe-hieu-doi-thoai'), 'Câu hỏi về hành động tương lai', 'topic-cau-hoi-ve-hanh-dong-tuong-lai-part-3', 'Câu hỏi về hành động tương lai', 6, TRUE),
((SELECT id FROM sections WHERE slug = 'part-3-conversations-nghe-hieu-doi-thoai'), 'Câu hỏi về yêu cầu, gợi ý', 'topic-cau-hoi-ve-yeu-cau-goi-y-part-3', 'Câu hỏi về yêu cầu, gợi ý', 7, TRUE),
((SELECT id FROM sections WHERE slug = 'part-3-conversations-nghe-hieu-doi-thoai'), 'Câu hỏi về hàm ý câu nói', 'topic-cau-hoi-ve-ham-y-cau-noi-part-3', 'Câu hỏi về hàm ý câu nói', 8, TRUE),
((SELECT id FROM sections WHERE slug = 'part-3-conversations-nghe-hieu-doi-thoai'), 'Câu hỏi kết hợp bảng biểu', 'topic-cau-hoi-ket-hop-bang-bieu-part-3', 'Câu hỏi kết hợp bảng biểu', 9, TRUE),
((SELECT id FROM sections WHERE slug = 'part-3-conversations-nghe-hieu-doi-thoai'), 'Chủ đề các cuộc đối thoại', 'topic-chu-de-cac-cuoc-doi-thoai-part-3', 'Chủ đề các cuộc đối thoại', 10, TRUE),
((SELECT id FROM sections WHERE slug = 'part-3-conversations-nghe-hieu-doi-thoai'), 'Luyện tập tổng hợp', 'topic-luyen-tap-tong-hop-part-3', 'Luyện tập tổng hợp', 11, TRUE);

-- 2. Thêm các bài học (lessons) cho topic Part 3
INSERT IGNORE INTO lessons (
    topic_id,
    title,
    slug,
    duration_minutes,
    order_index,
    is_active
) VALUES
-- Lesson 1: Tổng quan
((SELECT id FROM topics WHERE slug = 'topic-tong-quan-part-3'),
 'Tổng quan',
 'lesson-tong-quan-part-3',
        20,
 1,
 TRUE
),

-- Lesson 2: Câu hỏi về chủ đề, mục đích
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-ve-chu-de-muc-dich-part-3'),
 'Câu hỏi về chủ đề, mục đích',
 'lesson-cau-hoi-ve-chu-de-muc-dich',
        20,
 2,
 TRUE
),

-- Lesson 3: Câu hỏi về địa điểm hội thoại
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-ve-dia-diem-hoi-thoai-part-3'),
 'Câu hỏi về địa điểm hội thoại',
 'lesson-cau-hoi-ve-dia-diem-hoi-thoai',
        20,
 3,
 TRUE
),

-- Lesson 4: Câu hỏi về danh tính người nói
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-ve-danh-tinh-nguoi-noi-part-3'),
 'Câu hỏi về danh tính người nói',
 'lesson-cau-hoi-ve-danh-tinh-nguoi-noi',
        20,
 4,
 TRUE
),

-- Lesson 5: Câu hỏi về chi tiết cuộc hội thoại
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-ve-chi-tiet-cuoc-hoi-thoai-part-3'),
 'Câu hỏi về chi tiết cuộc hội thoại',
 'lesson-cau-hoi-ve-chi-tiet-cuoc-hoi-thoai',
        20,
 5,
 TRUE
),

-- Lesson 6: Câu hỏi về hành động tương lai
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-ve-hanh-dong-tuong-lai-part-3'),
 'Câu hỏi về hành động tương lai',
 'lesson-cau-hoi-ve-hanh-dong-tuong-lai',
        20,
 6,
 TRUE
),

-- Lesson 7: Câu hỏi về yêu cầu, gợi ý
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-ve-yeu-cau-goi-y-part-3'),
 'Câu hỏi về yêu cầu, gợi ý',
 'lesson-cau-hoi-ve-yeu-cau-goi-y',
        20,
 7,
 TRUE
),

-- Lesson 8: Câu hỏi về hàm ý câu nói
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-ve-ham-y-cau-noi-part-3'),
 'Câu hỏi về hàm ý câu nói',
 'lesson-cau-hoi-ve-ham-y-cau-noi',
        20,
 8,
 TRUE
),

-- Lesson 9: Câu hỏi kết hợp bảng biểu
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-ket-hop-bang-bieu-part-3'),
 'Câu hỏi kết hợp bảng biểu',
 'lesson-cau-hoi-ket-hop-bang-bieu',
        20,
 9,
 TRUE
),

-- Lesson 10: Chủ đề các cuộc đối thoại - General Office Work
((SELECT id FROM topics WHERE slug = 'topic-chu-de-cac-cuoc-doi-thoai-part-3'),
 'General Office Work',
 'lesson-chu-de-doi-thoai-general-office-work',
        15,
 10,
 TRUE
),

-- Lesson 11: Chủ đề các cuộc đối thoại - Personnel
((SELECT id FROM topics WHERE slug = 'topic-chu-de-cac-cuoc-doi-thoai-part-3'),
 'Personnel',
 'lesson-chu-de-doi-thoai-personnel',
        15,
 11,
 TRUE
),

-- Lesson 12: Chủ đề các cuộc đối thoại - Business, Marketing
((SELECT id FROM topics WHERE slug = 'topic-chu-de-cac-cuoc-doi-thoai-part-3'),
 'Business, Marketing',
 'lesson-chu-de-doi-thoai-business-marketing',
        15,
 12,
 TRUE
),

-- Lesson 13: Chủ đề các cuộc đối thoại - Event, Project
((SELECT id FROM topics WHERE slug = 'topic-chu-de-cac-cuoc-doi-thoai-part-3'),
 'Event, Project',
 'lesson-chu-de-doi-thoai-event-project',
        15,
 13,
 TRUE
),

-- Lesson 14: Chủ đề các cuộc đối thoại - Facility
((SELECT id FROM topics WHERE slug = 'topic-chu-de-cac-cuoc-doi-thoai-part-3'),
 'Facility',
 'lesson-chu-de-doi-thoai-facility',
        15,
 14,
 TRUE
),

-- Lesson 15: Chủ đề các cuộc đối thoại - Shopping, Service
((SELECT id FROM topics WHERE slug = 'topic-chu-de-cac-cuoc-doi-thoai-part-3'),
 'Shopping, Service',
 'lesson-chu-de-doi-thoai-shopping-service',
        15,
 15,
 TRUE
),

-- Lesson 16: Chủ đề các cuộc đối thoại - Order, Delivery
((SELECT id FROM topics WHERE slug = 'topic-chu-de-cac-cuoc-doi-thoai-part-3'),
 'Order, Delivery',
 'lesson-chu-de-doi-thoai-order-delivery',
        15,
 16,
 TRUE
),

-- Lesson 17: Chủ đề các cuộc đối thoại - Housing
((SELECT id FROM topics WHERE slug = 'topic-chu-de-cac-cuoc-doi-thoai-part-3'),
 'Housing',
 'lesson-chu-de-doi-thoai-housing',
        15,
 17,
 TRUE
),

-- Lesson 18: Luyện tập tổng hợp
((SELECT id FROM topics WHERE slug = 'topic-luyen-tap-tong-hop-part-3'),
 'Luyện tập tổng hợp',
 'lesson-luyen-tap-tong-hop-part-3',
        30,
 18,
 TRUE
);


-- ==========================================
-- Original File: V13__insert_lessons_part4.sql
-- ==========================================
-- =====================================================
-- V13__insert_lessons_part4.sql
-- Thêm topic Part 4 và các lesson tương ứng
-- =====================================================

-- 1. Thêm topic Part 4 (vào section Part 4)
INSERT IGNORE INTO topics (section_id, title, slug, description, order_index, is_active) VALUES
((SELECT id FROM sections WHERE slug = 'part-4-talks-nghe-hieu-bai-noi'), 'Part 4: Talks', 'part-4-talks', 'Các bài học Part 4', 1, TRUE);

-- 2. Thêm các bài học (lessons) cho topic Part 4
INSERT IGNORE INTO lessons (
    topic_id,
    title,
    slug,
    duration_minutes,
    order_index,
    is_active
) VALUES
-- Lesson 1: Tổng quan
((SELECT id FROM topics WHERE slug = 'part-4-talks'),
 'Tổng quan',
 'lesson-tong-quan-part-4',
        20,
 1,
 TRUE
),

-- Lesson 2: Câu hỏi về chủ đề, mục đích
((SELECT id FROM topics WHERE slug = 'part-4-talks'),
 'Câu hỏi về chủ đề, mục đích',
 'lesson-cau-hoi-ve-chu-de-muc-dich-part4',
        20,
 2,
 TRUE
),

-- Lesson 3: Câu hỏi về danh tính, địa điểm
((SELECT id FROM topics WHERE slug = 'part-4-talks'),
 'Câu hỏi về danh tính, địa điểm',
 'lesson-cau-hoi-ve-danh-tinh-dia-diem',
        20,
 3,
 TRUE
),

-- Lesson 4: Câu hỏi về chi tiết
((SELECT id FROM topics WHERE slug = 'part-4-talks'),
 'Câu hỏi về chi tiết',
 'lesson-cau-hoi-ve-chi-tiet',
        20,
 4,
 TRUE
),

-- Lesson 5: Câu hỏi yêu cầu, gợi ý
((SELECT id FROM topics WHERE slug = 'part-4-talks'),
 'Câu hỏi yêu cầu, gợi ý',
 'lesson-cau-hoi-yeu-cau-goi-y',
        20,
 5,
 TRUE
),

-- Lesson 6: Câu hỏi về hành động tương lai
((SELECT id FROM topics WHERE slug = 'part-4-talks'),
 'Câu hỏi về hành động tương lai',
 'lesson-cau-hoi-ve-hanh-dong-tuong-lai-part4',
        20,
 6,
 TRUE
),

-- Lesson 7: Câu hỏi về hàm ý câu nói
((SELECT id FROM topics WHERE slug = 'part-4-talks'),
 'Câu hỏi về hàm ý câu nói',
 'lesson-cau-hoi-ve-ham-y-cau-noi-part4',
        20,
 7,
 TRUE
),

-- Lesson 8: Câu hỏi kết hợp bảng biểu
((SELECT id FROM topics WHERE slug = 'part-4-talks'),
 'Câu hỏi kết hợp bảng biểu',
 'lesson-cau-hoi-ket-hop-bang-bieu-part4',
        20,
 8,
 TRUE
),

-- Lesson 9: Dạng bài Telephone message - Tin nhắn thoại
((SELECT id FROM topics WHERE slug = 'part-4-talks'),
 'Dạng bài Telephone message - Tin nhắn thoại',
 'lesson-dang-bai-telephone-message',
        20,
 9,
 TRUE
),

-- Lesson 10: Dạng bài Advertisement - Quảng cáo
((SELECT id FROM topics WHERE slug = 'part-4-talks'),
 'Dạng bài Advertisement - Quảng cáo',
 'lesson-dang-bai-advertisement',
        20,
 10,
 TRUE
),

-- Lesson 11: Dạng bài Announcement - Thông báo
((SELECT id FROM topics WHERE slug = 'part-4-talks'),
 'Dạng bài Announcement - Thông báo',
 'lesson-dang-bai-announcement',
        20,
 11,
 TRUE
),

-- Lesson 12: Dạng bài Talk - Bài phát biểu, diễn văn
((SELECT id FROM topics WHERE slug = 'part-4-talks'),
 'Dạng bài Talk - Bài phát biểu, diễn văn',
 'lesson-dang-bai-talk',
        20,
 12,
 TRUE
),

-- Lesson 13: Dạng bài News report, Broadcast - Bản tin
((SELECT id FROM topics WHERE slug = 'part-4-talks'),
 'Dạng bài News report, Broadcast - Bản tin',
 'lesson-dang-bai-news-report',
        20,
 13,
 TRUE
),

-- Lesson 14: Dạng bài Excerpt from a meeting - Trích dẫn từ buổi họp
((SELECT id FROM topics WHERE slug = 'part-4-talks'),
 'Dạng bài Excerpt from a meeting - Trích dẫn từ buổi họp',
 'lesson-dang-bai-excerpt-from-a-meeting',
        20,
 14,
 TRUE
),

-- Lesson 15: Luyện tập tổng hợp
((SELECT id FROM topics WHERE slug = 'part-4-talks'),
 'Luyện tập tổng hợp',
 'lesson-luyen-tap-tong-hop-part-4',
        30,
 15,
 TRUE
);


-- ==========================================
-- Original File: V14__insert_lessons_part5.sql
-- ==========================================
-- =====================================================
-- V14__insert_lessons_part5.sql
-- Thêm topic Part 5 và các lesson tương ứng
-- =====================================================

-- 1. Thêm topic Part 5 (vào section Part 5)
INSERT IGNORE INTO topics (section_id, title, slug, description, order_index, is_active) VALUES
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), 'Part 5: Incomplete Sentences', 'part-5-incomplete-sentences', 'Các bài học Part 5', 1, TRUE);

-- 2. Thêm các bài học (lessons) cho topic Part 5
INSERT IGNORE INTO lessons (
    topic_id,
    title,
    slug,
    duration_minutes,
    order_index,
    is_active
) VALUES
-- Lesson 1: Tổng quan
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 'Tổng quan',
 'lesson-tong-quan-part-5',
        20,
 1,
 TRUE
),

-- Lesson 2: Câu hỏi từ loại
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 'Câu hỏi từ loại',
 'lesson-cau-hoi-tu-loai',
        20,
 2,
 TRUE
),

-- Lesson 3: Câu hỏi ngữ pháp
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 'Câu hỏi ngữ pháp',
 'lesson-cau-hoi-ngu-phap',
        20,
 3,
 TRUE
),

-- Lesson 4: Câu hỏi từ vựng
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 'Câu hỏi từ vựng',
 'lesson-cau-hoi-tu-vung',
        20,
 4,
 TRUE
),

-- Lesson 5: [Câu hỏi từ vựng] Danh từ
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 '[Câu hỏi từ vựng] Danh từ',
 'lesson-cau-hoi-tu-vung-danh-tu',
        20,
 5,
 TRUE
),

-- Lesson 6: [Câu hỏi từ vựng] Động từ
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 '[Câu hỏi từ vựng] Động từ',
 'lesson-cau-hoi-tu-vung-dong-tu',
        20,
 6,
 TRUE
),

-- Lesson 7: [Câu hỏi từ vựng] Tính từ
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 '[Câu hỏi từ vựng] Tính từ',
 'lesson-cau-hoi-tu-vung-tinh-tu',
        20,
 7,
 TRUE
),

-- Lesson 8: [Câu hỏi từ vựng] Trạng từ
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 '[Câu hỏi từ vựng] Trạng từ',
 'lesson-cau-hoi-tu-vung-trang-tu',
        20,
 8,
 TRUE
),

-- Lesson 9: [Câu hỏi từ loại] Danh từ
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 '[Câu hỏi từ loại] Danh từ',
 'lesson-cau-hoi-tu-loai-danh-tu',
        20,
 9,
 TRUE
),

-- Lesson 10: [Câu hỏi từ loại] Tính từ
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 '[Câu hỏi từ loại] Tính từ',
 'lesson-cau-hoi-tu-loai-tinh-tu',
        20,
 10,
 TRUE
),

-- Lesson 11: [Câu hỏi từ loại] Trạng từ
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 '[Câu hỏi từ loại] Trạng từ',
 'lesson-cau-hoi-tu-loai-trang-tu',
        20,
 11,
 TRUE
),

-- Lesson 12: [Câu hỏi từ loại] Động từ
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 '[Câu hỏi từ loại] Động từ',
 'lesson-cau-hoi-tu-loai-dong-tu',
        20,
 12,
 TRUE
),

-- Lesson 13: [Câu hỏi ngữ pháp] Đại từ
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 '[Câu hỏi ngữ pháp] Đại từ',
 'lesson-cau-hoi-ngu-phap-dai-tu',
        20,
 13,
 TRUE
),

-- Lesson 14: [Câu hỏi ngữ pháp] Thì của động từ
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 '[Câu hỏi ngữ pháp] Thì của động từ',
 'lesson-cau-hoi-ngu-phap-thi-dong-tu',
        20,
 14,
 TRUE
),

-- Lesson 15: [Câu hỏi ngữ pháp] Thể của động từ (chủ động vs bị động)
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 '[Câu hỏi ngữ pháp] Thể của động từ (chủ động vs bị động)',
 'lesson-cau-hoi-ngu-phap-the-dong-tu',
        20,
 15,
 TRUE
),

-- Lesson 16: [Câu hỏi ngữ pháp] Cấu trúc phân từ
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 '[Câu hỏi ngữ pháp] Cấu trúc phân từ',
 'lesson-cau-hoi-ngu-phap-cau-truc-phan-tu',
        20,
 16,
 TRUE
),

-- Lesson 17: [Câu hỏi ngữ pháp] Dạng của động từ - Động từ nguyên mẫu có to (to V)
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 '[Câu hỏi ngữ pháp] Dạng của động từ - Động từ nguyên mẫu có to (to V)',
 'lesson-cau-hoi-ngu-phap-dong-tu-to-v',
        20,
 17,
 TRUE
),

-- Lesson 18: [Câu hỏi ngữ pháp] Dạng của động từ - Danh động từ (Ving)
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 '[Câu hỏi ngữ pháp] Dạng của động từ - Danh động từ (Ving)',
 'lesson-cau-hoi-ngu-phap-danh-dong-tu',
        20,
 18,
 TRUE
),

-- Lesson 19: [Câu hỏi ngữ pháp] Dạng của động từ - Động từ nguyên mẫu (V inf)
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 '[Câu hỏi ngữ pháp] Dạng của động từ - Động từ nguyên mẫu (V inf)',
 'lesson-cau-hoi-ngu-phap-dong-tu-nguyen-mau',
        20,
 19,
 TRUE
),

-- Lesson 20: [Câu hỏi ngữ pháp] Liên từ
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 '[Câu hỏi ngữ pháp] Liên từ',
 'lesson-cau-hoi-ngu-phap-lien-tu',
        20,
 20,
 TRUE
),

-- Lesson 21: [Câu hỏi ngữ pháp] Giới từ
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 '[Câu hỏi ngữ pháp] Giới từ',
 'lesson-cau-hoi-ngu-phap-gioi-tu',
        20,
 21,
 TRUE
),

-- Lesson 22: [Câu hỏi ngữ pháp] Câu cầu khiến
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 '[Câu hỏi ngữ pháp] Câu cầu khiến',
 'lesson-cau-hoi-ngu-phap-cau-cau-khien',
        20,
 22,
 TRUE
),

-- Lesson 23: [Câu hỏi ngữ pháp] Mệnh đề quan hệ
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 '[Câu hỏi ngữ pháp] Mệnh đề quan hệ',
 'lesson-cau-hoi-ngu-phap-menh-de-quan-he',
        20,
 23,
 TRUE
),

-- Lesson 24: [Câu hỏi ngữ pháp] Cấu trúc so sánh
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 '[Câu hỏi ngữ pháp] Cấu trúc so sánh',
 'lesson-cau-hoi-ngu-phap-cau-truc-so-sanh',
        20,
 24,
 TRUE
),

-- Lesson 25: Luyện tập tổng hợp
((SELECT id FROM topics WHERE slug = 'part-5-incomplete-sentences'),
 'Luyện tập tổng hợp',
 'lesson-luyen-tap-tong-hop-part-5',
        30,
 25,
 TRUE
);


-- ==========================================
-- Original File: V15__insert_lessons_part6.sql
-- ==========================================
-- =====================================================
-- V15__insert_lessons_part6.sql
-- Thêm topic Part 6 và các lesson tương ứng
-- =====================================================

-- 1. Thêm topic Part 6 (vào section Part 6)
INSERT IGNORE INTO topics (section_id, title, slug, description, order_index, is_active) VALUES
((SELECT id FROM sections WHERE slug = 'part-6-text-completion-dien-tu-vao-doan-van'), 'Part 6: Text Completion', 'part-6-text-completion', 'Các bài học Part 6', 1, TRUE);

-- 2. Thêm các bài học (lessons) cho topic Part 6
INSERT IGNORE INTO lessons (
    topic_id,
    title,
    slug,
    duration_minutes,
    order_index,
    is_active
) VALUES
-- Lesson 1: Tổng quan
((SELECT id FROM topics WHERE slug = 'part-6-text-completion'),
 'Tổng quan',
 'lesson-tong-quan-part-6',
        20,
 1,
 TRUE
),

-- Lesson 2: Câu hỏi từ loại
((SELECT id FROM topics WHERE slug = 'part-6-text-completion'),
 'Câu hỏi từ loại',
 'lesson-cau-hoi-tu-loai-part-6',
        20,
 2,
 TRUE
),

-- Lesson 3: Câu hỏi ngữ pháp
((SELECT id FROM topics WHERE slug = 'part-6-text-completion'),
 'Câu hỏi ngữ pháp',
 'lesson-cau-hoi-ngu-phap-part-6',
        20,
 3,
 TRUE
),

-- Lesson 4: Câu hỏi từ vựng
((SELECT id FROM topics WHERE slug = 'part-6-text-completion'),
 'Câu hỏi từ vựng',
 'lesson-cau-hoi-tu-vung-part-6',
        20,
 4,
 TRUE
),

-- Lesson 5: Câu hỏi điền câu vào đoạn văn
((SELECT id FROM topics WHERE slug = 'part-6-text-completion'),
 'Câu hỏi điền câu vào đoạn văn',
 'lesson-cau-hoi-dien-cau-vao-doan-van',
        20,
 5,
 TRUE
),

-- Lesson 6: Luyện tập theo hình thức văn bản: Thư điện tử/ thư tay (Email/ Letter)
((SELECT id FROM topics WHERE slug = 'part-6-text-completion'),
 'Luyện tập theo hình thức văn bản: Thư điện tử/ thư tay (Email/ Letter)',
 'lesson-luyen-tap-hinh-thuc-van-ban-email-letter',
        20,
 6,
 TRUE
),

-- Lesson 7: Luyện tập theo hình thức văn bản: Bài báo (Article/ Review)
((SELECT id FROM topics WHERE slug = 'part-6-text-completion'),
 'Luyện tập theo hình thức văn bản: Bài báo (Article/ Review)',
 'lesson-luyen-tap-hinh-thuc-van-ban-article-review',
        20,
 7,
 TRUE
),

-- Lesson 8: Luyện tập theo hình thức văn bản: Quảng cáo (Advertisement)
((SELECT id FROM topics WHERE slug = 'part-6-text-completion'),
 'Luyện tập theo hình thức văn bản: Quảng cáo (Advertisement)',
 'lesson-luyen-tap-hinh-thuc-van-ban-advertisement',
        20,
 8,
 TRUE
),

-- Lesson 9: Luyện tập theo hình thức văn bản: Thông báo/ văn bản hướng dẫn (Notice/ Announcement Information)
((SELECT id FROM topics WHERE slug = 'part-6-text-completion'),
 'Luyện tập theo hình thức văn bản: Thông báo/ văn bản hướng dẫn (Notice/ Announcement Information)',
 'lesson-luyen-tap-hinh-thuc-van-ban-notice-announcement',
        20,
 9,
 TRUE
),

-- Lesson 10: Luyện tập theo hình thức văn bản: Thông báo nội bộ (Memo)
((SELECT id FROM topics WHERE slug = 'part-6-text-completion'),
 'Luyện tập theo hình thức văn bản: Thông báo nội bộ (Memo)',
 'lesson-luyen-tap-hinh-thuc-van-ban-memo',
        20,
 10,
 TRUE
),

-- Lesson 11: Luyện tập tổng hợp
((SELECT id FROM topics WHERE slug = 'part-6-text-completion'),
 'Luyện tập tổng hợp',
 'lesson-luyen-tap-tong-hop-part-6',
        30,
 11,
 TRUE
);


-- ==========================================
-- Original File: V16__insert_lessons_part7.sql
-- ==========================================
-- =====================================================
-- V16__insert_lessons_part7.sql
-- Thêm topic Part 7 và các lesson tương ứng
-- =====================================================

-- 1. Thêm topic Part 7 (vào section Part 7)
INSERT IGNORE INTO topics (section_id, title, slug, description, order_index, is_active) VALUES
((SELECT id FROM sections WHERE slug = 'part-7-reading-comprehension-doc-hieu-van-ban'), 'Part 7: Reading Comprehension', 'part-7-reading-comprehension', 'Các bài học Part 7', 1, TRUE);

-- 2. Thêm các bài học (lessons) cho topic Part 7
INSERT IGNORE INTO lessons (
    topic_id,
    title,
    slug,
    duration_minutes,
    order_index,
    is_active
) VALUES
-- Lesson 1: Tổng quan
((SELECT id FROM topics WHERE slug = 'part-7-reading-comprehension'),
 'Tổng quan',
 'lesson-tong-quan-part-7',
        20,
 1,
 TRUE
),

-- Lesson 2: Câu hỏi về chủ đề, mục đích
((SELECT id FROM topics WHERE slug = 'part-7-reading-comprehension'),
 'Câu hỏi về chủ đề, mục đích',
 'lesson-cau-hoi-chu-de-muc-dich-part-7',
        20,
 2,
 TRUE
),

-- Lesson 3: Câu hỏi tìm thông tin
((SELECT id FROM topics WHERE slug = 'part-7-reading-comprehension'),
 'Câu hỏi tìm thông tin',
 'lesson-cau-hoi-tim-thong-tin',
        20,
 3,
 TRUE
),

-- Lesson 4: Câu hỏi suy luận
((SELECT id FROM topics WHERE slug = 'part-7-reading-comprehension'),
 'Câu hỏi suy luận',
 'lesson-cau-hoi-suy-luan',
        20,
 4,
 TRUE
),

-- Lesson 5: Câu hỏi tìm từ đồng nghĩa
((SELECT id FROM topics WHERE slug = 'part-7-reading-comprehension'),
 'Câu hỏi tìm từ đồng nghĩa',
 'lesson-cau-hoi-tim-tu-dong-nghia',
        20,
 5,
 TRUE
),

-- Lesson 6: Câu hỏi về hàm ý câu nói
((SELECT id FROM topics WHERE slug = 'part-7-reading-comprehension'),
 'Câu hỏi về hàm ý câu nói',
 'lesson-cau-hoi-ham-y-cau-noi-part-7',
        20,
 6,
 TRUE
),

-- Lesson 7: Câu hỏi tìm chi tiết sai
((SELECT id FROM topics WHERE slug = 'part-7-reading-comprehension'),
 'Câu hỏi tìm chi tiết sai',
 'lesson-cau-hoi-tim-chi-tiet-sai',
        20,
 7,
 TRUE
),

-- Lesson 8: Câu hỏi điền câu
((SELECT id FROM topics WHERE slug = 'part-7-reading-comprehension'),
 'Câu hỏi điền câu',
 'lesson-cau-hoi-dien-cau-part-7',
        20,
 8,
 TRUE
),

-- Lesson 9: Dạng bài Article/ Review - Bài báo/ Bài đánh giá
((SELECT id FROM topics WHERE slug = 'part-7-reading-comprehension'),
 'Dạng bài Article/ Review - Bài báo/ Bài đánh giá',
 'lesson-dang-bai-article-review',
        20,
 9,
 TRUE
),

-- Lesson 10: Dạng bài Announcement/ Notice - Thông báo
((SELECT id FROM topics WHERE slug = 'part-7-reading-comprehension'),
 'Dạng bài Announcement/ Notice - Thông báo',
 'lesson-dang-bai-announcement-notice',
        20,
 10,
 TRUE
),

-- Lesson 11: Dạng bài Email/ Letter - Thư điện tử/ Thư tay
((SELECT id FROM topics WHERE slug = 'part-7-reading-comprehension'),
 'Dạng bài Email/ Letter - Thư điện tử/ Thư tay',
 'lesson-dang-bai-email-letter',
        20,
 11,
 TRUE
),

-- Lesson 12: Dạng bài Advertisement - Quảng cáo
((SELECT id FROM topics WHERE slug = 'part-7-reading-comprehension'),
 'Dạng bài Advertisement - Quảng cáo',
 'lesson-dang-bai-advertisement-part-7',
        20,
 12,
 TRUE
),

-- Lesson 13: Dạng bài Form - Biểu mẫu
((SELECT id FROM topics WHERE slug = 'part-7-reading-comprehension'),
 'Dạng bài Form - Biểu mẫu',
 'lesson-dang-bai-form',
        20,
 13,
 TRUE
),

-- Lesson 14: Dạng bài Text message chain - Chuỗi tin nhắn
((SELECT id FROM topics WHERE slug = 'part-7-reading-comprehension'),
 'Dạng bài Text message chain - Chuỗi tin nhắn',
 'lesson-dang-bai-text-message-chain',
        20,
 14,
 TRUE
),

-- Lesson 15: Luyện tập theo cấu trúc: Cấu trúc một đoạn
((SELECT id FROM topics WHERE slug = 'part-7-reading-comprehension'),
 'Luyện tập theo cấu trúc: Cấu trúc một đoạn',
 'lesson-luyen-tap-cau-truc-mot-doan',
        20,
 15,
 TRUE
),

-- Lesson 16: Luyện tập theo cấu trúc: Cấu trúc nhiều đoạn
((SELECT id FROM topics WHERE slug = 'part-7-reading-comprehension'),
 'Luyện tập theo cấu trúc: Cấu trúc nhiều đoạn',
 'lesson-luyen-tap-cau-truc-nhieu-doan',
        20,
 16,
 TRUE
),

-- Lesson 17: Luyện tập tổng hợp
((SELECT id FROM topics WHERE slug = 'part-7-reading-comprehension'),
 'Luyện tập tổng hợp',
 'lesson-luyen-tap-tong-hop-part-7',
        30,
 17,
 TRUE
);


-- ==========================================
-- Original File: V17__add_exercise_question_groups.sql
-- ==========================================
-- =====================================================
-- V17__add_exercise_question_groups.sql
-- Hỗ trợ nhóm câu hỏi (audio/image/passage) cho Exercise
-- =====================================================

-- 1. Bảng exercise_question_groups
-- Mỗi group chứa: audio (Part 1-4), image (Part 1), passage (Part 6,7)
-- + N câu hỏi trắc nghiệm


-- 2. Thêm cột exercise_type vào exercises


-- 3. Thêm cột group_id vào exercise_questions (liên kết câu hỏi → nhóm)


-- 4. Indexes




-- ==========================================
-- Original File: V18__insert_exercise_grammar_tenses.sql
-- ==========================================
-- =====================================================
-- V18__insert_exercise_grammar_tenses.sql
-- Thêm bài tập Ngữ pháp: Thì
-- =====================================================

SET @topic_id = (SELECT id FROM topics WHERE slug = 'thi' LIMIT 1);

INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type)
VALUES (@topic_id, 15, 1, TRUE, 'GRAMMAR');

SET @exercise_id = LAST_INSERT_ID();

INSERT IGNORE INTO exercise_questions (exercise_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id, 1, 'Ms. Tsai will _____ the installation of the new workstations with the vendor.', 'coordinated', 'to coordinate', 'coordination', 'be coordinating', 'D', 'Đáp án đúng: D\nGiải thích: Ta cần điền dạng đúng của động từ ‘coordinate’ khi đứng sau trợ động từ ‘will’\nVì sau ‘will’ luôn là động từ nguyên mẫu\n=> đáp án đúng là D.\nCấu trúc will be V-ing (thì tương lai tiếp diễn) được sử dụng để diễn tả một sự việc chắc chắn sẽ xảy ra trong tương lai hoặc sự việc sẽ đang xảy ra tại một thời điểm cụ thể trong tương lai.\nDịch: Bà Tsai sẽ phối hợp việc lắp đặt các máy trạm mới với nhà cung cấp.\nTừ vựng:\ncoordination (n): sự phối hợp/sự kết hợp\nCoordinate (v): phối hợp\ninstallation (n): việc lắp đặt/cài đặt\nvendor (n): nhà cung cấp'), (@exercise_id, 2, 'Vantage Automotive Design has recently —— with the Pallax Company.', 'merge', 'merger', 'merged', 'merging', 'C', 'Đáp án đúng: C\nGiải thích: Câu hỏi yêu cầu điền dạng đúng của động từ ‘merge’ (sáp nhập)\nTa thấy trạng từ ‘recently’ (gần đây) là dấu hiệu của thì hiện tại hoàn thành\n=> đáp án đúng là C\nCâu sử dụng cấu trúc hiện tại hoàn thành have/has + Ved/3 để diễn tả sự việc mới diễn ra gần đây hoặc sự việc đã diễn ra rồi nhưng vẫn còn kéo dài đến hiện tại\nDịch: Vantage Automotive Design gần đây đã sáp nhập với công ty Pallax.\nTừ vựng:\nRecently (adv): gần đây\nMerge (v): kết hợp, sáp nhập'), (@exercise_id, 3, 'Questwiz, the library’s newest database, _____ a wide range of resource materials.', 'to contain', 'contains', 'container', 'containing', 'B', 'Đáp án đúng: B\nGiải thích: Câu còn thiếu động từ chính (được chia thì). Loại A (động từ nguyên mẫu có to), C (danh từ) và D (phân từ đuôi -ing)\nChọn đáp án phù hợp là B.\nDịch: Questwiz, cơ sở dữ liệu mới nhất của thư viện, chứa một loạt các tài liệu nguồn.\nTừ vựng:\n– database: (n) cơ sở dữ liệu\n– materials: (n) tài liệu, vật liệu\n– resource (n): nguồn'), (@exercise_id, 4, 'By this time next year, Grasswell Industries _____ two new plants in eastern Europe.', 'opens', 'will have opened', 'is opening', 'had opened', 'B', 'Đáp án đúng: B\nGiải thích: Trong câu có “by this time next year” → dấu hiệu của thì tương lai hoàn thành\n→ Chọn B\nTạm dịch: Vào thời điểm này năm sau, Grasswell Industries sẽ mở thêm hai nhà máy mới ở Đông Âu.\nTừ vựng:\n– plant (n): nhà máy\n– eastern Europe: Đông Âu'), (@exercise_id, 5, 'Oil production _____ 5 percent from January to February.', 'drop', 'to drop', 'dropping', 'dropped', 'D', 'Đáp án đúng: D\nGiải thích: Ta cần điền dạng chia thì đúng của động từ ‘drop’ vào chỗ trống\nTa thấy trong câu này đang thiếu chủ ngữ chính\n=> Loại đáp án B và C vì động từ nguyên mẫu của to và phân từ không thể làm chủ ngữ chính của câu\nVì chủ ngữ là danh từ số ít => loại A\n=> Đáp án đúng là D.\nDịch: Sản lượng dầu đã giảm 5% từ tháng Một đến tháng Hai.\nTừ vựng:\n– production: (n) sản lượng, sự sản xuất,\n– drop: (v) giảm'), (@exercise_id, 6, '_____ Human Resources if you have questions about taking time off from work.', 'Contacting', 'Contacted', 'Contacts', 'Contact', 'D', 'Đáp án đúng: D\nGiải thích: Cấu trúc câu cầu khiến → Chọn động từ nguyên mẫu\nLưu ý: Chiến thuật làm bài dạng câu mệnh lệnh\n(1) Các đáp án là các dạng khác nhau của động từ và có phương án chứa động từ nguyên mẫu\n(2) Chỗ trống hay đứng đầu một mệnh đề\n(3) Trong mệnh đề đó chưa có bất kỳ động từ chính nào.\n(4) Xuất hiện các dấu hiệu: please, mệnh đề với IF, When, cụm từ nguyên mẫu to do something – để làm gì đó\nVí dụ:\nIf you would like to register for a course, please fill out this form.\nNếu bạn muốn đăng ký một khóa học, vui lòng điền vào biểu mẫu này.\nTo register for the seminar, fill out this form completely.\nĐể đăng ký tham gia hội thảo, hãy điền đầy đủ thông tin vào biểu mẫu này.\nWhen you want to access your account, type your password in the appropriate field.\nKhi bạn muốn truy cập tài khoản của mình, hãy nhập mật khẩu của bạn vào trường thích hợp.\nTạm dịch: Hãy liên hệ với bộ phận Nhân sự nếu bạn có thắc mắc về việc xin nghỉ phép.\nTừ vựng:\n– contact (v): liên hệ\n– Human Resources: bộ phận Nhân sự\n– time off: nghỉ phép'), (@exercise_id, 7, 'Ramirez Instruments _____ high-quality acoustic guitars for over a century.', 'to be designed', 'has been designing', 'was designed', 'is designing', 'B', 'Đáp án đúng: B\nGiải thích: Ta cần điền đúng dạng của động từ ‘design’. Nhìn vào cấu trúc của câu, ta thấy câu đã có chủ ngữ nhưng vẫn chưa có động từ\n→ Từ cần điền bắt buộc phải là một động từ được chia thì, không thể là cấu trúc phân từ hay động từ nguyên mẫu có ‘to’\n→ Loại đáp án A\nỞ đây ta nhận thấy cuối câu có cụm “ for over a century” nghĩa là “suốt hơn một thế kỷ qua”. Hành động ‘design’ của chủ thể được bắt đầu từ quá khứ, kéo dài cho tới hiện tại và vẫn có khả năng tiếp tục cho tương lai\n→ Dấu hiệu nhận biết của thì hiện tại hoàn thành tiếp diễn (have/has been + doing)\n⇒ Chọn B.\nCấu trúc S + have/has + been + V-ing (thì hiện tại hoàn thành tiếp diễn) dùng để chỉ hành động xảy ra trong quá khứ nhưng vẫn tiếp tục ở hiện tại và có khả năng tiếp diễn trong tương lai.Thì Hiện tại hoàn thành tiếp diễn nhấn mạnh về khoảng thời gian của hành động đã xảy ra nhưng không có kết quả rõ rệt.\nDịch: Ramirez Instruments đã thiết kế những cây đàn guitar acoustic chất lượng cao trong hơn một thế kỷ qua.\nTừ vựng:\n– high-quality: (adj) chất lượng cao\n– instrument: (n) nhạc cụ'), (@exercise_id, 8, 'Ikeda Real Estate Group now _____ text messages to update clients about properties of interest.', 'uses', 'users', 'useful', 'using', 'A', 'Đáp án đúng: A\nGiải thích: Trong các thành phần cấu thành cấu trúc của câu: S + V + O, ta thấy trong câu đã xuất hiện S (Ikeda Real Estate Group) và O (text messages to update clients about properties of interest)\n→ Cần tìm một động từ chính đã được chia trong câu ⇒ loại đáp án B (danh từ), C (tính từ), và D (danh động từ, không phải là động từ chính đã được chia)\n⇒ Chọn A\nChủ ngữ trong câu là ‘Ikeda Real Estate Group’ ngôi thứ 3 số ít → Động từ thêm đuôi s/ es, chia thành uses\nDịch:\nTập đoàn Bất động sản Ikeda bây giờ hiện sử dụng tin nhắn để cập nhật cho khách hàng về số lãi suất của các giá trị bất động sản.\nTừ vựng:\n– real estate (n): bất động sản\n– client (n): khách hàng\n– property (n): tài sản\n– interest (n): lãi suất\n– update: (v) cập nhật'), (@exercise_id, 9, 'Please _____ daily spending records, since online balance statements may not reflect recent account activity.', 'kept', 'keep', 'keeps', 'keeping', 'B', 'Đáp án đúng: B\nGiải thích: Câu này liên quan đến kiến thức câu mệnh lệnh. Câu mệnh lệnh là loại câu đưa ra các mệnh lệnh, chỉ dẫn hoặc lời khuyên…Trong loại câu này thì động từ nguyên mẫu sẽ đứng đầu câu. Bạn cũng có thể thêm please vào để thể hiện sự lịch sự.\n→ Chọn B\nTạm dịch:\nVui lòng giữ lại những hóa đơn chi tiêu hàng ngày vì sao kê số dư trực tuyến có thể không phản ánh hoạt động tài khoản gần đây.\nTừ vựng:\n– spending record: hóa đơn chi tiêu\n– online balance statement: sao kê số dư trực tuyến\n– reflect (v): phản ánh'), (@exercise_id, 10, 'The National Health Agency’s latest report _____ that recently adopted health-care regulations have been successful.', 'concludes', 'concluding', 'conclusion', 'to conclude', 'A', 'Đáp án đúng: A\nGiải thích: Câu còn thiếu một động từ chính được chia thì\n→ Chọn A\nLưu ý: Mệnh đề danh ngữ “that recently adopted health-care regulations have been successful” đóng vai trò tân ngữ của động từ conclude\nTạm dịch:\nBáo cáo mới nhất của Cơ quan Y tế Quốc gia kết luận rằng các quy định chăm sóc sức khỏe được thông qua gần đây đã thành công.\nTừ vựng:\n– latest (adj): mới nhất\n– adopt (v): thông qua\n– regulation (n): quy định'), (@exercise_id, 11, 'The renovated office building did not look the way Ms. Garcia _____ it would.', 'imagine', 'imagining', 'imagined', 'imagination', 'C', 'Đáp án đúng: C\nGiải thích: Ta cần điền dạng đúng của động từ imagine đứng sau chủ ngữ Ms. Garcia. Ta nhận thấy câu được chia theo thì quá khứ đơn (did not look, would)\n→ động từ imagine cũng được chia cùng thì.\n⇒ Chọn C (động từ chia theo thì quá khứ đơn V-ed)\nDịch: Tòa nhà văn phòng được cải tạo trông không giống như cách cô Garcia tưởng tượng.\nTừ vựng:\n– imagination (n): trí tưởng tượng, sự tưởng tượng\n– imagine (v): tưởng tượng\n– renovate (v): cải tạo\n– office building: tòa nhà văn phòng'), (@exercise_id, 12, 'There is coffee in the break room for anyone who _____ a cup before the meeting.', 'want', 'wants', 'wanting', 'to want', 'B', 'Đáp án đúng: B\nGiải thích: ta cần điền dạng đúng của động từ ‘want’. Ta nhận thấy động từ [a]đứng sau who – đại từ quan hệ đang thay thế cho anyone. Anyone là đại từ bất định, động từ đi kèm với nó sẽ luôn chia số ít\n→ Chọn B (động từ chia số ít thêm -(e)s)\nLưu ý: Động từ đi kèm với đại từ bất định anyone, everyone, everybody…luôn chia số ít.\nDịch:\nCó cà phê trong phòng nghỉ cho bất cứ ai muốn một tách trước cuộc họp.\nTừ vựng:\n– break room: phòng nghỉ\n– meeting (n): cuộc họp'), (@exercise_id, 13, 'The Liu Supermarket _____ that Jennifer Chan will take over as CEO next month came as a surprise.', 'announced', 'announcement', 'announcing', 'announcer', 'B', 'Đáp án đúng: B\nGiải thích: Ta nhận thấy trong câu đã có ‘came as a surprise’ – đã bao gồm động từ chính\n→ Loại đáp án A\n→ Cần tìm một danh từ có nghĩa phù hợp với câu. Loại đáp án C (động từ đuôi -ing) và đáp án D (không phù hợp về nghĩa khi đặt trong câu)\n⇒ Chọn B (thông báo của Liu Supermarket)\nLưu ý: Vì chưa biết là thông báo gì nên người ta dùng mệnh đề danh ngữ THAT để bổ nghĩa thêm cho danh từ announcement.\nDịch:\nThông báo của siêu thị Liu về việc Jennifer Chan sẽ đảm nhận vị trí Giám đốc điều hành vào tháng tới đã tạo ra một sự bất ngờ.\nTừ vựng:\n– announcement (n): thông báo\n– announce (v): thông báo\n– take over (phrasal verb): tiếp quản\n– surprise (v) (n): (sự) bất ngờ'), (@exercise_id, 14, 'The lights in the cinema _____ before a movie begins.', 'dim', 'dimming', 'dimmer', 'dims', 'A', 'Đáp án đúng: A\nGiải thích: Câu còn thiếu động từ chính, loại B và C. Do chủ ngữ là số nhiều nên loại D.\n→ Chọn A.\nDịch: Đèn trong rạp chiếu phim mờ đi trước khi một bộ phim bắt đầu.\nTừ vựng:\n– dim (v): làm mờ, mờ\n– dim (adj): âm u, mập mờ, không rõ'), (@exercise_id, 15, 'Mr. Jones _____ Ms. Cheng’s clients while she is on a business trip to Hong Kong.', 'will assist', 'assisted', 'to assist', 'is assisted', 'A', 'Đáp án đúng: A\nGiải thích: Ta nhận thấy vị trí từ cần điền đứng giữa chủ ngữ và tân ngữ\n→ Cần tìm động từ chính được chia thì\nDựa vào cách dùng của từ nối ‘while’, while được sử dụng khi hai hành động xảy ra song song cùng lúc hoặc xảy ra gần nhau, ta nhận thấy vế câu sau sử dụng thì hiện tại đơn. Một trong những cách dùng của thì hiện tại đơn là nói về lịch trình đã được lên lịch sẵn hoặc lịch tàu chạy,… (các chuyến công tác thường được lên lịch sẵn nên ta hiểu chuyến công tác của cô Cheng đã được lên lịch và xảy ra trong tương lai)\n→ Chia động từ đứng trước theo thì tương lai đơn\n⇒ Chọn A\nDịch:\nÔng Jones sẽ hỗ trợ khách hàng của cô Chen khi cô ấy đi công tác tại Hongkong\nTừ vựng:\n– assist (v): hỗ trợ\n– client (n): khách hàng\n– business trip: chuyến công tác');

-- =====================================================
-- Thêm bài tập Ngữ pháp: Thể
-- =====================================================

SET @topic_id_2 = (SELECT id FROM topics WHERE slug = 'the' LIMIT 1);

INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type)
VALUES (@topic_id_2, 13, 1, TRUE, 'GRAMMAR');

SET @exercise_id_2 = LAST_INSERT_ID();

INSERT IGNORE INTO exercise_questions (exercise_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id_2, 1, 'The release of the earnings report will _____ until the latest company figures are ready.', 'delay', 'have delayed', 'be delayed', 'be delaying', 'C', 'Đáp án đúng: C
Giải thích: Câu hỏi yêu cầu tìm dạng đúng của động từ ‘delay’ (trì hoãn)
Ta thấy theo sau động từ ‘delay’ không có tân ngữ => động từ ‘delay’ cần phải chia ở thể bị động
=> Đáp án đúng là C.
Dịch: Việc phát hành báo cáo thu nhập sẽ bị trì hoãn cho đến khi có các số liệu mới nhất của công ty.
Từ vựng:
release (n,v): phát hành, sự phát hành
figure (n): số liệu, ngoại hình
Earnings (n; plural): tiền kiếm được, lợi nhuận'),
(@exercise_id_2, 2, 'The First Street Hotel has almost always been fully booked since it _____ last year.', 'had renovated', 'renovated', 'was renovating', 'was renovated', 'D', 'Đáp án đúng: D
Giải thích: Với câu hỏi này, ta cần chia đúng thì và thể của động từ ‘renovate’.
Ta thấy câu bao gồm 2 mệnh đề được nối với nhau bởi liên từ since và ở mệnh đề thứ 2 (đứng sau since), đại từ ‘it’ được dùng để thay thế cho chủ ngữ "The First Street Hotel".
=> động từ ‘renovate’ cần được chia ở thể bị động (vì khách sạn là chủ thể được tân trang lại)
=> đáp án đúng là D
Dịch: Khách sạn First Street hầu như luôn được đặt kín chỗ kể từ khi nó được tân trang lại vào năm ngoái.
Từ vựng:
renovate: (v) cải tạo, tân trang
Book (v): đặt chỗ trước'),
(@exercise_id_2, 3, 'Two associates in the accounting department are being _____ for promotions.', 'consider', 'considerable', 'considered', 'consideration', 'C', 'Đáp án đúng: C
Giải thích: Ta cần điền một từ loại thích hợp vào chỗ trống
Trong câu hỏi này, từ cần điền phải là động từ chính của câu có chức năng bổ nghĩa cho chủ ngữ ‘Two associates’. Vì trước từ cần điền là động từ ‘are being’
=> đây là cấu trúc bị động ở thì hiện tại tiếp diễn
=> từ cần điền được chia ở dạng Vp2
=> đáp án đúng là C
Dịch: Hai nhân viên trong bộ phận kế toán đang được xem xét cho việc thăng chức.
Từ vựng:
associate: (n) cộng sự, đồng nghiệp
promotion: (n) sự thăng chức
Consider (v): cân nhắc, xem xét
Consideration (n): sự cân nhắc
Considerable (adj): đáng kể'),
(@exercise_id_2, 4, 'A second order for 500 recycled paper cups _____ last week.', 'was placed', 'was placing', 'to place', 'placed', 'A', 'Đáp án đúng: A
Giải thích: Câu thiếu động từ chính, chủ ngữ là “a second order” - đơn hàng thứ hai, cuối câu có “last week” - dấu hiệu thì quá khứ đơn
→ Cần điền một động từ chính ở thể bị động và chia ở thì quá khứ đơn
→ Chọn A
Tạm dịch:
Đơn hàng thứ hai cho 500 cốc giấy tái chế đã được đặt vào tuần trước.
Từ vựng:
order (n): đơn đặt hàng
recycled (adj): tái chế'),
(@exercise_id_2, 5, 'The equipment-use guidelines _____ on our internal corporate Website.', 'may find', 'can be found', 'have found', 'have to find', 'B', 'Đáp án đúng: B
Giải thích: Ta nhận thấy trong câu còn thiếu động từ chính
→ Cần tìm một động từ chính được chia thì phù hợp
Chủ ngữ trong câu là ‘the equipment-use guidelines’ nghĩa là ‘hướng dẫn sử dụng thiết bị’. Ta nhận thấy chủ ngữ trong câu không thể trực tiếp thực hiện hành động, cần nhận sự tác động từ đối tượng khác. → Động từ trong câu chia theo thể bị động
Dạng của động từ ở thể bị động là: be + p.p (phân từ quá khứ)
⇒ Chọn đáp án B (vì các đáp án khác đều ở thể chủ động)
Dịch: Hướng dẫn sử dụng thiết bị có thể được tìm thấy trên website nội bộ của chúng tôi.
Từ vựng:
guideline (n): hướng dẫn sử dụng
internal (adj): nội bộ
corporate (adj): đoàn thể, công ty'),
(@exercise_id_2, 6, 'Please review the projected sales figures in the spreadsheets that _____ to be e-mail', 'is attaching', 'had attached', 'attachment', 'are attached', 'D', 'Đáp án đúng: D
Giải thích: Ta nhận thấy vị trí của từ loại cần điền đứng trong mệnh đề phụ bổ nghĩa cho mệnh đề đứng trước nó, đứng ngay sau ‘that’ - chủ ngữ
→ Cần tìm một động từ được chia thì phù hợp
Ở đây chủ ngữ là ‘that’ - thay thế cho danh từ ‘spreadsheets’ đằng trước.
‘Spreadsheets’ nghĩa là ‘bảng tính’ (là sự vật, có mối quan hệ bị động với động từ) + thì trong mệnh đề chính là thì hiện tại đơn
→ Cần tìm một động từ ở thể bị động chia thì hiện tại đơn
⇒ Chọn đáp án D
Loại đáp án A (động từ thì hiện tại tiếp diễn), đáp án B (động từ thì quá khứ hoàn thành) và đáp án C (danh từ)
Dịch: Vui lòng xem xét số liệu bán hàng dự kiến trong bảng tính cái mà được đính kèm trong email này.
Từ vựng:
projected (adj): dự kiến
figure (n): con số
spreadsheet (n): bảng tính
attach (v): gắn'),
(@exercise_id_2, 7, 'Please save spreadsheets periodically when updating them to prevent data from ____', 'is lost', 'lost', 'being lost', 'losing', 'C', 'Đáp án đúng: C
Giải thích: Ta nhận thấy vị trí của từ cần điền đứng sau giới từ ‘from’
→ Cần tìm một danh động từ (danh từ)
→ Loại đáp án A (động từ ở thể bị động hiện tại đơn) và đáp án B (động từ)
Chủ ngữ trong câu là ‘data’ - ‘dữ liệu’. ‘Dữ liệu’ không thể tự mất đi, chúng phải được nhận tác động từ bên ngoài mới bị mất
→ Chia ở thể bị động
⇒ Chọn C
Lưu ý: Ta cũng có cấu trúc ‘prevent sth/sb from doing sth’: ngăn cản ai/cái gì khỏi việc làm gì
Dịch: Vui lòng lưu trang tính thường xuyên khi cập nhật chúng để tránh việc dữ liệu bị mất.
Từ vựng:
periodically (adv): định kỳ, thường xuyên'),
(@exercise_id_2, 8, 'Martaska Technologies requires ____ new employees receive at latest two weeks of training before starting work', 'that', 'for', 'and', 'when', 'A', 'Đáp án đúng: A
Giải thích: Ta nhận thấy vị trí của từ cần điền nằm giữa 2 vế câu và nằm sau động từ ‘require’.
→ Cần tìm một liên từ phù hợp để nối 2 vế câu
Ở đây ta thấy vế câu sau ‘ employees receive at latest two weeks of training before starting work’ mang ý nghĩa bổ sung ý nghĩa cho động từ ‘require’ đằng trước, làm rõ nghĩa cho động từ ‘require’
Loại đáp án B (liên từ chỉ lý do - trong câu không đề cập đến lý do), đáp án C (liên từ bổ sung) và đáp án D (liên từ chỉ thời gian)
⇒ Chọn A
Lưu ý: Cấu trúc require that + mệnh đề nghĩa là yêu cầu rằng...
Dịch: Martaska Technologies yêu cầu rằng nhân viên mới phải được đào tạo ít nhất hai tuần trước khi bắt đầu làm việc.
Từ vựng:
technology (n): công nghệ
receive (v): nhận
training (n): sự đào tạo'),
(@exercise_id_2, 9, 'Sookie Choi’s latest children’s book is being _____ by Chung—He Park.', 'illustrating', 'illustrated', 'illustration', 'illustrates', 'B', 'Đáp án đúng: B
Giải thích: Ta nhận thấy chủ ngữ trong câu là ‘Sookie Choi’s latest children’s book’ nghĩa là ‘cuốn sách trẻ em mới nhất của Sookie Choi’ → sự vật
Động từ chính trong câu chia ở thể ‘is being ___’ → Dấu hiệu của thể bị động ở dạng hiện tại tiếp diễn
→ Cần tìm một động từ chia thì ở thể bị động
Loại đáp án A (động từ dạng V-ing được dùng cho thể chủ động), đáp án C (danh từ hậu tố -tion) và đáp án D (động từ chia thì hiện tại đơn ngôi thứ 3 số ít → không thể có 2 động từ chính đi liền nhau)
⇒ Chọn B
Dịch: Cuốn sách trẻ em mới nhất của Sookie Choi đang được minh hoạ bởi Chung He Park.
Từ vựng:
latest (adj): mới nhất
illustrate (v): minh họa
illustration (n): hình minh họa'),
(@exercise_id_2, 10, 'The mayor’s speech at Monday’s business breakfast _____ and will be broadcast later this week.', 'record', 'recording', 'being recorded', 'was recorded', 'D', 'Đáp án đúng: D
Giải thích: Ta nhận thấy từ loại cần điền đứng sau chủ ngữ ‘The mayor’s speech’ nghĩa là ‘bài phát biểu của thị trưởng’
→ Chủ ngữ không thể tự tạo ra hành động ‘record’, cần chịu tác động từ đối tượng khác để có thể được ‘record’
⇒ Cần điền một động từ chính chia theo thể bị động
Ở đây, bài phát biểu của thị trưởng được ghi lại vào thứ hai, sau đó mới được phát sóng vào cuối tuần → động từ cần được chia ở thể bị động thì quá khứ
⇒ Chọn đáp án D
Dịch: Bài phát biểu của thị trưởng tại bữa sáng kinh doanh thứ Hai đã được ghi lại và sẽ được phát sóng sau vào cuối tuần này.
Từ vựng:
business breakfast: bữa ăn sáng cho mọi người trao đổi trong kinh doanh
speech (n): bài phát biểu
broadcast (v): công chiếu'),
(@exercise_id_2, 11, 'Ms. Hyun is reviewing the training manual to see if updates _____.', 'have need', 'needing', 'are needed', 'to be needed', 'C', 'Đáp án đúng: C
Giải thích: Ta nhận thấy vị trí của từ loại cần điền nằm trong vế câu có ‘if updates’ còn thiếu động từ chính → Cần tìm một động từ được chia thì
→ Loại đáp án B và D (động từ được chia thì không nằm trong dạng V-ing và to be +V-p.p)
Xét danh từ mà phân từ cần điền phụ thuộc, ‘updates’ nghĩa là các cập nhật. Cập nhật không thể tự làm, tự xuất hiện mà cần có đối tượng bên ngoài tác động vào nó
→ Động từ cần được chia ở thể bị động
⇒ Chọn C
Dịch: Cô Hyun đang xem lại hướng dẫn đào tạo để xem có cần cập nhật không.
Từ vựng:
manual (n): sách hướng dẫn sử dụng
training (n): đào tạo'),
(@exercise_id_2, 12, 'A special sale on stationery _____ on the Write Things Website yesterday.', 'was announced', 'announced', 'was announcing', 'to announce', 'A', 'Đáp án đúng: A
Giải thích: Ta nhận thấy câu còn thiếu động từ chính
→ Cần tìm một động từ chính được chia
Ở đây chủ ngữ trong câu là ‘a special sale on stationery’ nghĩa là ‘một đợt giảm giá đặc biệt cho văn phòng phẩm’. ‘đợt giảm giá’ không thể tự thông báo, nó cần được nhận sự tác động từ bên ngoài để được thông báo
→ Động từ trong câu chia ở thể bị động
Trong câu có dấu hiệu của quá khứ đơn ‘yesterday’
⇒ Chia động từ ở thể bị động trong quá khứ
⇒ Chọn A
Dịch: Một giảm giá đặc biệt đối với văn phòng phẩm đã được thông báo trên trang web Write Things vào hôm qua.
Từ vựng:
announce (v): thông báo
announcement (n): bản thông cáo, thông báo
stationery (n): văn phòng phẩm'),
(@exercise_id_2, 13, 'Your order cannot _____ until we have received full payment.', 'to process', 'be processed', 'being processed', 'has processed', 'B', 'Đáp án đúng: B
Giải thích: Ta nhận thấy vị trí của từ loại cần điền đứng sau động từ khiếm khuyết ‘cannot’
→ Cần tìm một động từ chính ở dạng nguyên mẫu
Chủ ngữ của câu là ‘your order’ nghĩa là đơn hàng của bạn, đơn hàng chỉ sự vật, là đối tượng được nhận sự tác động từ bên ngoài
→ Động từ cần được chia ở thể bị động
⇒ Chọn đáp án B
Dịch: Đơn hàng của bạn không thể được xử lý cho đến khi chúng tôi nhận được thanh toán đầy đủ.
Từ vựng:
process (v, n): xử lý; quy trình
payment (n): thanh toán');

-- =====================================================
-- Thêm bài tập Ngữ pháp: Động từ nguyên mẫu có to
-- =====================================================

SET @topic_id_3 = (SELECT id FROM topics WHERE slug = 'dong-tu-nguyen-mau-co-to' LIMIT 1);

INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type)
VALUES (@topic_id_3, 15, 1, TRUE, 'GRAMMAR');

SET @exercise_id_3 = LAST_INSERT_ID();

INSERT IGNORE INTO exercise_questions (exercise_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id_3, 1, 'Mr. Kim would like a meeting about the Jasper account as soon as possible.', 'to arrange', 'arranging', 'having arranged', 'arrangement', 'A', 'Đáp án đúng: A
Giải thích: Ta có cấu trúc "would like to do something" nghĩa là "muốn làm điều gì đó"
→ Chọn đáp án A.
Dịch: Ông Kim muốn sắp xếp một cuộc họp về khách hàng Jasper càng sớm càng
tốt.
Từ vựng:
arrangement (n): sự sắp xếp
account (n): khách hàng'),
(@exercise_id_3, 2, 'Join us for dinner on Friday Mr. Yi''s promotion to Vice President of Marketing.', 'to celebrate', 'celebrates', 'will celebrate', 'celebrated', 'A', 'Đáp án đúng: A
Giải thích: Trong câu đã có động từ chính (câu cầu khiến) → Chọn A (động từ
nguyên mẫu có to đóng vai trò làm tân ngữ)
Lưu ý: "to do something" nghĩa là "để làm gì đó", được dùng để chỉ hành động mục
đích.
Dịch: Hãy tham gia bữa tối với chúng tôi vào thứ Sáu để ăn mừng việc ông Yi được
đề bạt làm Phó Giám đốc Tiếp thị.
Từ vựng:
- promotion (n): sự đề bạt, thăng chức
- celebrate (v): ăn mừng
- Vice President: phó giám đốc'),
(@exercise_id_3, 3, 'Hikers are invited the information center for trail maps of Far Valley Park.', 'visiting', 'to visit', 'visits', 'having visited', 'B', 'Đáp án đúng: B
Giải thích: Ta nhận thấy vị trí của từ cần điền đứng sau động từ chính ''are invited'' và
đứng trước cụm danh từ ''the information center''
→ Cần tìm một động từ nguyên mẫu có to (đóng vai trò như một danh từ) để bổ trợ
cho túc từ ''are invited đứng trước.
⇒ Chọn B
Dịch: Người đi bộ được mời tới để thăm trung tâm thông tin bản đồ đường mòn của
Công viên Far Valley.
Từ vựng:
- hiker (n): người đi bộ
- trail (n): đường mòn'),
(@exercise_id_3, 4, 'Kanelek Limited and Evensohn LLC have entered a strategic partnership to their', 'increased', 'increasing', 'increases', 'increase', 'D', 'Đáp án đúng: D
Giải thích: Ta nhận thấy từ loại cần điền đứng ở vị trí mệnh đề trạng ngữ cuối câu,
đứng sau từ to
→ Cần tìm một động từ đi sau tơ để tạo thành mệnh đề trạng ngữ hoàn chỉnh để tạo
thành lý do cho vế câu trước.
→ Chọn D
Dịch: Kanelek Limited và Evensohn LLC đã tham gia hợp tác chiến lược để làm tăng
cổ phần của họ.
Từ vựng:
- strategic (adj): chiến lược, mưu kế
- partnership (n): sự hợp tác
- market (n): thị trường
- share (n): thị phần, cổ phiếu'),
(@exercise_id_3, 5, 'Justlox, Inc., is planning to_ redesign Model 543Q with its partners in Britain to', 'collaboration', 'collaborative', 'collaboratively', 'collaborate', 'C', 'Đáp án đúng: C
Giải thích: Ta nhận thấy vị trí của từ loại cần điền đứng sau động từ chính trong câu
''is planning và đứng liền sau ''to''. Tuy nhiên, sau đó đã xuất hiện động từ nguyên mẫu
đi liền với ''to'' là ''redesign''
→→ Cần tìm một trạng từ bổ nghĩa cho động từ nguyên mẫu có to
Loại đáp án A (danh từ hậu tố -tion), đáp án B (tính từ hậu tố -ive) và đáp án D (động
từ)
→ Chọn C (trạng từ hậu tố -ly)
Dịch: Justlox, Inc., đang lên kế hoạch hợp tác để thiết kế lại Model 543Q với các đối
tác ở Anh để đảm bảo tạo ra sản phẩm tốt hơn.
Từ vựng:
- collaborate (v): hợp tác
- collaboration (n): sự hợp tác
- redesign (v): thiết kế lại
- ensure (v): đảm bảo'),
(@exercise_id_3, 6, 'On Thursday, the technician will be on Sratus Road --two gas stoves.', 'serviced', 'service', 'to service', 'is servicing', 'C', 'Đáp án đúng: C
Giải thích: Chỗ trống cần điền đứng trước cụm danh từ "two gas stoves", trước đó đã
có động từ chính “will be" → Loại B (động từ thường) và D (động từ chia thì hiện tại
tiếp diễn)
Xét theo nghĩa, chọn đáp án C
Lưu ý: Cấu trúc "to do something"~ để làm gì đó được dùng chỉ mục đích.
Tạm dịch: Vào thứ Năm, kỹ thuật viên sẽ có mặt trên đường Sratus để bảo dưỡng hai
bếp gas.
Từ vựng:
- technician (n): kỹ thuật viên
- service (v): bảo dưỡng'),
(@exercise_id_3, 7, 'As consumers buy more products online, retailers are finding ways_ orders more', 'have delivered', 'are delivering', 'to deliver', 'delivers', 'C', 'Đáp án đúng: C
Giải thích: Ta nhận thấy từ loại cần tìm đứng trong vế câu đã có động từ chính ''are
finding'', ở vế câu trước cũng đã có đủ thành phần
→ Loại đáp án A (động từ chia thì hiện tại hoàn thành), đáp án B (động từ chia thì
hiện tại tiếp diễn) và đáp án D (động từ chia thì hiện tại đơn)
⇒ Chọn C (động từ nguyên mẫu có to chỉ lý do)
Dịch: Vì khách hàng mua các sản phẩm trực tuyến nhiều hơn, các nhà bán lẻ đang
tìm cách để giao đơn hàng nhanh chóng hơn.
Từ vựng:
- consumer (n): người tiêu dùng
- retailer (n): nhà bán lẻ'),
(@exercise_id_3, 8, 'Many businesses promote carpooling traffic congestion.', 'is prevented', 'prevent', 'to prevent', 'prevented', 'C', 'Đáp án đúng: C
Giải thích: Ta nhận thấy chỗ trống cần điền nẫm sau một vế câu hoàn chỉnh, có đủ
chủ và vị ngữ. Giữa hai vế câu (1) ''many businesses promote carpooling'': nhiều
doanh nghiệp thúc đẩy việc đi xe chung và (2) ''traffic congestion'': tåc nghẽn giao
thông. Ta nhận thấy vế (2) mang ý nghĩa chỉ mục đích cho hành động ở vế (1)
→ Cần tìm một động từ nguyên mẫu có to đóng vai trò như trạng từ trong câu
⇒ Chọn С
Dịch: Rất nhiều doanh nghiệp thúc đẩy việc đi chung xe để ngăn chặn việc tắc nghẽn
giao thông.
Từ vựng:
- promote (v): thúc đẩy
- carpooling (n): đi chung xe
- prevent (v): ngăn chặn
- traffic congestion: tắc nghẽn giao thông'),
(@exercise_id_3, 9, 'Online shoppers who experience long waits for their orders tend the business', 'have given', 'gave', 'to give', 'giving', 'C', 'Đáp án đúng: C
Giải thích: Ta nhận thấy trong câu đã bao gồm đủ các thành phần, vị trí của từ cần
điền đứng sau động từ chính ''tend và đứng trước tân ngữ ''the business low ratings''
→ Cần tìm một động từ nguyên mẫu có tơ để tạo thành danh từ bổ nghĩa cho túc từ
''tend'' trong câu.
⇒ Chon C
Lưu ý: Ngoài ra, ta cũng có cấu trúc ''tend + to do something'' có nghĩa là ''có xu hướng
+ làm gì đó''
Dịch câu: Những người mua sắm trực tuyến mà trải nghiệm việc chờ đợi lâu mới
nhận được hàng có xu hướng cho doanh nghiệp đó đánh giá thấp.
Từ vựng:
- experience (v): trải nghiệm
- rating (n): đánh giá'),
(@exercise_id_3, 10, 'As the rental agreement with the Smith Group is set_ soon, the available office', 'expired', 'to expire', 'will have expired', 'expiring', 'B', 'Đáp án đúng: B
Giải thích: Ta nhận thấy vị trí của từ loại cần điền đứng sau động từ ở thể bị động ''is
set..'' (to be + V p.p)
→ Cần tìm một động từ nguyên mẫu có tơ đóng vai trò như một danh từ.
⇒ Chọn B
Dịch: Do thỏa thuận cho thuê với Smith Group hết hạn sớm, không gian văn phòng
khả dụng có thể được quảng cáo.
Từ vựng:
- rental (adj): thuê
agreement (n): thỏa thuận, hợp đồng
- expire (v): hết hạn
- advertise (v): quảng cáo'),
(@exercise_id_3, 11, 'The management team at Ofto Corporation offers incentives _ employee', 'stimulate', 'to stimulate', 'will stimulate', 'are stimulating', 'B', 'Đáp án đúng: B
Giải thích: Ta nhận thấy vị trí của từ cần điền đứng trong mệnh đề tân ngữ của câu,
trước đó đã có đủ các thành phần trong câu
Cần tìm một động từ nguyên mẫu có to phù hợp, đóng vai trò như danh từ để làm
bổ ngữ cho túc từ
⇒ Chọn B
Lưu ý: Ngoài ra, ta cũng có cấu trúc ''offer sth to V'' nghĩa là ''đưa ra cái gì để làm gì''.
Dịch: Đội ngũ quản lý tại Ofto Corporation đưa ra các ưu đãi để thúc đẩy năng suất
của nhân viên.
Từ vựng:
- corporation (n): tập đoàn
- incentive (n): ưu đãi
- stimulate (v): kích thích, thúc đẩy
- productivity (n): năng suất'),
(@exercise_id_3, 12, 'A good project manager strives_ communication between departments', 'to enhance', 'enhances', 'is enhancing', 'enhanced', 'A', 'Đáp án đúng: A
Giải thích: Ta nhận thấy vị trí của từ loại cần điền nằm sau động từ ''strives'' và đứng
trước vế câu ''communication between departments whenever possible
→ Cần tìm một động từ nguyên mẫu có to (chức năng như danh từ) để bổ nghĩa cho
túc từ ''strives'' đứng trước
Loại đáp án B (động từ chia thì hiện tại đơn), đáp án C (động từ chia thì hiện tại tiếp
diễn) và đáp án D (động từ chia thì quá khứ đơn)
⇒ Chọn đáp án A
Lưu ý: Ta cũng có cấu trúc ''strive to do sth'' = ''cố gắng làm gì đớ
Dịch: Một người quản lý dự án tốt luôn phấn đấu tăng cường giao tiếp giữa các
phòng ban bất cứ khi nào có thể.
Từ vựng:
strive (v): phấn đấu
enhance (v): tăng cường, cải thiện
department (n): phòng ban'),
(@exercise_id_3, 13, 'The new computer security program allows users to any suspicious activity on', 'monitoring', 'monitors', 'monitored', 'monitor', 'D', 'Đáp án đúng: D
Giải thích: Ta nhận thấy vị trí từ cần điền đứng sau ''tơ'' + động từ chính ''allow'' và nằm
trong tân ngữ của câu.
→ Cần tìm một động từ nguyên mẫu (đóng vai trò như trạng từ) và chỉ kết quả của
động từ chính ''allow''
Loại đáp án A (động từ đuôi -ing), đáp án B (động từ đuôi -(e)s) và đáp án C (động từ
đuôi -ed)
⇒ Chọn đáp án D
Dịch: Chương trình bảo mật máy tính mới cho phép người dùng theo dõi mọi hoạt
động đáng nghi trên tài khoản của họ.
Từ vựng:
security (n): bảo mật
- monitor (v): theo dõi
- suspicious (adj): đáng nghi'),
(@exercise_id_3, 14, 'The CEO held a press conference to-for the negative health effects caused by', 'apologized', 'apologize', 'apologizes', 'apologizing', 'B', 'Đáp án đúng: B
Giải thích: Câu hỏi yêu cầu điền dạng đúng của động từ sau "to". Ta có thể dễ dàng
loại đáp án A và C vì sau giới từ, động từ chỉ có 2 dạng: V nguyên mẫu hoặc Ving. Ta
nhận thấy đây là dạng V nguyên mẫu có "to" được dùng làm trạng từ chỉ mục đích =<
đáp án B.
Dịch: Vị CEO ấy đã tổ chức một buổi họp báo để xin lỗi về những tác hại xấu đến sức
khỏe do sản phẩm của công ty bà ấy gây ra.
Từ vựng:
Press conference (n): họp báo
To hold (a press conference) (v): tổ chức (một buổi họp báo)
Negative (adj): tiêu cực'),
(@exercise_id_3, 15, 'In an attempt sustainable energy, city officials have had solar panels affixed to', 'generates', 'generated', 'generating', 'to generate', 'D', 'Đáp án đúng: D
Giải thích: Vi theo sau giới từ “in" là một danh từ/cụm danh từ, không thể là một câu
=> loại đáp án A. Dựa vào nghĩa của từ, phân từ ở dạng chủ động và bị động đều
không thể sử dụng được => loại đáp án B và C. Sau danh từ "attempt" luôn là giới từ
"at" hoặc "to" với cấu trúc như sau: attempt at doing sth hoặc attempt to do sth (cả 2
cấu trúc đều có ý nghĩa là nỗ lực để làm gì) => đáp án D
*Ở đáp án D, dạng động từ nguyên mẫu có to (to generate) đóng vai trò là tính từ để
bổ nghĩa cho danh từ "attempt" (một nỗ lực để tạo ra năng lượng bền vững)
Dịch: Trong nỗ lực nhằm tạo ra năng lượng bền vững, các quan chức thành phố đã
lắp đặt các tấm quang năng vào một số tòa nhà công cộng.
Từ vựng:
Attempt (n): sự nỗ lực, cố gằng
Generate (v): tạo ra
Sustainable energy (n): năng lượng bền vững
Solar panel (n): tấm quang năng
Affix (v): gån vào, thêm vào');

-- =====================================================
-- Thêm bài tập Ngữ pháp: Danh động từ
-- =====================================================

SET @topic_id_4 = (SELECT id FROM topics WHERE slug = 'danh-dong-tu' LIMIT 1);

INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type)
VALUES (@topic_id_4, 9, 1, TRUE, 'GRAMMAR');

SET @exercise_id_4 = LAST_INSERT_ID();

INSERT IGNORE INTO exercise_questions (exercise_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id_4, 1, 'South Regent Aviation is adopting measures to reduce fuel expenses by_ cargo', 'light', 'lighten', 'lightly', 'lightening', 'D', 'Đáp án đúng: D
Giải thích: Ta nhận thấy vị trí từ loại cần tìm đứng sau giới từ ''by và cụm danh từ
''cargo loads''
→ Cần tìm một danh động từ để tạo thành túc từ trong câu.
Danh động từ là động từ nguyên mẫu thêm -ing được dùng làm danh từ trong câu.
Danh động từ có thể đứng sau giới từ và đóng vai trò là túc từ của giới từ.
⇒ Chon D.
Dịch: South Regent Aviation đang áp dụng các biện pháp để giảm chi phí nhiên liệu
bằng cách giảm tải hàng hóa.
Từ vựng:
- measure (v, n): đo đếm, định lượng; giải pháp
- reduce (v) = lighten (v): giảm
- fuel (n): nhiên liệu
- expense (n): chi phí
cargo (n): hàng hóa
- load (n): trọng tải'),
(@exercise_id_4, 2, 'Please save spreadsheets periodically when updating them to prevent data from _', 'is lost', 'lost', 'being lost', 'losing', 'C', 'Đáp án đúng: C
Giải thích: Ta nhận thấy vị trí của từ cần điền đứng sau giới từ from''
→→ Cần tìm một danh động từ (danh từ)
→ Loại đáp án A (động từ ở thể bị động hiện tại đơn) và đáp án B (động từ)
Chủ ngữ trong câu là ''data'' - ''dữ liệu. ''Dữ liệu không thể tự mất đi, chúng phải được
nhận tác động từ bên ngoài mới bị mất
→ Chia ở thể bị động
⇒ Chọn C
Lưu ý: Ta cũng có cấu trúc ''prevent sth/sb from doing sth'': ngăn cản ai/cái gì khỏi
việc làm gì
Dịch: Vui lòng lưu trang tính thường xuyên khi cập nhật chúng để tránh việc dữ liệu bị
mất.
Từ vựng:
- periodically (adv) định kỳ, thường xuyên'),
(@exercise_id_4, 3, 'For optimal safety on the road, avoid the view of the rear window and side-view', 'obstructs', 'obstructed', 'obstruction', 'obstructing', 'D', 'Đáp án đúng: D
Giải thích: Ta nhận thấy vị trí của từ loại cần điền đứng sau động từ ''avoid'' và đứng
trước danh từ ''the view''
Đối với động từ ''avoid'' có hai cấu trúc: avoid + V-ing hoặc avoid + danh từ
Loại đáp án A và B (động từ thêm đuôi -s và đuôi -ed)
Bởi vì từ cần điền đứng trước danh từ ''the view'' → chỉ còn trường hợp avoid + V-ing
(lúc đó danh từ ''the view'' sẽ đứng sau làm tân ngữ của động từ)
⇒ Chọn đáp án D
Dịch câu: Để an toàn tối ưu trên đường, tránh che khuất tầm nhìn của cửa sổ phía
sau và các gương bên.
Từ vựng:
- optimal (adj): tối ưu
- safety (n): sự an toàn
- avoid (v): tránh
obstruct (v): cản trở, obstruction (n): sự cản trở
- rear window: cửa số phía sau
- side-view mirror: gương bên'),
(@exercise_id_4, 4, 'The company plans on_ the salespeople for the expenses they incurred while', 'reimbursement', 'reimbursed', 'reimburse', 'reimbursing', 'D', 'Đáp án đúng: D
Giải thích: Ta có cụm động từ ''plan on doing something'' nghĩa là ''lên kế hoạch làm
gì
⇒ Chọn D.
Dịch nghĩa: Công ty lên kế hoạch hoàn tiền lại cho những nhân viên kinh doanh
những khoản chi phí mà họ đã gánh (tự bỏ tiền túi ra để trả trước) khi tham dự hội
nghị.
Từ vựng:
- reimburse (v): hoàn tiền lại
- reimbursement (n): sự hoàn trả (tiền bạc)
salespeople (n): nhân viên kinh doanh
conference (n): hội nghị'),
(@exercise_id_4, 5, 'The vice president of Chestonville Bank believes that _ employees is vital to the', 'empowered', 'empower', 'empowering', 'empowers', 'C', 'Đáp án đúng: C
Phân tích: Ta nhận thấy vị trí của từ loại cần điền đứng sau ''that'' (dấu hiệu của mệnh
đề danh ngữ) và đứng trước danh từ ''employees''
→ Cần tìm một danh động từ để kết hợp với ''employees'' tạo thành chủ ngữ trong
mệnh đề
Loại đáp án A (động từ đuôi -ed), đáp án B (động từ) và đáp án D (động từ đuôi -(e)s)
⇒ Chọn C
Dịch: Phó chủ tịch của Chestonville Bank tin rằng việc trao quyền cho nhân viên là
yếu tố sống còn đối với thành công của công ty.
Từ vựng:
- vice president: phó chủ tịch
empower (v): trao quyền, ủy quyền
- vital (adj): quan trọng'),
(@exercise_id_4, 6, 'By offices in London, Paris, and Madrid, Sedgehill Ltd. has continued its growth', 'opening', 'opened', 'opens', 'open', 'A', 'Đáp án đúng: A
Giải thích: Ta nhận thấy vị trí của từ loại cần điền đứng sau giới từ ''by và nằm trong
mệnh đề trạng ngữ, trong mệnh đề trạng ngữ vẫn chưa có chủ ngữ
Cần tìm một danh động từ (đóng vai trò làm chủ ngữ trong câu)
Chọn đáp án A
Dịch: Bằng cách mở văn phòng tại London, Paris và Madrid, Sedgehill Ltd. đã tiếp nối
sự phát triển của họ sang thị trường nước ngoài.
Từ vựng:
- Ltd. (Limited Liability Company): công ty trách nhiệm hữu hạn
- growth (n): sự phát triển
market (n): thị trường
- overseas (adj, adv): nước ngoài'),
(@exercise_id_4, 7, 'Despite declines in revenue over the past six months, the Mori & McGee firm', 'will experience', 'having experienced', 'has experienced', 'have been experiencing', 'B', 'Đáp án đúng: B
Giải thích: Ta nhận thấy vị trí của từ loại cần điền nằm sau ''despite'' (cấu trúc ''despite
+N) và nằm trong mệnh đề trạng ngữ, tuy nhiên trong đáp án không có động từ
→ Cần tìm một danh động từ có vai trò như danh từ
Loại đáp án A (động từ chia thì tương lai đơn), đáp án C (động từ chia thì hiện tại
hoàn thành) và đáp án D (động từ chia thì hiện tại hoàn thành tiếp diễn)
⇒ Chọn B (danh động từ chia ở thì hiện tại hoàn thành)
Dịch: Mặc dù đã trải qua việc doanh thu bị giảm trong 6 tháng vừa qua, công ty Mori
& McGee dự định thuê thêm ba luật sư chuyên về bằng sáng chế mới vào năm tới.
Từ vựng:
- decline (n, v): sự sụt giảm; giảm
- revenue (n): doanh thu
- firm (n): công ty
- intend to: định làm gì
- patent lawyer: luật sư bằng sáng chế'),
(@exercise_id_4, 8, 'After the neighborhood, Mr. Park decided not to move his café to Thomasville.', 'evaluation', 'evaluate', 'evaluating', 'evaluated', 'C', 'Đáp án đúng: C
Giải thích: Ta cần điền dạng đúng của từ evaluate đứng sau liên từ "after"
Vì đứng sau từ cần điền là một danh từ có mạo từ => loại A vì 2 danh từ
evaluation và the neighborhood không thể đứng liền nhau mà không có từ nối
Sau khi loại trừ đáp án A, ta cần tìm dạng đúng của động từ evaluate đứng
sau liên từ "after"
Chủ ngữ của câu này là Mr.Park và chủ ngữ này đã được lược bỏ ở mệnh đề
phụ => mệnh đề phụ là một cấu trúc phân từ, với liên từ chỉ thời gian ''after''
được giữ lại (ghi nhớ 7 bài lý thuyết về cấu trúc phân từ)
Loại đáp án B vì phân từ chỉ được dùng dưới 2 dạng: chủ động (Ving) hoặc bị
động (Vpll)
Xét ở mệnh đề phụ, Mr. Park là người hiện hành động ''evaluate'' => loại các cấu
trúc bị động => loại đáp án D
=> đáp án đúng là C
Đây là cấu trúc phân từ có chức năng diễn tả thời gian:
Câu đầy đủ:
After Mr. Park evaluated the neighborhood, Mr. Park decided not to move his café to
Thomasville
= After evaluating the neighborhood, Mr. Park decided not to move his café to
Thomasville".
Dịch: Sau khi đánh giá khu vực lân cận, ông Park quyết định không chuyển quán cà
phê của mình đến Thomasville.
Từ vựng:
Evaluation (n): sự đánh giá
Neighborhood (n): khu vực lân cận'),
(@exercise_id_4, 9, 'You must close the application before the installation of the software update.', 'to begin', 'beginning', 'must begin', 'begins', 'B', 'Đáp án đúng: B
Giải thích: Chỗ trống cần điền đứng sau giới từ → Cần điền một danh từ/ Ving
→ Loại A, C, D
→ Chọn B
Lưu ý: Một số cấu trúc
- begin something: bắt đầu việc gì đó
- before doing something: trước khi làm việc gì đó
Dịch: Bạn phải đóng ứng dụng trước khi bắt đầu việc cài đặt bản cập nhật phần
mềm.
Từ vựng:
- update (v): cập nhật
update (n): bản cập nhật, sự cập nhật
application (n): ứng dụng');

-- =====================================================
-- Thêm bài tập Ngữ pháp: Phân từ và cấu trúc phân từ
-- =====================================================

SET @topic_id_5 = (SELECT id FROM topics WHERE slug = 'phan-tu-va-cau-truc-phan-tu' LIMIT 1);

INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type)
VALUES (@topic_id_5, 14, 1, TRUE, 'GRAMMAR');

SET @exercise_id_5 = LAST_INSERT_ID();

INSERT IGNORE INTO exercise_questions (exercise_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id_5, 1, 'The spreadsheet-- data on retail sales during the fourth quarter is attached.', 'contains', 'contained', 'containing', 'containable', 'C', 'Đáp án đúng: C
Giải thích: Ta cần điền dạng đúng của động từ ''contain'' trong câu hỏi này
Vì trong câu đã có một động từ chính "is attached" => loại đáp án A (vì nếu trong câu
có 2 động từ thì ta cần liên từ để nối hai động từ đó)
Loại đáp án D vì tính từ không đứng sau danh từ
Ta thấy chủ ngữ ''spreadsheet'' là chủ thể bao gồm số liệu. Đồng thời, sau từ cần điền
là một danh từ
=> Loại đáp án B (vì sau phân từ quá khứ không có tân ngữ)
=> đáp án đúng là C
Đây là dạng câu hỏi rút gọn mệnh đề quan hệ. Câu đầy đủ khi chưa rút gọn mệnh đề
quan hệ như sau:
The spreadsheet which/that contains data on retail sales during the fourth quarter is
attached.
Sau khi rút gọn, đại từ quan hệ which/that được lược bỏ và động từ ''contain'' ở dạng
chủ động được chuyển thành phân từ ''containing''.
Dịch: Bảng tính chứa dữ liệu về doanh số bán lẻ trong quý 4 được đính kèm.
Từ vựng:
Spreadsheet (n): bảng tính
Contain (v): bao gồm, gồm có
Retail (n): bán lẻ
Sales (n): doanh số'),
(@exercise_id_5, 2, 'The recently_ mayor said she plans to address the town''s traffic problems soon.', 'electing', 'election', 'elected', 'elects', 'C', 'Đáp án đúng: C
Giải thích: Chỗ trống đứng trước danh từ "mayor" nên có thể điền một tính từ để bổ
nghĩa cho danh từ này. Trạng từ "recently" lại bố nghĩa cho tính từ điền vào.
→ Loại B, D.
Dựa vào nghĩa để chọn đáp án đúng
→ Chọn đáp án C.
Dịch: Thị trưởng được bầu gần đây cho biết bà có kế hoạch sớm giải quyết các vấn
đề giao thông của thị trấn.
Từ vựng:
- mayor: (n) thị trưởng
- address: (v) xác định, giải quyết'),
(@exercise_id_5, 3, 'If you are not- with your Electoshine toothbrush, you may return it for a full', 'satisfaction', 'satisfying', 'satisfied', 'satisfy', 'C', 'Đáp án đúng: C
Giải thích: Ta nhận thấy vị trí của từ loại cần điền là đứng sau động từ tobe ''are not''
và đứng trước giới từ ''with''
→ Cần điền một tính từ
→ Loại đáp án A (danh từ có hậu tố -tion) và đáp án D (động từ)
Cả đáp án B và C đều là tính từ nhưng khác hậu tố:
Tính từ có hậu tố ''eď được dùng để miêu tả cảm xúc, cảm nhận của con
người, con vật về một sự vật, sự việc, hiện tượng nào đó; sử dụng khi danh từ
mà nó bổ nghĩa là đối tượng nhận sự tác động của hành động.
Tính từ có hậu tố ''ing được dùng để miêu tả tính cách, tính chất, đặc điểm
của một sự vật sự việc nào đó mang lại cảm giác gì cho người khác; sử dụng
khi danh từ mà nó bổ nghĩa thực hiện chịu trách nhiệm về hành động.
Ở đây ta thấy, tính từ cần điền phải miêu tả cảm xúc của chủ thể ''you''về ''Electoshine
toothbrush''
→ Chọn đáp án C
Dịch: Nếu bạn không hài lòng với bàn chải Electoshine của mình, bạn có thể trả lại và
được hoàn tiền 100%.
Từ vựng:
satisfy (v): hài lòng
satisfaction (n): sự hài lòng
- full refund: hoàn trả đầy đủ'),
(@exercise_id_5, 4, 'Tours run every day, but there may be availability on weekends.', 'limit', 'limits', 'limited', 'limitation', 'C', 'Đáp án đúng: C
Giải thích: Ta nhận thấy vị trí của từ loại cần tìm đứng trước danh từ ''availability''
→ Cần tìm một tính từ (phân từ) bổ nghĩa cho nó
Loại đáp án A và B (vừa là danh từ vừa là động từ), đáp án D (danh từ hậu tố -tion)
Ở đây danh từ ''availability'' nghĩa là khả dụng (mang ý chỉ chỗ trống khả dụng khi đặt
trong ngữ cảnh câu), các chỗ trống khả dụng không thể tự có hành động giới hạn
chúng mà cần nhận sự tác động bên ngoài (mối quan hệ bị động)
→ Cần một phân từ quá khứ
Chọn C
Dịch: Các chuyến tham quan chạy đều mỗi ngày, tuy nhiên vẫn có thể có chỗ trống
khả dụng ở mức giới hạn vào các ngày cuối tuần.
Từ vựng:
- tour (v, n): tham quan; chuyến tham quan
limited (adj): giới hạn
availability (n): chỗ trống sự khả dụng'),
(@exercise_id_5, 5, 'Poet Yoshino Nagao will read from her latest_ collection at Argyle Library on', 'publisher', 'publish', 'published', 'publishes', 'C', 'Đáp án đúng: C
Giải thích: Ta nhận thấy vị trí của từ loại cần tìm đứng trước danh từ ''collection''
→ Cần tìm một tính từ (phân từ) bổ nghĩa cho nó
Loại đáp án A (danh từ), đáp án B và D (động từ)
⇒ Chọn C (tính từ hậu tố -ed)
Dịch: Nhà thơ Yoshino Nagao sẽ đọc (thơ) từ tuyển tập được xuất bản mới nhất của
cô ấy tại thư viện Argyle vào thứ Sáu.
Từ vựng:
poet (n): nhà thơ
- latest (adj): mới nhất
- publish (v): xuất bản
- collection (n): tuyển tập, bộ sưu tập'),
(@exercise_id_5, 6, 'Profits at Talhee Beverage Co. rose about 4 percent last year, according to new', 'to release', 'releasing', 'released', 'have released', 'C', 'Đáp án đúng: C
Giải thích: Chỗ trống cần điền nằm trong mệnh đề phụ. Ở đây động từ ''release''- công
bố, khi đi kèm với ''figures'' phải được chia ở phân từ quá khứ (số liệu không thể công
bố, phải là được công bổ)
→ Chọn C
Tạm dịch: Theo số liệu mới được công bố bởi công ty, lợi nhuận tại Công ty Nước giải
khát Talhee đã tăng khoảng 4% vào năm ngoái.
Từ vựng:
- profit (n): lợi nhuận
- release (v): công bố, ra måt'),
(@exercise_id_5, 7, 'Any letter sensitive information should be sent using a courier service.', 'contains', 'containing', 'will contain', 'has contained', 'B', 'Đáp án đúng: B
Giải thích: Trong câu đã có động từ chính "should be sent" → Loại A, C, D
→ Chọn B
Ngoài ra, trong câu này có sử dụng cấu trúc rút gọn mệnh đề quan hệ. Rút gọn:
"which contains"→ "containing"
Dịch: Bất kỳ thư nào chứa thông tin nhạy cảm phải được gửi bằng dịch vụ chuyển
phát nhanh.
Từ vựng:
sensitive (adj): nhạy cảm, thuộc về cảm giác, có cảm giác.
- courier (n): chuyển phát nhanh'),
(@exercise_id_5, 8, 'Everyone at the annual Tirnaco exposition seemed_ by the new products on', 'excite', 'excitement', 'excited', 'excitedly', 'C', 'Đáp án đúng: C
Giải thích: Ta nhận thấy vị trí của từ loại cần điền đứng sau động từ nối ''seem'', theo
sau ''seem'' là một tính từ
→ Cần tìm một tính từ (phân từ)
Ta nhận thấy ở đây chủ ngữ là ''everyone'', tính từ hứng thứ cần điền là tính từ chỉ
trạng thái cảm xúc của chủ ngữ
→ Điền tính từ có hậu tố -ed
Loại đáp án A (động từ), đáp án B (danh từ hậu tố -ment) và đáp án D (trạng từ hậu
tố -ly)
⇒ Chon C
Dịch: Người tham dự triển lãm Tirnaco thường niên dường như rất hứng thú với các
sản phẩm mới được trưng bày.
Từ vựng:
- annual (adj): thường niên
- exposition (n): triển lãm
excited (adj): hứng thú
excitement (n): sự hứng thú
on display: được trưng bày'),
(@exercise_id_5, 9, 'Flu season is here, so take advantage of the free flu shots_ in the lobby', 'being offered', 'to offer', 'offering', 'offers', 'A', 'Đáp án đúng: A
Giải thích: Động từ cần điền "offer" - cung cấp. Danh từ "free flu shots" đứng trước
chỗ trống, ta nhận thấy "mũi tiêm phòng cúm" không thể tự cung cấp, chúng phải
được cung cấp
→ Chọn A (phân từ dạng bị động)
Dịch: Mùa cúm đã đến rồi, vì vậy hãy tranh thủ đi tiêm phòng cúm miễn phí đang
được cung cấp tại sảnh đợi.
Từ vựng:
- Flu season (n) mùa dịch cúm
- take advantage of (v.phr) nhân cơ hội
shot (n) tiêm thuốc'),
(@exercise_id_5, 10, 'Mr. Wijaya is reviewing the resumes to select the candidate best for the', 'qualify', 'qualifications', 'qualifying', 'qualified', 'D', 'Đáp án đúng: D
Giải thích: Ta nhận thấy vị trí của từ loại đứng ở mệnh đề tân ngữ, đứng sau danh từ
''candidate'' và so sánh nhất ''best''
→ Cần tìm một phân từ làm bổ ngữ cho danh từ ''candidate
Ở đây, ta nhận thấy phân từ cần tìm và danh từ ''candidate (được bổ nghĩa) có mối
liên quan (sự xuất sắc của các ứng viên đã luôn có, có ý nghĩa bị động hoặc đã hoàn
thành)
→ Phân từ cần chọn ở thể bị động
⇒ Chọn D
Dịch: Ông Wijaya đang xem lại các sơ yếu lý lịch để lựa chọn ứng viên có đủ năng lực
nhất cho vị trí.
Từ vựng:
- resume (n): sơ yếu lý lịch
select (v): chọn
- candidate (n): ứng viên
- qualify (v): hoàn thành việc rèn luyện, có đủ quyền để làm gì
- qualification (n): chứng chỉ'),
(@exercise_id_5, 11, 'At the panel discussion, Ms. Yang made a argument for environmentally', 'convince', 'convincing', 'convinced', 'convincingly', 'B', 'Đáp án đúng: B
Phân tích: Ta nhận thấy từ loại cần điền đứng trước danh từ ''argument''
→ Cần tìm một tính từ
Loại đáp án A (động từ) và đáp án D (trạng từ có hậu tố -ly)
Cả đáp án B và C đều là tính từ nhưng khác hậu tố:
Tính từ có hậu tố ''eď được dùng để miêu tả cảm xúc, cảm nhận của con
người, con vật về một sự vật, sự việc, hiện tượng nào đó; sử dụng khi danh từ
mà nó bố nghĩa là đối tượng nhận sự tác động của hành động.
Tính từ có hậu tố ''ing'' được dùng để miêu tả tính cách, tính chất, đặc điểm
của một sự vật sự việc nào đó mang lại cảm giác gì cho người khác; sử dụng
khi danh từ mà nó bổ nghĩa thực hiện chịu trách nhiệm về hành động.
Trong trường hợp trên, tính từ mang nghĩa ''thuyết phục'', ý nói đến tính chất của cuộc
tranh luận là rất thuyết phục
⇒ Chọn B
Dịch: Tại cuộc thảo luận nhóm, bà Yang đã đưa ra một lập luận thuyết phục cho các
hoạt động kinh doanh có trách nhiệm với môi trường.
Từ vựng:
- panel discussion: thảo luận nhóm
- convince (v): thuyết phục
- argument (n): tranh luận, tranh cãi'),
(@exercise_id_5, 12, 'Ms. Luo will explain some possible consequences of the _ merger with the', 'proposed', 'proposal', 'proposition', 'proposing', 'A', 'Đáp án đúng: A
Giải thích: Ta nhận thấy vị trí từ loại cần điền nằm trước danh từ ''merger'' và nåm sau
mạo từ ''the → Cần tìm một tính từ
→ Loại đáp án B và C (đều là danh từ)
Đáp án A và D đều là tính từ nhưng mang hậu tố khác nhau
Tính từ có hậu tổ ''eď'' được dùng để miêu tả cảm xúc, cảm nhận của con
người, con vật về một sự vật, sự việc, hiện tượng nào đó; sử dụng khi danh từ
mà nó bổ nghĩa là đối tượng nhận sự tác động của hành động.
Tính từ có hậu tố ''ing'' được dùng để miêu tả tính cách, tính chất, đặc điểm
của một sự vật sự việc nào đó mang lại cảm giác gì cho người khác; sử dụng
khi danh từ mà nó bổ nghĩa thực hiện chịu trách nhiệm về hành động.
Ở đây ta thấy, ''merger''- cuộc sáp nhập cần được đề xuất, nó là đối tượng được nhận
sự tác động của việc đề xuất
⇒ Chọn A
Dịch: Ms. Luo sẽ giải thích một số hệ quả có thể xảy ra của cuộc sáp nhập được đề
xuất với Tập đoàn Wilson-Peek.
Từ vựng:
- propose (v): đề xuất
- proposal (n): lời đề nghị, lời cầu hôn
- proposition (n): công việc, dự định
- consequence (n): hệ quả
- merger(n): cuộc sáp nhập, sự hợp nhất'),
(@exercise_id_5, 13, 'Ms. Larensky is applying with several different agencies to obtain the permits', 'required', 'requiring', 'requires', 'will require', 'A', 'Đáp án đúng: A
Giải thích: Ta nhận thấy vị trí của từ loại cần điền đứng sau danh từ ''the permits'',
nằm trong thành phần trạng ngữ
→ Cần tìm một phân từ (đóng vai trò như một tính từ bổ nghĩa cho danh từ the
permits'' đứng trước)
Loại đáp án C (động từ đuôi -(e)s) và đáp án D (trợ động từ will + động từ)
Ta nhận thấy danh từ the permits'' nghĩa là ‘giấy phép'', danh từ này có mối quan hệ bị
động với phân từ (giấy phép'' được yêu cầu, không thể tự mình ''yêu cầu được)
→ Ta chia phân từ ở quá khứ
Loại đáp án B (phân từ ở thể chủ động)
⇒ Chọn A
Dịch: Cô Larensky đang nộp hồ sơ cho nhiều đơn vị khác nhau để xin giấy phép được
yêu cầu cho sự kiện mỹ thuật ngoài trời.
Từ vựng:
apply (v): nộp, ứng tuyển
agency (n): đơn vị
- obtain (v): kiếm
- permit (n, v): giấy phép; cho phép
- require (v): yêu cầu'),
(@exercise_id_5, 14, 'After the_ upgrades have been implemented, the production process should run', 'suggest', 'suggested', 'suggesting', 'suggests', 'B', 'Đáp án đúng: B
Giải thích: Ta nhận thấy vị trí của từ loại đứng trước danh từ ''upgrades''
→ Cần tìm một tính từ
Tuy nhiên, trong đáp án chỉ có các dạng của động từ ''suggest'' → Cäần biến đổi động
từ ''suggesť thành một phân từ (đóng vai trò như tính từ)
Loại đáp án A (động từ nguyên thể) và đáp án B (động từ đuôi -(e)ss)
Xét mối quan hệ giữa phân từ và chủ thể, ''upgrades'' - cải tiến không thể tự gợi ý mà
cần được tác động bởi đối tượng khác
→ Phân từ cần tìm chia ở thể bị động
⇒ Chọn đáp án B
Dịch: Sau khi sự cải tiến cái được gợi ý được tiến hành, quy trình sản xuất sẽ hoạt
động hiệu quả hơn.
Từ vựng:
suggest (v): gợi ý
- upgrade (n): nâng cấp, cải tiến
- implement (v): thực hiện
- efficiently (adv): một cách hiệu quả');

INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type)
VALUES (@topic_id_5, 8, 1, TRUE, 'GRAMMAR');

SET @exercise_id_5 = LAST_INSERT_ID();

INSERT IGNORE INTO exercise_questions (exercise_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id_5, 1, 'The spreadsheet-- data on retail sales during the fourth quarter is attached.', 'contains', 'contained', 'containing', 'containable', 'C', 'Đáp án đúng: C
Giải thích: Ta cần điền dạng đúng của động từ ''contain'' trong câu hỏi này
Vì trong câu đã có một động từ chính "is attached" => loại đáp án A (vì nếu trong câu
có 2 động từ thì ta cần liên từ để nối hai động từ đó)
Loại đáp án D vì tính từ không đứng sau danh từ
Ta thấy chủ ngữ ''spreadsheet'' là chủ thể bao gồm số liệu. Đồng thời, sau từ cần điền
là một danh từ
=> Loại đáp án B (vì sau phân từ quá khứ không có tân ngữ)
=> đáp án đúng là C
Đây là dạng câu hỏi rút gọn mệnh đề quan hệ. Câu đầy đủ khi chưa rút gọn mệnh đề
quan hệ như sau:
The spreadsheet which/that contains data on retail sales during the fourth quarter is
attached.
Sau khi rút gọn, đại từ quan hệ which/that được lược bỏ và động từ ''contain'' ở dạng
chủ động được chuyển thành phân từ ''containing''.
Dịch: Bảng tính chứa dữ liệu về doanh số bán lẻ trong quý 4 được đính kèm.
Từ vựng:
Spreadsheet (n): bảng tính
Contain (v): bao gồm, gồm có
Retail (n): bán lẻ
Sales (n): doanh số'),
(@exercise_id_5, 2, 'The recently_ mayor said she plans to address the town''s traffic problems soon.', 'electing', 'election', 'elected', 'elects', 'C', 'Đáp án đúng: C
Giải thích: Chỗ trống đứng trước danh từ "mayor" nên có thể điền một tính từ để bổ
nghĩa cho danh từ này. Trạng từ "recently" lại bố nghĩa cho tính từ điền vào.
→ Loại B, D.
Dựa vào nghĩa để chọn đáp án đúng
→ Chọn đáp án C.
Dịch: Thị trưởng được bầu gần đây cho biết bà có kế hoạch sớm giải quyết các vấn
đề giao thông của thị trấn.
Từ vựng:
- mayor: (n) thị trưởng
- address: (v) xác định, giải quyết'),
(@exercise_id_5, 3, 'If you are not- with your Electoshine toothbrush, you may return it for a full', 'satisfaction', 'satisfying', 'satisfied', 'satisfy', 'C', 'Đáp án đúng: C
Giải thích: Ta nhận thấy vị trí của từ loại cần điền là đứng sau động từ tobe ''are not''
và đứng trước giới từ ''with''
→ Cần điền một tính từ
→ Loại đáp án A (danh từ có hậu tố -tion) và đáp án D (động từ)
Cả đáp án B và C đều là tính từ nhưng khác hậu tố:
Tính từ có hậu tố ''eď được dùng để miêu tả cảm xúc, cảm nhận của con
người, con vật về một sự vật, sự việc, hiện tượng nào đó; sử dụng khi danh từ
mà nó bổ nghĩa là đối tượng nhận sự tác động của hành động.
Tính từ có hậu tố ''ing được dùng để miêu tả tính cách, tính chất, đặc điểm
của một sự vật sự việc nào đó mang lại cảm giác gì cho người khác; sử dụng
khi danh từ mà nó bổ nghĩa thực hiện chịu trách nhiệm về hành động.
Ở đây ta thấy, tính từ cần điền phải miêu tả cảm xúc của chủ thể ''you''về ''Electoshine
toothbrush''
→ Chọn đáp án C
Dịch: Nếu bạn không hài lòng với bàn chải Electoshine của mình, bạn có thể trả lại và
được hoàn tiền 100%.
Từ vựng:
satisfy (v): hài lòng
satisfaction (n): sự hài lòng
- full refund: hoàn trả đầy đủ'),
(@exercise_id_5, 4, 'Tours run every day, but there may be availability on weekends.', 'limit', 'limits', 'limited', 'limitation', 'C', 'Đáp án đúng: C
Giải thích: Ta nhận thấy vị trí của từ loại cần tìm đứng trước danh từ ''availability''
→ Cần tìm một tính từ (phân từ) bổ nghĩa cho nó
Loại đáp án A và B (vừa là danh từ vừa là động từ), đáp án D (danh từ hậu tố -tion)
Ở đây danh từ ''availability'' nghĩa là khả dụng (mang ý chỉ chỗ trống khả dụng khi đặt
trong ngữ cảnh câu), các chỗ trống khả dụng không thể tự có hành động giới hạn
chúng mà cần nhận sự tác động bên ngoài (mối quan hệ bị động)
→ Cần một phân từ quá khứ
Chọn C
Dịch: Các chuyến tham quan chạy đều mỗi ngày, tuy nhiên vẫn có thể có chỗ trống
khả dụng ở mức giới hạn vào các ngày cuối tuần.
Từ vựng:
- tour (v, n): tham quan; chuyến tham quan
limited (adj): giới hạn
availability (n): chỗ trống sự khả dụng'),
(@exercise_id_5, 5, 'Poet Yoshino Nagao will read from her latest_ collection at Argyle Library on', 'publisher', 'publish', 'published', 'publishes', 'C', 'Đáp án đúng: C
Giải thích: Ta nhận thấy vị trí của từ loại cần tìm đứng trước danh từ ''collection''
→ Cần tìm một tính từ (phân từ) bổ nghĩa cho nó
Loại đáp án A (danh từ), đáp án B và D (động từ)
⇒ Chọn C (tính từ hậu tố -ed)
Dịch: Nhà thơ Yoshino Nagao sẽ đọc (thơ) từ tuyển tập được xuất bản mới nhất của
cô ấy tại thư viện Argyle vào thứ Sáu.
Từ vựng:
poet (n): nhà thơ
- latest (adj): mới nhất
- publish (v): xuất bản
- collection (n): tuyển tập, bộ sưu tập'),
(@exercise_id_5, 6, 'Profits at Talhee Beverage Co. rose about 4 percent last year, according to new', 'to release', 'releasing', 'released', 'have released', 'C', 'Đáp án đúng: C
Giải thích: Chỗ trống cần điền nằm trong mệnh đề phụ. Ở đây động từ ''release''- công
bố, khi đi kèm với ''figures'' phải được chia ở phân từ quá khứ (số liệu không thể công
bố, phải là được công bổ)
→ Chọn C
Tạm dịch: Theo số liệu mới được công bố bởi công ty, lợi nhuận tại Công ty Nước giải
khát Talhee đã tăng khoảng 4% vào năm ngoái.
Từ vựng:
- profit (n): lợi nhuận
- release (v): công bố, ra måt'),
(@exercise_id_5, 7, 'Any letter sensitive information should be sent using a courier service.', 'contains', 'containing', 'will contain', 'has contained', 'B', 'Đáp án đúng: B
Giải thích: Trong câu đã có động từ chính "should be sent" → Loại A, C, D
→ Chọn B
Ngoài ra, trong câu này có sử dụng cấu trúc rút gọn mệnh đề quan hệ. Rút gọn:
"which contains"→ "containing"
Dịch: Bất kỳ thư nào chứa thông tin nhạy cảm phải được gửi bằng dịch vụ chuyển
phát nhanh.
Từ vựng:
sensitive (adj): nhạy cảm, thuộc về cảm giác, có cảm giác.
- courier (n): chuyển phát nhanh'),
(@exercise_id_5, 8, 'Everyone at the annual Tirnaco exposition seemed_ by the new products on', 'excite', 'excitement', 'excited', 'excitedly', 'C', 'Đáp án đúng: C
Giải thích: Ta nhận thấy vị trí của từ loại cần điền đứng sau động từ nối ''seem'', theo
sau ''seem'' là một tính từ');

-- =====================================================
-- Thêm bài tập Ngữ pháp: Trạng từ
-- =====================================================

SET @topic_id_6 = (SELECT id FROM topics WHERE slug = 'trang-tu' LIMIT 1);

INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type)
VALUES (@topic_id_6, 16, 1, TRUE, 'GRAMMAR');

SET @exercise_id_6 = LAST_INSERT_ID();

INSERT IGNORE INTO exercise_questions (exercise_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id_6, 1, 'The information on the Web site of Croyell Decorators is _organized.', 'clear', 'clearing', 'clearest', 'clearly', 'D', 'Đáp án đúng: D
Giải thích: Ta cần điền một từ loại thích hợp mà đứng trước tính từ "organized" (được
sắp xếp, chuẩn bị)
Vì từ cần điền đứng trước tính từ nên ta cần một trạng từ để bổ nghĩa cho tính từ đó
=> loại đáp án A, B, C. (clear là tính từ, clearing là động từ đuôi V-ing, clearest là tính
từ ở dạng so sánh cao nhất)
=> Đáp án đúng là D.
Dịch: Thông tin trên trang web của Croyell Decorators được sắp xếp một cách rõ
ràng.
Từ vựng:
Organize (v): tổ chức/sắp xếp
Organized (adj): được tổ chức, chuẩn bị
Information (n): thông tin'),
(@exercise_id_6, 2, 'When applied, Tilda''s Restorative Cream reduces the appearance of fine lines', 'consistent', 'consist', 'consistently', 'consisting', 'C', 'Đáp án đúng: C
Giải thích:
Đây là dạng câu đã lược bỏ chủ ngữ ở mệnh đề phụ và mệnh đề phụ của câu
chính là một cấu trúc phân từ thể bị động (''Tilda''s Restorative Cream'' - chủ
ngữ chính của câu là một loại sản phẩm chịu tác động của hành động
''applied''- được sử dụng, nên phân từ phải ở dạng bị động)
Như vậy, từ cần điền đứng trước 1 động từ nên ta cần 1 trạng từ bổ nghĩa cho
nó
=> đáp án đúng là C
Lưu ý: như được nêu ở trên, trong câu có sử dụng cấu trúc phân từ thể bị động.
Câu đầy đủ là:
When Tilda''s Restorative Cream is consistently applied, Tilda''s Restorative Cream
reduces the appearance of fine lines and wrinkles = When consistently applied,
Tilda''s Restorative Cream reduces the appearance of fine lines and wrinkles.(khi rút
gọn, lược bỏ chủ ngữ trùng và trợ động từ "is").
Dịch: Khi được sử dụng đều đặn, Kem dưỡng Phục Hồi của Tilda làm giảm sự xuất
hiện của các vết nhăn và nếp nhăn.
Từ vựng:
reduce (v): giảm
wrinkle (n): nếp nhăn
Fine lines (n): vết nhăn nhỏ
Consistently (adv): đều đặn'),
(@exercise_id_6, 3, 'Glass containers must be _ secured during transport.', 'safely', 'safe', 'safety', 'safer', 'A', 'Đáp án đúng: A
Giải thích: Ta cần tìm dạng đúng của loại từ đứng trước động từ ''secured'' (đảm bảo)
=> cần một trạng từ để bổ nghĩa cho động từ (secure) đứng phía sau nó
=> đáp án đúng là A.
Dịch: Đồ đựng bằng thủy tinh phải được bảo đảm an toàn trong quá trình vận chuyển.
Từ vựng:
transport (n): sự chuyên chở, vận chuyển
safety (n): sự an toàn
safely (adv): một cách an toàn
Secure (v): đảm bảo'),
(@exercise_id_6, 4, 'Ms. Trinacria''s team is developing a kitchen faucet that can _ respond to voice', 'reliably', 'rely', 'reliability', 'reliable', 'A', 'Đáp án đúng: A
Giải thích: Ta cần điền một từ loại thích hợp mà vị trí của nó đứng trước động từ
''respond'' và đứng sau động từ khuyết thiếu ''can''
=> từ loại cần điền chỉ có thể là một trạng từ có chức năng bổ nghĩa cho động từ
đứng sau nó ''respond'' (phản hồi)
=> đáp án đúng là A
Dịch: Nhóm của cô Trinacria đang phát triển một loại vòi rửa bát có thể phản hồi các
khẩu lệnh một cách đáng tin cậy.
Từ vựng:
respond (v): phản ứng, phản hồi
Kitchen faucet (n): vòi rửa bát
Voice command (n): khẩu lệnh
Reliable (adj): có thể tin cây
Rely (v): tin cậy, dựa và'),
(@exercise_id_6, 5, 'Amand Corp.''s flexible work policy is beneficial to the company as employee', 'financially', 'finances', 'financial', 'to finance', 'A', 'Đáp án đúng: A
Giải thích: Ta cần tìm một từ loại thích hợp mà vị trí của nó đứng trước tính từ
''beneficial'' (có lợi)
=> chỗ trống cần có 1 trạng từ để bố nghĩa cho tính từ "beneficial" đứng ngay sau nó
=> Đáp án đúng là A.
Dịch: Chính sách làm việc linh hoạt của Amand Corp. có lợi về mặt tài chính cho
công ty vì tỷ lệ thay thế nhân viên nghỉ việc đạt mức thấp nhất.
Từ vựng:
employee (n): người lao động
beneficial (adj): có lợi
turnover (n): doanh số
employee (staff) turnover (n): tỷ lệ người lao động thôi việc'),
(@exercise_id_6, 6, 'Vallentrade manages clients'' accounts more ----- than most other brokerage firms.', 'conserves', 'conservative', 'conservatively', 'conserving', 'C', 'Đáp án đúng: C
Giải thích: Ta cần điền một từ loại thích hợp để điền vào chỗ trống
Phân tích cấu trúc câu ta thấy mệnh đề phía trước chỗ trống cần điền đã đầy đủ
S-V-O
=> từ cần điền là một trạng từ được dùng ở dạng so sánh hơn để bổ nghĩa cho động
từ ''manage ở phía trước
=> đáp án đúng là C
Dịch: Vallentrade quản lý tài khoản của khách hàng một cách thận trọng hơn hầu hết
các công ty môi giới khác.
Từ vựng:
Manage (v): quản lý
Conserve (v): duy trì, giữ gìn
Conservative (adj): (1) thận trọng; (2) để bảo tồn, duy trì; (3) bảo thủ
Brokerage (n): sự môi giới, nghề môi giới'),
(@exercise_id_6, 7, 'Ardentine Realty is seeking new rental properties for its portfolio.', 'actively', 'activate', 'activity', 'active', 'A', 'Đáp án đúng: A
Giải thích: Ta cần điền một từ loại thích hợp vào chỗ trống mà vị trí của nó ở trước
động từ chính của câu ''seeking'' và sau trợ động từ ''is
=> chỗ trồng cần điền chỉ có thể là một trạng từ có chức năng bổ nghĩa cho động từ
''seeking'' (được chia ở thì hiện tại tiếp diễn) đứng sau nó
=> đáp án đúng là A
Dich: Ardentine Realty đang tìm kiếm một cách tích cực các bất động sản cho thuê
mới cho danh mục đầu tư của mình.
Từ vựng:
- rental: (n,adj) tiền cho thuê, liên quan tới cho thuê
- portfolio: (n) danh mục đầu tư (đối với việc kinh doanh
- portfolio: (n) tài liệu tổng hợp những tác phẩm hoặc sản phẩm nổi bật mà một
người từng thực hiện trong quá khứ
- Property (n): của cải, tài sản'),
(@exercise_id_6, 8, 'Maxwell Copies prints brochures on thick, glossy paper that was selected for', 'caring', 'careful', 'carefully', 'cares', 'C', 'Đáp án đúng: C
Giải thích: Ta cần điền một từ loại thích hợp vào chỗ trống mà vị trí của nó đứng
trước động từ ''selected'' (được chia ở thể bị động) và đứng sau trợ động từ ''was''
=> chỗ trống cần điền chỉ có thể là một trạng từ với chức năng bổ nghĩa cho động từ
''selected'' đứng sau nó
=> đáp án đúng là C
Dịch: Maxwell Copies in tài liệu quảng cáo trên giấy bóng, dày đã được chọn lọc một
cách cẩn thận về chất lượng và độ bền của nó.
Từ vựng:
glossy: (adj) bóng
brochures: (n) tài liệu quảng cáo (dạng sách mỏng)
durability: (n) độ bền
Careful (adj): cấn thận'),
(@exercise_id_6, 9, 'Crane operators must check that all moving parts of the machine are fastened', 'security', 'securely', 'secures', 'securing', 'B', 'Đáp án đúng: B
Giải thích: ta cần điền một từ loại thích hợp vào chỗ trống mà vị trí của nó đứng sau
động từ ''fastened'' (chia ở thể bị động)
=> Chỗ trống cần có 1 trạng từ để bổ nghĩa cho động từ "fasten"
=> Đáp án đúng là B.
Dịch: Người vận hành cần trục phải kiểm tra để đảm bảo rằng tất cả các bộ phận
chuyển động của máy đã được gắn một cách an toàn trước khi sử dụng.
Từ vựng:
- crane: (n) máy trục, cần trục
- fasten: (v) buộc, gắn
part: (n) bộ phận
- secure (adj): chắc chẳn, bảo đảm
- secure (v): bảo đảm, giữ an ninh'),
(@exercise_id_6, 10, '_eighty thousand people attended yesterday''s soccer match.', 'Almost', 'More', 'Often', 'Enough', 'A', 'Đáp án đúng: A
Giải thích: Ta cần điền một trạng từ thích hợp vào chỗ trống đứng ở đầu câu
Xét nghĩa của từng trạng từ, ta có:
Almost: gần như, hầu như
More: Nhiều hơn => loại đáp án B vì khi dùng more để nhấn mạnh vào số lượng lớn
của 1 thứ gì thì cần có liên từ than đứng sau more (More than 20,000 demonstrators
crowded into the square.)
Often: thường xuyên
Enough: Đủ => loại đáp án D vì enough là trạng từ sẽ không đứng đầu câu mà chỉ
đứng sau một trạng từ khác hoặc đứng sau một tính từ (Is this box big enough for all
those books? / Strangely enough, no one seemed to notice that Boris was in his
pyjamas.)
Xét nghĩa của câu, ta có:
_ 80 nghìn người đã tham dự trận đấu bóng đá ngày hôm qua.
Dựa trên nghĩa đã phân tích của từng đáp án và câu
=> đáp án đúng là A
Ngoài almost, bạn cũng hay gặp các trạng từ như nearly, approximately~ xấp xỉ, up to
lên đến..
Ví dụ: The refund process may take approximately one to seven days, depending on
the bank you use.
Dịch: Gần 80 nghìn người đã tham dự trận đấu bóng đá ngày hôm qua.
Từ vựng:
Attend (v): tham dự, có mặt
Soccer match (n): trận đấu bóng đá'),
(@exercise_id_6, 11, 'Shaloub Hospital wants to hire several more_ qualified laboratory workers.', 'higher', 'highest', 'high', 'highly', 'D', 'Đáp án đúng: D
Giải thích: Ta cần điền một dạng từ thích hợp của tính từ high vào chỗ trống mà vị trí
của nó đứng giữa từ so sánh hơn ''more'' và tính từ ''qualified"
=> ta cần một trạng từ để bổ nghĩa cho tính từ ''qualified
=> đáp án đúng là D
Dịch:
Bênh viện Shaloub muốn thuê thêm một số nhân viên phòng thí nghiệm có trình độ
cao.
Từ vựng:
Hire (v): thuê
Qualified (adj): đủ khả năng, đủ trình độ chuyên môn
Laboratory (n): phòng thí nghiệm'),
(@exercise_id_6, 12, 'Adopting advanced billing software would improve Narrin Group''s', 'substantial', 'substantially', 'more substantial', 'substances', 'B', 'Đáp án đúng: B
Giải thích: Ta cần điền từ loại thích hợp vào chỗ trống
Ta thấy trong câu này đã có đầy đủ các thành phần:
Chủ ngữ: Adopting advanced billing software
Động từ chính: would improve
Tân ngữ: Narrin Group''s fiscal-management process
=> chỗ trống cần điền phải là một trạng từ để bổ nghĩa cho động từ chính của câu
''improve''
=> đáp án đúng là B
Dịch: Việc áp dụng phần mềm thanh toán tiên tiến sẽ cải thiện đáng kể quy trình
quản lý tài chính của Tập đoàn Narin.
Từ vựng:
Adopt (v): Áp dụng, làm theo
Advance (adj): tiên tiến
software (n): phần mềm
Fiscal (a): tài chính'),
(@exercise_id_6, 13, 'When processing a medical leave request, the attending physician must fill out a', 'completes', 'completed', 'completely', 'completeness', 'C', 'Đáp án đúng: C
Giải thích: Ta cần điền 1 từ loại thích hợp của ''complete'' vào chỗ trống mà vị trí của
nó đứng sau danh từ form và cả cum ''a form''là tân ngữ của động từ fill out
=> Chỗ trống có thể điền 1 trạng từ để bổ nghĩa cho động từ "fill out" phía trước.
=> Đáp án đúng là C.
Dịch: Khi xử lý yêu cầu nghỉ phép vì lý do y tế, bác sĩ chăm sóc phải điền đầy đủ vào
mẫu đơn.
Từ vựng:
- physician: (n) bác sĩ điều trị
- complete: (adj) hoàn toàn, đầy đủ
- complete: (v) hoàn thành'),
(@exercise_id_6, 14, 'Mr. Kim''s research reveals that types of hay differ_ in their nutritional content.', 'significant', 'signify', 'significance', 'significantly', 'D', 'Đáp án đúng: D
Giải thích: Ta cần điền một từ loại thích hợp vào chỗ trống mà vị trí của nó đứng sau
động từ ''differ'' và đứng trước cụm giới từ in their nutritional content''
Vi differ là nội động từ => theo sau nó không cần có tân ngữ
=> chỗ trống cần điền chỉ có thể là một trạng từ
=> đáp án đúng là D
Dịch: Nghiên cứu của ông Kim cho thấy các loại cỏ khô khác nhau đáng kể về hàm
lượng dinh dưỡng của chúng.
Từ vựng:
- reveal: (v) chỉ ra, cho thấy, tiết lộ
- differ: (v) khác nhau
significance (n): sự quan trọng
- signify (v): biểu thị
- significant (adj): đáng kể, quan trọng'),
(@exercise_id_6, 15, 'The CEO of True Home Estates _ hires agents who have overcome obstacles in', 'soon', 'most', 'enough', 'always', 'D', 'Đáp án đúng: D
Giải thích: Ta cần tìm một trạng từ phù hợp để đứng trước động từ "hires" và phù hợp
với nghĩa của câu. Ở đây ta thấy
Dựa vào vị trí của trạng từ → Loại đáp án B và C (most và enough không bao giờ
đứng trước động từ)
Dựa vào nghĩa của từng từ
Đáp án A: soon (sớm) → Giám đốc điều hành của True Home Estates sóm
thuê những nhân viên môi giới đã vượt qua những trở ngại trong cuộc sống
của họ.
Hơn nữa ''soon'' thường được dùng với thì tương lai khi vị trí đứng trước động từ
→ loại A
Đáp án D: always (luôn luôn) → Giám đốc điều hành của True Home Estates
luôn thuê những nhân viên môi giới đã vượt qua những trở ngại trong cuộc
sống của họ.
Always cüng là trạng từ thường được dùng ở thì hiện tại đơn.
Chọn D
Dịch: Giám đốc điều hành của True Home Estates luôn thuê những nhân viên môi
giới đã vượt qua những trở ngại/ khó khăn trong cuộc sống của họ.
Từ vựng:
- overcome: (v) vượt qua, đánh bại
obstacle: (n) chướng ngại vật, trở ngại
agent: (n) nhân viên môi giới
hire: (v) thuê
- estate: (n) bất động sản'),
(@exercise_id_6, 16, 'The old Abita Theater was demolished one week ago, and construction of an office', 'yet', 'usually', 'soon', 'already', 'D', 'Đáp án đúng: D
Giải thích: Ta nhận thấy vị trí của từ loại cần điền đứng sau động từ to be
→ Cần tìm một trạng từ phù hợp
Ta xét nghĩa của các đáp án
1. chưa
2. thường xuyên
3. sớm
4. đã
Nhìn vào vế câu trước đó, ta nhận thấy thời gian phá hủy nhà hát cũ là ''one week ago
- 1 tuần trước và thì trong vế câu cần điền chia ở thì hiện tại đơn (''is'')
→ Đáp án D phù hợp nhất về nghĩa (đã hoàn toàn phá hủy và đã bắt đầu tiến hành
xây khu phức hợp mới)
⇒ Chọn D
Dịch: Nhà hát Abita cũ đã bị phá hủy tuần trước, và việc xây dựng một khu phức hợp
văn phòng tại địa điểm này đã đang được tiến hành rồi.
Từ vựng:
- demolish (v): phá hủy
- construction (n): sự xây dựng, thi công
- complex (v): khu phức hợp
- underway (adj): đang tiến hành');

-- =====================================================
-- Thêm bài tập Ngữ pháp: Giới từ
-- =====================================================

SET @topic_id_7 = (SELECT id FROM topics WHERE slug = 'gioi-tu' LIMIT 1);

INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type)
VALUES (@topic_id_7, 15, 1, TRUE, 'GRAMMAR');

SET @exercise_id_7 = LAST_INSERT_ID();

INSERT IGNORE INTO exercise_questions (exercise_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id_7, 1, 'The average precipitation in Campos the past three years has been 7', 'on', 'for', 'to', 'under', 'B', 'Đáp án đúng: B
Giải thích: Ta cần điền một giới từ thích hợp cho câu hỏi này.
Câu hỏi này phải dựa vào nghĩa để chọn đáp án phù hợp
Vì đẳng sau chỗ trống cần điền là một cụm danh từ chỉ thời gian ''the past three
years'' (ba năm qua) => loại A, C và D
Loại A vì giới từ on'' không được dùng trước các cụm danh từ chỉ thời gian
Loại C vì giới từ tơ dùng để chỉ địa điểm, đích đến
Loại D vì giới từ ''under'' dùng để chỉ vị trí, một mức đo lường hoặc dùng để nói về tuối
=> đáp án đúng là B
Đối với câu này, giới từ for có chức năng chỉ một khoảng thời gian.
Lưu ý: Đối với các cụm danh từ chỉ thời gian, ngoài giới từ for thì các cụm danh từ
này còn có thể đi với những giới từ khác như during, by, until.....
Dịch: Lượng mưa trung bình ở Campos trong ba năm qua là 22,7 cm.
Từ vựng:
Average (adj): trung bình
Precipitation (n): lượng mưa'),
(@exercise_id_7, 2, 'Al''s Café will now be open on Sundays _ the hours of 9 A.M. and 5 P.M.', 'for', 'between', 'inside', 'from', 'B', 'Đáp án đúng: B
Giải thích: Câu hỏi yêu cầu tìm một giới từ thích hợp đứng trước cụm danh từ chỉ thời
gian ''the hours of 9 A.M. and 5 P.M'' (khoảng thời gian từ 9h sáng đến 5h chiều)
Loại đáp án A vì giới từ for luôn đi cùng với một mốc thời gian cụ thể (ví dụ: for three
days, for ten years)
Loại đáp án C vì giới từ inside dùng để chỉ địa điểm, nơi chốn
Loại đáp án D vì giới từ from khi dùng để nói về khoảng thời gian sẽ có cấu trúc
from...to, giới từ from để nói đến mốc thời gian bắt đầu và giới từ to để nói đến mốc
thời gian kết thúc (ví du: He played the violin from ten to thirteen.)
=> đáp án đúng là B
Giới từ from mang nghĩa là trong khoảng sẽ có cấu trúc between A and B
Dich: Al''s Café hiện sẽ mở cửa vào Chủ Nhật trong khoảng thời gian từ 9 giờ sáng
đến 5 giờ chiều.
Từ vựng:
café (n): quán cà phê'),
(@exercise_id_7, 3, 'Industry news and upcoming social events are _ the items featured in the', 'during', 'among', 'toward', 'except', 'B', 'Đáp án đúng: B
Giải thích: Câu hỏi yêu cầu điền 1 giới từ thích hợp vào chỗ trống
Phân tích nghĩa của từng giới từ, ta có:
During: trong suốt (một khoảng thời gian nào đó) => loại đáp án A vì cụm danh từ
đứng sau giới từ không nói về thời gian
Among: trong số, ở giữa
Toward: về phía, đối với
Except: ngoại trừ
Phân tích nghĩa của câu, ta có:
Tin tức về ngành và các sự kiện xã hội là _ các mục được giới thiệu trong bản tin
của công ty
=> Dựa vào nghĩa phân tích của câu hỏi và từng đáp án
=> đáp án đúng là B
Dịch: Tin tức về ngành và các sự kiện xã hội năm trong số các mục có trong bản tin
công ty.
Từ vựng:
Industry (n): ngành nghề
social (adj): xã hội
feature (v): có, bao gồm trong
newsletter (n): bản tin'),
(@exercise_id_7, 4, 'Beginning on August 1, patients will be asked to complete a short survey each', 'inside', 'after', 'where', 'whenever', 'B', 'Đáp án đúng: B
Giải thích: Ta nhận thấy chỗ trống cần điền đứng trước cụm danh từ ''each visit'' và
đứng sau một mệnh đề hoàn chỉnh
→ Cần tìm một giới từ để tạo thành trạng từ cho câu.
Dựa vào nghĩa của từng từ để chọn đáp án
A. trong
B. sau khi
C. nơi
D. bất cứ khi nào
⇒ Chọn B (hợp nghĩa nhất)
Dịch: Bắt đầu từ ngày 1 tháng 8, các bệnh nhân sẽ được yêu cầu hoàn thành 1 bản
khảo sát ngẫn sau mỗi lần khám.
Từ vựng:
- patient (n): bệnh nhân
- survey (n): khảo sát
- visit (n, v): chuyến thăm; đi đến'),
(@exercise_id_7, 5, 'The Golubovich House will be opened _ a special living-history program on', 'from', 'around', 'for', 'by', 'C', 'Đáp án đúng: C
Giải thích: Ta xét mối quan hệ giữa hai vế câu
(1): ''The Golubovich House will be opened nghĩa là ''Ngôi nhà Golubovich sẽ được
mở cửa
(2): ''a special living-history program on Sunday nghĩa là ''một chương trình lịch sử
thực tế đặc biệt vào chủ nhật
Có thể nhận thấy giữa hai vế câu có mối quan hệ chỉ mục đích (ngôi nhà mở cửa vì
có một chương trình lịch sử thực tế)
→ Cần tìm một giới từ chỉ mục đích
→ Loại đáp án A (giới từ chỉ nguyên nhân, lý do), đáp án B (giới từ chỉ nơi chốn) và
đáp án D (giới từ chỉ cách thức/nơi chốn)
⇒ Chọn C
Dịch: Ngôi nhà Golubovich sẽ được mở cửa cho một chương trình lịch sử thực tế đặc
biệt vào chủ nhật.
Từ vựng:
- special (adj): đặc biệt
- living-history program: chương trình lịch sử thực tế'),
(@exercise_id_7, 6, 'The cafeteria is featuring dishes ---- different regions of the world this week.', 'over', 'through', 'into', 'from', 'D', 'Đáp án đúng: D
Chọn D. from do nghĩa phù hợp nhất.
Dịch: Câu hỏi yêu cầu điền một giới từ thích hợp
Xét nghĩa của từng giới từ, ta có:
Over: hơn, quá; trong (khoảng thời gian)
Through: xuyên qua, thông qua
Into: bên trong
From: từ
Xét nghĩa của câu hỏi, ta có:
Quán ăn tự phục vụ có các món ăn _ các vùng miền khác nhau trên thế giới trong
tuần này.
Dựa vào nghĩa phân tích của từng giới từ và câu
=> đáp án đúng là D
Từ vựng:
Cafeteria (n): quán ăn tự phục vụ
dish (n): món ăn.
region (n): vùng, miền'),
(@exercise_id_7, 7, 'The city council will discuss certain policies, particularly those made--the', 'any', 'by', 'to', 'and', 'B', 'Đáp án đúng: B
Giải thích: Câu hỏi yêu cầu tìm từ loại thích hợp để điền vào chỗ trống
Mệnh đề sau dấu phẩy của câu sử dụng mệnh đề quan hệ rút gọn:
''...particularly those that are made....''= ''...particularly those made...
=> ở thể bị động thì động từ luôn đi cùng với giới từ ''by'' (bởi) hoặc ''with'' (với)
=> đáp án đúng là B
Dịch: Hội đồng thành phố sẽ thảo luận về một số chính sách, đặc biệt là những chính
sách được ban hành bởi chính quyền tiền nhiệm.
Từ vựng:
Council (n): hội đồng
Discuss (v): thảo luận
Policy (n): chính sách
Administration (n): chính quyền'),
(@exercise_id_7, 8, 'Servers'' tips are pooled at the end of each shift and divided evenly- the entire', 'onto', 'among', 'beside', 'about', 'B', 'Đáp án đúng: B
Giải thích: Ta cần điền một giới từ thích hợp vào chỗ trống
Xét nghĩa của từng giới từ, ta có:
Onto: bên trên
Among: trong số
Beside: kế bên
About: về, liên quan đến
Xét nghĩa của câu, ta có:
Tiền boa của những người phục vụ được gộp lại vào cuối mỗi ca làm việc và chia đều
_ toàn bộ nhân viên phục vụ.
Dựa vào nghĩa phân tích của từ và câu
=> đáp án đúng là B
Dịch: Tiền boa của những người phục vụ được gộp lại vào cuối mỗi ca làm việc và
chia đều trong toàn bộ nhân viên phục vụ.
Từ vựng:
Tip (n): tiền boa
Pool (v): góp thành vốn chung
Shift (n): ca làm
Divide (v): chia ra, phân ra
Waitstaff (n): bồi bàn, nhân viên phục vụ bàn'),
(@exercise_id_7, 9, 'The ideal operating temperature for the tablet computer is-10 and 30 degrees', 'between', 'above', 'in', 'off', 'A', 'Đáp án đúng: A
Giải thích: Ta cần điền một giới từ thích hợp để điền vào chỗ trống
Ta có cấu trúc between A and B với nghĩa là nằm trong khoảng A và B
=> đáp án đúng là A
Dịch:
Nhiệt độ hoạt động lý tưởng cho máy tính bảng là trong khoảng từ 10 đến 30 độ C.
Từ vựng:
Ideal (adj): lý tưởng
Operating (adj): hoạt động'),
(@exercise_id_7, 10, 'Classes using the new employee scheduling software will begin in December.', 'at', 'to', 'by', 'on', 'D', 'Đáp án đúng: D
Giải thích: Câu hỏi yêu cầu điền một giới từ thích hợp vào chỗ trống
Ta thấy chủ ngữ chính của câu là ''classes'' và động từ là ''will begin''
=> Cụm danh động từ theo sau chỗ trống ''using the new employee scheduling
software'' (việc sử dụng phần mềm lập kế hoạch cho nhân viên mới) có chức năng bổ
sung thêm thông tin cho chủ ngữ
Xét chức năng của từng giới từ, ta có:
At: Dùng để nói về thời gian (at 1:30), địa điểm (at the main door)
To: Dùng để diễn tả địa điểm, đích đến (The door to the main office was open.)
By: Dùng để nói về thời gian (by tomorrow), nơi chốn (by the window) hoặc cách thức
(by car)
On: Dùng để nói về thời gian (on Monday), nơi chốn (on the table), trạng thái (on
holiday) hoặc một sự việc/vấn đề liên quan (a book on pregnancy)
Dựa vào nghĩa của câu và chức năng của từng giới từ đã được phân tích
=> đáp án đúng là D
Dịch: Các lớp học về việc sử dụng phần mềm lên lịch cho nhân viên mới sẽ bắt đầu
vào tháng 12.
Từ vựng:
employee: (n) nhân viên, người lao động
schedule: (n,v) lịch trình, lên lịch trình
Software (n): phần mềm'),
(@exercise_id_7, 11, 'The proposed city budget outlines various projects, renovations of the Fessler', 'these', 'including', 'even though', 'always', 'B', 'Đáp án đúng: B
Giải thích: Ta cần điền 1 từ loại thích hợp vào chỗ trống mà vị trí của nó được trước
cụm danh từ ''renovations of the Fessler Road fire station'' (việc cải tạo trạm cứu hỏa
Đường Fessler)
Loại đáp án C vì sau even though là một mệnh đề
Loại đáp án D vì trạng từ không đứng trước danh từ
Loại đáp án A vì không phù hợp về nghĩa
=> đáp án đúng là B
Ở đây, including là một giới từ với nghĩa là bao gồm.
Dịch: Ngân sách đề xuất của thành phố phác thảo ra các dự án khác nhau, bao gồm
cả việc cải tạo trạm cứu hỏa Đường Fessler.
Từ vựng:
budget: (n) ngân sách
renovation: (n) sự nâng cấp, tu sửa
outline: (v) vạch ra, phác thảo ra'),
(@exercise_id_7, 12, 'After monitoring the Hasher Corporation''s inventory control process several', 'among', 'except', 'off', 'for', 'D', 'Đáp án đúng: D
Giải thích: Ta cần điền một giới từ thích hợp vào chỗ trống mà vị trí của nó đứng
trước danh từ chỉ thời gian ''several days''
Phân tích chức năng của từng giới từ, ta có:
Among: trong số, ở giữa (từ 3 người/vật trở lên)
Except: ngoại trừ, thường được dùng sau các từ chỉ sự tổng quát, toàn thể như: all,
every, no, everything
Off: khỏi, đứt rời, tắt. Chỉ sự tách biệt về mặt vật chất hoặc khoảng cách với cái gì
For: được dùng theo nghĩa chỉ mục đích, nguyên nhân hoặc chỉ một khoảng thời gian
Vì sau từ cần điền là một danh từ chỉ 1 khoảng thời gian ''several days''
=> đáp án đúng là D
Trong câu này, giới từ for là để chỉ 1 khoảng thời gian.
Dịch: Sau khi theo dõi quy trình kiểm soát hàng tồn kho của Hasher Corporation
trong vài ngày, nhà tư vấn đã xác định được vấn đề.
Từ vựng:
- inventory: (n) hàng tồn kho
- consultant: (n) người tư vấn, cố vấn
- identify: (v) xác định, tìm ra'),
(@exercise_id_7, 13, 'Revenue growth exceeding 2 percent was seen_ all business segments this', 'across', 'into', 'prior to', 'above', 'A', 'Đáp án đúng: A
Giải thích: Câu hỏi yêu cầu ta điền 1 giới từ phù hợp vào chỗ trống
Xét nghĩa của từng giới từ, ta có:
Across: trên khắp
Into: vào bên trong
Prior to: trước khi
Above: bên trên
Xét nghĩa của câu, ta có:
Tăng trưởng doanh thu vượt quá 2% đã được nhìn thấy_ tất cả các mảng kinh
doanh trong quý này.
Dựa trên nghĩa đã phân tích của giới từ và câu
=> Đáp án đúng là A.'),
(@exercise_id_7, 14, 'After record profits, Golden Shamrock Jewelry''s stock price increased_ our', 'beside', 'beyond', 'behind', 'between', 'B', 'Đáp án đúng: B
Giải thích: Ta cần điền một giới từ thích hợp vào chỗ trống
Xét nghĩa của từng giới từ, ta có:
Beside: bên cạnh
Beyond: vượt ra ngoài
Behind: đắng sau
Between: ở giữa
Xét nghĩa của câu, ta có:
Sau khi đạt lợi nhuận kỷ lục, giá cổ phiếu của Golden Shamrock Jewelry đã tăng
_ mong đợi của chúng tôi.
Dựa vào nghĩa của câu và giới từ đã phân tích
=> đáp án đúng là B
Dịch:
Sau khi đạt lợi nhuận kỷ lục, giá cổ phiếu của Golden Shamrock Jewelry đã tăng vượt
qua mong đợi của chúng tôi.
Từ vựng:
Profit (n): lợi nhuận
Stock (n): cổ phiếu
Expectation (n): kỳ vọng'),
(@exercise_id_7, 15, 'Mumbai Jewel is a widely acclaimed restaurant, mainly its delicious buffet', 'such as', 'not only', 'because of', 'together with', 'C', 'Đáp án đúng: C
Giải thích: Ta cần lựa chọn một từ loại thích hợp vào chỗ trống mà vị trí của nó đứng
trước cụm danh từ ''its delicious buffet dinners''
Xét nghĩa của từng đáp án, ta có:
Such as (prep): ví dụ như là
Not only (conj): không chỉ
Because of (prep): bởi vì
Together with (prep): cùng với
Xét nghĩa của câu, ta có:
Mumbai Jewei là một nhà hàng được ca ngợi rộng rãi, chủ yếu _ bữa tối tự chọn
ngon miệng.
Dựa vào nghĩa đã phân tích
=> đáp án đúng là C
Lưu ý: because là liên từ nhưng khi đi cùng với giới từ of thì because of là một giới từ
Dịch: Mumbai Jewei là một nhà hàng được ca ngợi rộng rãi, chủ yếu là vì bữa tối tự
chọn ngon miệng.
Từ vựng:
Acclaimed (adj): hoan nghênh, ca ngợi
Delicious (adj): ngon
Mainly (adj): chủ yếu');

INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type)
VALUES (@topic_id_7, 3, 1, TRUE, 'GRAMMAR');

SET @exercise_id_7 = LAST_INSERT_ID();

INSERT IGNORE INTO exercise_questions (exercise_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id_7, 1, 'The average precipitation in Campos the past three years has been 7', 'on', 'for', 'to', 'under', 'B', 'Đáp án đúng: B
Giải thích: Ta cần điền một giới từ thích hợp cho câu hỏi này.
Câu hỏi này phải dựa vào nghĩa để chọn đáp án phù hợp
Vì đẳng sau chỗ trống cần điền là một cụm danh từ chỉ thời gian ''the past three
years'' (ba năm qua) => loại A, C và D
Loại A vì giới từ on'' không được dùng trước các cụm danh từ chỉ thời gian
Loại C vì giới từ tơ dùng để chỉ địa điểm, đích đến
Loại D vì giới từ ''under'' dùng để chỉ vị trí, một mức đo lường hoặc dùng để nói về tuối
=> đáp án đúng là B
Đối với câu này, giới từ for có chức năng chỉ một khoảng thời gian.
Lưu ý: Đối với các cụm danh từ chỉ thời gian, ngoài giới từ for thì các cụm danh từ
này còn có thể đi với những giới từ khác như during, by, until.....
Dịch: Lượng mưa trung bình ở Campos trong ba năm qua là 22,7 cm.
Từ vựng:
Average (adj): trung bình
Precipitation (n): lượng mưa'),
(@exercise_id_7, 2, 'Al''s Café will now be open on Sundays _ the hours of 9 A.M. and 5 P.M.', 'for', 'between', 'inside', 'from', 'B', 'Đáp án đúng: B
Giải thích: Câu hỏi yêu cầu tìm một giới từ thích hợp đứng trước cụm danh từ chỉ thời
gian ''the hours of 9 A.M. and 5 P.M'' (khoảng thời gian từ 9h sáng đến 5h chiều)
Loại đáp án A vì giới từ for luôn đi cùng với một mốc thời gian cụ thể (ví dụ: for three
days, for ten years)
Loại đáp án C vì giới từ inside dùng để chỉ địa điểm, nơi chốn
Loại đáp án D vì giới từ from khi dùng để nói về khoảng thời gian sẽ có cấu trúc
from...to, giới từ from để nói đến mốc thời gian bắt đầu và giới từ to để nói đến mốc
thời gian kết thúc (ví du: He played the violin from ten to thirteen.)
=> đáp án đúng là B
Giới từ from mang nghĩa là trong khoảng sẽ có cấu trúc between A and B
Dich: Al''s Café hiện sẽ mở cửa vào Chủ Nhật trong khoảng thời gian từ 9 giờ sáng
đến 5 giờ chiều.
Từ vựng:
café (n): quán cà phê'),
(@exercise_id_7, 3, 'Industry news and upcoming social events are _ the items featured in the', 'during', 'among', 'toward', 'except', 'B', 'Đáp án đúng: B
Giải thích: Câu hỏi yêu cầu điền 1 giới từ thích hợp vào chỗ trống
Phân tích nghĩa của từng giới từ, ta có:
During: trong suốt (một khoảng thời gian nào đó) => loại đáp án A vì cụm danh từ
đứng sau giới từ không nói về thời gian
Among: trong số, ở giữa
Toward: về phía, đối với
Except: ngoại trừ
Phân tích nghĩa của câu, ta có:
Tin tức về ngành và các sự kiện xã hội là _ các mục được giới thiệu trong bản tin
của công ty');

-- =====================================================
-- Thêm bài tập Ngữ pháp: Mệnh đề quan hệ
-- =====================================================

SET @topic_id_8 = (SELECT id FROM topics WHERE slug = 'menh-de-quan-he' LIMIT 1);

INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type)
VALUES (@topic_id_8, 15, 1, TRUE, 'GRAMMAR');

SET @exercise_id_8 = LAST_INSERT_ID();

INSERT IGNORE INTO exercise_questions (exercise_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id_8, 1, 'The team_ completes the online training first will receive a catered lunch.', 'whichever', 'it', 'that', 'either', 'C', 'Đáp án đúng: C
Giải thích: Chỗ trống cần điền đứng sau chủ ngữ, ở sau có 2 động từ → cần tìm một
đại từ quan hệ kết hợp cùng vế "completes the online training first" để tạo thành
mệnh đề quan hệ bổ nghĩa cho chủ ngữ.
→→ Ta thấy "that" thay thế cho danh từ "team" đóng vai trò làm chủ ngữ của mệnh đề
quan hệ trong câu.
→ Chọn đáp án C.
Dịch: Nhóm mà hoàn thành khóa đào tạo trực tuyến trước tiên sẽ nhận được một
bữa ăn trưa.
Từ vựng:
- complete (v): hoàn thành
- receive (v): nhận được
- training (n): khóa đào tạo
cater (v): phục vụ'),
(@exercise_id_8, 2, 'The obstetrics nurses _ are working under Dorothy Caramella will now be', 'they', 'who', 'when', 'these', 'B', 'Đáp án đúng: B
Giải thích: Cần tìm một đại từ quan hệ để kết hợp với "are working under Dorothy
Caramella" → tạo thành tính từ bổ nghĩa cho cụm danh từ "the obstetrics" trước đó.
→ Chọn B
Tạm dịch: Các y tá sản khoa người mà đang làm việc dưới quyền của Dorothy
Caramella giờ sẽ làm việc cho Pierre Cocteau.
Từ vựng:
obstetrics (adj): khoa sản'),
(@exercise_id_8, 3, 'Chef Lind''s cookbook, will be available next week, contains only dessert', 'who', 'what', 'which', 'whose', 'C', 'Đáp án đúng: C
Giải thích: Ta nhận thấy từ cần điền nằm trong mệnh đề quan hệ không xác định
(nằm trong dấu ", và đứng sau chủ ngữ) và chủ ngữ trong câu là ''Chef Lind''s
cookbook'' nghĩa là ''Sách dạy nấu ăn của đầu bếp Lind
→ Cần tìm một đại từ quan hệ chỉ vật
Chọn C
Loại đáp án A (DTQH chỉ người), đáp án D (DTQH chỉ sự sở hữu) và đáp án B (không
phù hợp về nghĩa - ''what'' là ''cái gì'' trong khi ''which'' là ''cái mà'')
Dịch nghĩa:
Sách dạy nấu ăn của đầu bếp Lind, quyển mà sẽ có mặt vào tuần tới, chỉ chứa các
công thức món tráng miệng.
Từ vựng:
contain (v): chứa
- dessert (n): món tráng miệng
- recipe (n): công thức nấu ăn'),
(@exercise_id_8, 4, 'Highlee Sportswear, popularity is widespread among athletes, will add a line of', 'whose', 'some', 'major', 'which', 'A', 'Đáp án đúng: A
Giải thích: Chỗ trống cần điền nằm trong vế mệnh đề phụ của câu → cần tìm một đại
từ quan hệ. "popularity is widespread among athletes" - "có độ phổ biến được trải
rộng trong giới vận động viên” có mối quan hệ sở hữu với chủ ngữ "Highlee
Sportswear"
→ Chọn A
Dịch: Highlee Sportswear, nhãn hàng có độ phố biến được trải rộng trong giới vận
động viên, sẽ sớm thêm một dòng quần áo dành cho trẻ em.
Từ vựng:
- popularity (n) độ phổ biến
widespread (v) lan rộng
- athlete (n) vận động viên (thường là điền kinh)'),
(@exercise_id_8, 5, 'Employees_ cars are parked in designated client spaces should move them', 'those', 'other', 'who', 'whose', 'D', 'Đáp án đúng: D
Giải thích: Chỗ trống cần điền một đại từ quan hệ phù hợp (đứng sau chủ ngữ
employees và phía sau có động từ chính should move). Do phía sau có danh từ
(cars) đi liền nên chỉ có thể điền đại từ quan hệ whose để thể hiện tính sở hữu.
→ Chon D
Dịch: Những nhân viên mà có xe ô tô đang đậu ở những chỗ dành cho khách hàng
nên di chuyển chúng ngay lập tức.
Từ vựng:
- park (v): đậu xe
- designate (v): chỉ định
- immediately (adv): ngay lập tức'),
(@exercise_id_8, 6, 'Customers _ wish to return a defective item may do so within twenty days of the', 'whose', 'who', 'which', 'whichever', 'B', 'Đáp án đúng: B
Giải thích: Ta nhận thấy từ loại cần điền đứng sau chủ ngữ, ở sau lại có hai vế câu
tương đương nhau (đều có đủ động từ chính và tân ngữ)
→ Cần tìm một đại từ quan hệ phù hợp để đảm bảo không thừa các thành phần
trong câu
Chủ ngữ của câu là ''customers'' nghĩa là ''những khách hàng → cần đại từ quan hệ
chỉ người
⇒ Chon B
Dịch: Những khách hàng người mà có mong muốn hoàn trả các sản phẩm lỗi thì có
thể làm như vậy trong vòng 20 ngày tính từ thời gian mua hàng.
Từ vựng:
- defective (adj): bị lỗi
- within (prep): trong vòng
- purchase (n, v): đơn mua; mua'),
(@exercise_id_8, 7, 'A recent study has found that those_ regularly read food labels tend to be', 'what', 'where', 'who', 'when', 'C', 'Đáp án đúng: C
Giải thích: Ta nhận thấy từ cần điền nằm sau danh từ those, đẳng sau xuất hiện hai
động từ chính ''read'' và ''tend''
→ Cần tìm một đại từ quan hệ thay thế cho ''those'' - danh từ chỉ người
⇒ Chọn C
Dịch: Một nghiên cứu gần đây đã chỉ ra rằng những người mà thường xuyên đọc các
nhãn trên thức ăn có xu hướng khỏe mạnh hơn.
Từ vựng:
- regularly (adv): thường xuyên
food label: nhãn trên thức ăn
- tend to: có xu hướng'),
(@exercise_id_8, 8, 'Ms. Lau would like to know Mr. Cole called the main office yesterday.', 'whatever', 'while', 'why', 'who', 'C', 'Đáp án đúng: C
Phân tích: Ta xét nghĩa giữa 2 vế câu
(1): ''Ms. Lau would like to know''- ''Cô Lau muốn biết
(2): ''Mr. Cole called the main office yesterday'' - ''ông Cole gọi cho văn phòng chính
ngày hôm qua
Ta nhận thấy, giữa hai vế câu mang quan hệ mật thiết, cô Lau muốn tìm hiểu về lý do
ông Cole gọi cho văn phòng
Cần tìm một đại từ quan hệ chỉ lý do
⇒ Chọn C
Dịch: Cô Lau muốn biết tại sao ông Cole gọi cho văn phòng chính ngày hôm qua.
Từ vựng:
- main office: văn phòng chính'),
(@exercise_id_8, 9, 'We do not have enough fabric samples, so please promptly return_ ones you', 'what', 'whomever', 'whichever', 'whose', 'C', 'Đáp án đúng: C
Phân tích:
Giải thích: Ta nhận thấy vị trí của đại từ quan hệ cần điền nằm trước đại từ ''ones''-
thay thế cho cụm từ ''fabric samples'' - các mẫu vải đứng trước
→ Cần tìm một đại từ quan hệ chỉ vật
→ Loại đáp án B (ĐTQH chỉ người)
Ta xét đến nghĩa của các đại từ quan hệ
A. cái gì
C. bất kì
D. của ai
⇒ Chọn C (hợp nghĩa nhất)
Dịch: Chúng tôi không có đủ mẫu vải, vì vậy vui lòng trả lại ngay bất kỳ mẫu nào bạn
đã mượn.
Từ vựng:
- fabric (n): vải vóc
sample (n): mẫu thử
- promptly (adj): vui lòng
- borrow (v): mượn'),
(@exercise_id_8, 10, 'Zypo Properties has just signed a lease agreement with the law firm offices are', 'how', 'what', 'whose', 'wherever', 'C', 'Đáp án đúng: C
Giải thích: Ta nhận thấy đại từ quan hệ cần tìm có vị trí đứng giữa the law firm''-
công ty luật và ''offices'' - văn phòng. Ở đây ta thấy cụm danh từ ''the law firm'' có mối
quan hệ sở hữu với danh từ ''offices'' (văn phòng của công ty luật)
→ Cần tìm một đại từ quan hệ chỉ sự sở hữu
Loại đáp án A (DTQH chỉ cách thức), đáp án B (DTQH mang ý nghĩa nghi vấn) và đáp
án D (DTQH chỉ nơi chốn)
⇒ Chon C
Dich: Zypo Properties vừa ký hợp đồng cho thuê với công ty luật mà có văn phòng ở
tầng ba.
Từ vựng:
- lease (n): bản thỏa thuận, hợp đồng
- firm (n): công ty'),
(@exercise_id_8, 11, 'The second training session is for employees _ responsibilities include', 'whose', 'which', 'what', 'who', 'A', 'Đáp án đúng: A
Giải thích: Ta nhận thấy từ cần điền nằm giữa hai danh từr ''employees'' và
''responsibilities'', hơn nữa đẳng sau còn có đủ động từ chính và tân ngữ.
→ Cần tìm một đại từ quan hệ để liên kết hai danh từ
Ta nhận thấy giữa danh từ ''employees''- các nhân viên và ''responsibilities''- trách
nhiệm có mối quan hệ sở hữu (trách nhiệm của các nhân viên)
→ Chọn A (đại từ quan hệ sở hữu)
Dịch: Buổi đào tạo thứ hai dành cho nhân viên những người mà họ có trách nhiệm xử
lý các bảng phát lương.
Từ vựng:
session (n): phiên họd
include (v): bao gồm
- payroll (n): bảng phát lương'),
(@exercise_id_8, 12, 'Most of the people attended yesterday''s workshop have already submitted', 'who', 'those', 'whose', 'some', 'A', 'Đáp án đúng: A
Phân tích: Ta cần tìm một đại từ quan hệ phù hợp để kết nối hai thành phần ''most of
the people'' và ''attended yesterday''s workshop'', tránh việc có 2 động từ ''attended'' và
''have already submitted'' trong câu
Chủ ngữ trong câu là ''most of the people'' nghĩa là ''hầu hết những người
→ Cần tìm một đại từ quan hệ chỉ người
Loại đáp án B (đại từ chỉ định), đáp án C (đại từ quan hệ sở hữu) và đáp án D (từ hạn
định)
⇒ Chọn A
Dịch: Hầu hết những người mà họ đã tham dự hội thảo ngày hôm qua đã gửi phản
hồi của họ.
Từ vựng:
- attend (v): tham gia
- workshop (n): hội thảo
- submit (v): nộp, gửi
- feedback (n): phản hồi, đánh giá'),
(@exercise_id_8, 13, 'Hemlin Corporation is looking for a sales representative_ primary role will be', 'that', 'whose', 'who', 'which', 'B', 'Đáp án đúng: B
Giải thích: Ta nhận thấy vị trí của từ loại cần điền nằm sau cụm danh từ ''a sales
representative và đứng trước cụm danh từ ''primary role''
→ Cần tìm một đại từ quan hệ để liên kết hai cụm danh từ tạo thành chủ ngữ hoàn
chỉnh
Xét về nghĩa của hai cụm danh từ
(1): ''a sales representative'' nghĩa là ''một đại diện bán hàng
(2): ''primary role'' nghía là ''có vai trò chính''
Ta nhận thấy hai cụm có mối quan hệ sở hữu (vai trò chính của một đại diện bán
hàng)
→ Cần tìm đại từ quan hệ sở hữu
⇒ Chọn B
Dịch: Hemlin Corporation đang tìm kiếm một đại diện bán hàng người mà có vai trò
chính sẽ là mở rộng kinh doanh ở khu vực Tây Bắc.
Từ vựng:
- representative (n, adj): người đại diện; tiêu biểu
- primary (adj): chính
- expand (v): mở rộng
- northwest: Tây Bắc
- region (n): vùng miền, khu vực'),
(@exercise_id_8, 14, 'The Neighborhood Involvement Program honors residents volunteer their time', 'for', 'who', 'those', 'as', 'B', 'Đáp án đúng: B
Giải thích: Ta nhận thấy vị trí của từ loại cần điền nằm sau danh từ ''residents'' và
trước cụm ''volunteer their time'', cuối câu còn xuất hiện trạng ngữ ''to help Egin City''
Ở đây ''residents'' - ''các cư dân'' và ''volunteer their time - ''làm tình nguyện'' mang quan
hệ sở hữu, các cư dân đóng góp thời gian của họ để giúp thành phố Egin.
→ Cần tìm một đại từ quan hệ chỉ người (chủ thể là ''residents''- cư dân)
Loại đáp án A (giới từ), đáp án C (đại từ) và đáp án D (giới từ)
⇒ Chọn B
Dịch: Chương Trình The Neighborhood Involvement vinh danh những cư dân người
mà tình nguyện giúp đỡ thành phố Egin.
Từ vựng:
- involvement (n): sự tham gia
- honor (n, v): niềm vinh hạnh; vinh danh
- resident (n): cư dân
- volunteer (v): tình nguyện'),
(@exercise_id_8, 15, 'A rise in energy prices will mostly affect businesses energy consumption is', 'its', 'which', 'whose', 'more', 'C', 'Đáp án đúng: C
Giải thích: Ởở đây ta nhận thấy vị trí của từ cần điền nằm giữa hai cụm danh từ
''businesses'' và ''energy consumption''
→ Cần tìm một đại từ quan hệ để liên kết hai cụm danh từ
Ta xét mối quan hệ của hai cụm danhtừ: doanh nghiệp và mức tiêu thụ năng lượng.
Ta nhận thấy doanh nghiệp và mức tiêu thụ năng lượng có mối quan hệ sở hữu (năng
lượng được tiêu thụ bởi doanh nghiệp)
→ Cần tìm một đại từ quan hệ sở hữu
Loại đáp án A (tính từ sở hữu), đáp án B (giới từ) và đáp án D (so sánh hơn)
⇒ Chọn C
Dịch: Giá năng lượng tăng sẽ ảnh hưởng chủ yếu đến các doanh nghiệp mà có mức
tiêu thụ năng lượng cao.
Từ vựng:
- rise (n, v): sự tăng lên; tăng
mostly (adv): hầu hết
- consumption (n): mức tiêu thụ');

-- =====================================================
-- Thêm bài tập Ngữ pháp: Câu điều kiện
-- =====================================================

SET @topic_id_9 = (SELECT id FROM topics WHERE slug = 'cau-dieu-kien' LIMIT 1);

INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type)
VALUES (@topic_id_9, 2, 1, TRUE, 'GRAMMAR');

SET @exercise_id_9 = LAST_INSERT_ID();

INSERT IGNORE INTO exercise_questions (exercise_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id_9, 1, 'Ms. Choi would have been at the keynote address if her train _ on time.', 'arrives', 'will arrive', 'had arrived', 'arriving', 'C', 'Đáp án đúng: C
Giải thích: Ta nhận thấy từ cần điền nằm sau chủ ngữ ''her train'' → cần tìm một động
từ chính được chia thì
Ta nhận thấy có cấu trúc câu điều kiện loại 3: động từ ở vế 1 ''would have been''
Cấu trúc câu điều kiện loại 3: S + would/ could...+ have + V(P2)/V-ed If + S + Had +
V(P2)/V-ed
→ Chọn C
Dịch: Bà Choi đáng lẽ ra đã đến kịp bài phát biểu nếu tàu của bà ấy đã đến đúng giờ.
Từ vựng:
- keynote address: bài phát biểu
- on time: đúng giờ'),
(@exercise_id_9, 2, 'Visitors should reserve opera tickets well in advance they hope to see a', 'and', 'or', 'if', 'until', 'C', 'Đáp án đúng: C
Giải thích: Câu này thuộc dạng phải chọn (cụm) từ vựng có nghĩa phù hợp, dịch cả
câu ta thấy "if" là lựa chọn đúng.
Chú ý: "hope" ở đây có nghĩa là mong muốn, không nên cứng nhắc với nghĩa chủ yếu
là "hi vọng"
Dịch: Khách thăm quan nên đặt vé opera trước nếu họ muốn xem buổi trình diễn
trong khi đi thăm quan thành phốWestgard.
Từ vựng:
- reserve (v): dành trước, giữ trước
- in advance: trước, sớm
- performance: buổi trình diễn');

-- =====================================================
-- Thêm bài tập Ngữ pháp: Cấu trúc phân từ
-- =====================================================

SET @topic_id_10 = (SELECT id FROM topics WHERE slug = 'cau-truc-phan-tu' LIMIT 1);

INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type)
VALUES (@topic_id_10, 8, 1, TRUE, 'GRAMMAR');

SET @exercise_id_10 = LAST_INSERT_ID();

INSERT IGNORE INTO exercise_questions (exercise_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id_10, 1, '_ on the city''s ongoing revitalization project, Mayor Owen promised that', 'Comment', 'Comments', 'Commented', 'Commenting', 'D', 'Đáp án đúng: D
Giải thích: Ta nhận thấy vị trí của từ cần tìm đứng đầu trong mệnh đề trạng ngữ,
đằng sau có một vế câu hoàn chỉnh.
→ Cần tìm một phân từ được chia để hoàn thành mệnh đề trạng ngữ.
Ở đây ta thấy, chủ ngữ chính trong câu ''Mayor Owen - thị trưởng Owen chính là đối
tượng thực hiện hành động ở cả vẽ trạng ngữ "comment - bình luận và vế câu sau
''promise'' - hứa
→ Sử dụng phân từ hiện tại chia ở thể chủ động (chủ ngữ ''Mayor Owen'' là chủ thể
thực hiện hành động ''comment'' mà phân từ diễn tả)
⇒ Chọn D
Lưu ý: Phân từ có mối quan hệ chặt chẽ với chủ ngữ trong mệnh đề chính.
Chủ ngữ trong mệnh đề chính là chủ thể thực hiện hành động mà phân từ
diễn tả
→ Dùng phân từ hiện tại (thể chủ động)
.
Chủ ngữ trong mệnh đề chính là đối tượng chịu tác động của hành động mà
phân từ diễn tả
→ Dùng phân từ II (thể bị động).
Dịch: Giải thích về dự án tái tạo thành phố đang diễn ra, Thị trưởng Owen hứa rằng
cư dân sẽ hài lòng với kết quả.
Từ vựng:
- comment (v): bình luận, giải thích
ongoing (adj): đang diễn ra
revitalization (n): tái tạo, hồi sinh
- pleased (adj): hài lòng'),
(@exercise_id_10, 2, '_ that Mr. Rey has completed the welding course, he is free to apply for an internal', 'Otherwise', 'Rather than', 'Despite', 'Considering', 'D', 'Đáp án đúng: D
Giải thích: Ta nhận thấy vị trí của từ loại cần điền nằm đầu mệnh đề trạng ngữ, ngay
sau có vế ''that''
→ Cần tìm một cấu trúc phân từ phù hợp (đóng vai trò làm trạng từ trong câu, sau
khi đã lược bỏ liên từ và chủ ngữ để giúp câu gọn hơn)
Ta xét nghĩa hai vế câu và nghĩa các đáp án
(1): ''Mr. Rey has completed the welding course''- ''ông Rey đã hoàn thành khóa học
hàn kim loại
(2): ''he is free to apply for an internal position with increased responsibility'' - ''ông có
thể tự do ứng tuyển vào vị trí nội bộ với nhiều trách nhiệm hơn
(A) otherwise (adv) mặt khác, nếu không thì
(B) rather than (adv) thích cái gì hơn
(C) despite (prep) mặc dù
(D) considering (prep, conj, adv) xem xét đến
Dựa vào nghĩa chọn đáp án D
Dịch: Xem xét đến việc ông Rey đã hoàn thành khóa học hàn kim loại, ông có thể tự
do ứng tuyển vào vị trí nội bộ với nhiều trách nhiệm hơn.
Từ vựng:
- weld (v) hàn kim loại
internal position (n) vị trí nội bộ
- responsibility (n) trách nhiệm'),
(@exercise_id_10, 3, 'As-by the researchers, the new environmentally friendly laundry detergent', 'observing', 'observed', 'observation', 'observe', 'B', 'Đáp án đúng: B
Giải thích: Ta cần điền dạng đúng của động từ "observe" đứng sau liên từ "As" (theo
như). Sau liên từ "As" chỉ có thể là một mệnh đề hoặc cấu trúc phân từ => loại đáp án
C và D. Vì chủ ngữ trong mệnh đề chính - ''the new environmentally friendly laundry
detergent'' (1 loại nước giặt) là đối tượng chịu tác động của hành động "observe"
(quan sát) nên ta dùng phân từ thể bị động => đáp án B.
Dịch: Như đã được quan sát bởi những nhà nghiên cứu thì loại bột giặt mới thân
thiện với môi trường mang lại hiệu quả tốt như các đối thủ cạnh tranh của nó.
Từ vựng:
Observe (v): quan sát
Environmentally friendly (adj): thân thiện với môi trường
Perform (v): thực hiện điều gì đó theo một cách đáng mong đợi, hài lòng
Competitor (n): đối thủ
Researcher (n): nhà nghiên cứu
Detergent (n): chất tẩy rửa'),
(@exercise_id_10, 4, 'When recently - residents of Mill Creek Park said that street disrepair is the', 'poll', 'polls', 'pollster', 'polled', 'D', 'Đáp án đúng: D
Giải thích: Ta nhận thấy vị trí từ loại cần tìm đứng sau trạng từ ''recently'' và nằm trong
mệnh đề trạng ngữ → Cần tìm một động từ được chia dưới dạng cấu trúc phân từ
→ Loại đáp án C (danh từ)
Ở đây ta nhận thấy trong mệnh đề chính, đối tượng ''residents of MillCreek Park'' -
nghĩa là cư dân của công viên Mill Creek'' chính là đối tượng chịu tác động của phân
từ ''poll''- ''thăm dò ý kiến mà phân từ diễn tả.
→ Phân từ trong câu sẽ cần chia theo thể bị động
⇒ Chọn D
Lưu ý: Phân từ có mối quan hệ chặt chế với chủ ngữ trong mệnh đề chính.
.
Chủ ngữ trong mệnh đề chính là chủ thể thực hiện hành động mà phân từ
diễn tả
→ Dùng phân từ hiện tại (thể chủ động)
·
Chủ ngữ trong mệnh đề chính là đối tượng chịu tác động của hành động mà
phân từ diễn tả
→ Dùng phân từ II (thể bị động).
Dịch: Khi được thăm dò ý kiến dạo gần đây, cư dân của công viên Mill Creek cho
rằng sự hỏng hóc của đường phố là vấn đề họ quan tâm nhất.
Từ vựng:
- recently (adv): gần đây
poll (n, v): cuộc thăm dò ý kiến, bỏ phiếu
- resident (n): cư dân
- disrepair (n): sự hỏng hóc
- concern (v): quan tâm'),
(@exercise_id_10, 5, 'Remember to check the spelling of Mr. Kamashi''s name when the document.', 'revising', 'revises', 'revised', 'revise', 'A', 'Đáp án đúng: A
Giải thích: Ta nhận thấy vị trí của từ cần điền đứng sau liên từ chỉ thời gian ''when'' để
liên kết hai hành động xảy ra song song cùng lúc: kiểm tra chính tả tên ông Kamashi
trong khi sửa tài liệu.
→ Cần tìm một cấu trúc phân từ
Ta nhận thấy hành động sửa tài liệu được thực hiện song song với hành động ''check'',
trong khi động từ check được chia ở thể chủ động
→ Cấu trúc phân từ cần tìm cũng cần được chia ở thể chủ động V-ing
⇒ Chọn A
Dịch: Nhớ kiểm tra chính tả tên của ông Kamashi khi sửa lại tài liệu.
Từ vựng:
- revise (v): sửa, ôn lại'),
(@exercise_id_10, 6, '_ last year, the unpublished novel by Martin Sim has attracted intense interest', 'Discover', 'Discovery', 'Discovered', 'Discovering', 'C', 'Đáp án đúng: C
Phân tích: Ta nhận thấy vị trí của từ loại cần điền đứng đầu vế trạng ngữ
→→ Cần tìm một cấu trúc phân từ (động từ) đóng vai trò như trạng từ để diễn tả thời
gian xảy ra của động từ ''has attracted'' ở mệnh đề chính
→ Loại đáp án A (động từ nguyên mẫu) và đáp án B (danh từ)
Chủ thể trong mệnh đề chính là ‘the unpublished novel by Martin Sim'' nghĩa là cuốn
tiểu thuyết chưa xuất bản của Martin Sim'', ta nhận thấy chủ thể đó được nhận tác
động từ phân từ (cuốn tiểu thuyết không thể phát hiện'' mà phải ''được phát hiện
Cần sử dụng cấu trúc phân từ ở thể bị động.
⇒ Chọn C
Dịch: Được phát hiện vào năm ngoái, cuốn tiểu thuyết chưa xuất bản của Martin Sim
đã thu hút sự quan tâm mạnh mẽ từ một số công xuất bản.
Từ vựng:
- discover (v): phát hiện
- discovery (n): khám phá
unpublished (adj): chưa được công bố
novel (n): tiểu thuyết
- intense (adj): mạnh mẽ'),
(@exercise_id_10, 7, '------ joined Vince''s Gym, Mr. Pinter could attend group classes and health counseling', 'Being', 'Having', 'To have', 'To be', 'B', 'Đáp án đúng: B
Giải thích:
Ta cần điền dạng đúng của trợ động từ đứng trước động từ "joined" (tham
gia). Xét ở mệnh đề phu, Mr. Pinter là người hiện hành động ''joined'' => loại các
cấu trúc bị động => loại đáp án A và D
Loại đáp án C vì không tồn tại cấu trúc to have + p.p đứng đầu câu.
=> chỉ còn lại đáp án B.
Đây là cấu trúc phân từ dạng chủ động, chia ở thì quá khứ (having + p.p), vì
hành động ''could attend...'' (có thể tham dự) ở mệnh đề chính xảy ra sau hành
động ''..joined Vince''s Gym'' (tham gia vào Vince''s Gym) ở mệnh đề phụ. Ngoài
ra, cấu trúc phân từ này có chức năng diễn tả lý do:
Having joined Vince''s Gym, Mr. Pinter could attend group classes and health
counseling sessions for free. = Because Mr. Pinter had joined Vince''s Gym, Mr.
Pinter could attend group classes and health counseling sessions for free.
Dịch: Vì đã tham gia vào Vince''s Gym nên ông Pinter có thể tham dự các lớp học
nhóm và các buổi tư vấn sức khỏe miễn phí.
Từ vựng:
Join (v): tham gia, gia nhập
Attend (v): tham dự
Counselling (n): sự tư vấn'),
(@exercise_id_10, 8, '_a degree in accounting, Ms. Sakai is considered one of the top candidates for', 'Having earned', 'Earned', 'Being earned', 'Earn', 'A', 'Đáp án đúng: A
Giải thích: Ta nhận thấy vị trí của từ cần tìm đứng đầu mệnh đề trạng ngữ. Xét về
nghĩa câu, vế trạng ngữ''_ a degree in accounting'' (bằng cấp về kế toán) mang ý
nghĩa chỉ lý do cho mệnh đề chính ''Ms. Sakai is considered one of the top candidates
for the management position'' (Bà Sakai được xem là một trong những ứng cử viên
hàng đầu cho vị trí quản lý)
→ Cần tìm một cấu trúc phân từ (chỉ lý do)
Loại đáp án D (động từ nguyên mẫu)
Ở đây ta thấy, hành động ở vế trạng ngữ ‘có bằng cấp về kế toán'' bắt buộc phải xảy ra
trong quá khứ, hoàn thành trước kết quả ở vế sau ''Bà Sakai được xem là một trong
những ứng cử viên hàng đầu cho vị trí quản lý
→ Cần một cấu trúc phân từ chia ở dạng having + p.p
⇒ Chọn A
Dịch: Khi đã có bằng cấp về kế toán, Bà Sakai được xem là một trong những ứng cử
viên hàng đầu cho vị trí quản lý.
Từ vựng:
- degree (n): bằng cấp
accounting (n): kế toán
- candidate (n): ứng viên');

-- =====================================================
-- Thêm bài tập Ngữ pháp: Cấu trúc so sánh
-- =====================================================

SET @topic_id_11 = (SELECT id FROM topics WHERE slug = 'cau-truc-so-sanh' LIMIT 1);

INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type)
VALUES (@topic_id_11, 20, 1, TRUE, 'GRAMMAR');

SET @exercise_id_11 = LAST_INSERT_ID();

INSERT IGNORE INTO exercise_questions (exercise_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id_11, 1, 'Some commuters were late because of the weather, but the road closures affected', 'great', 'greater', 'greatest', 'greatly', 'B', 'Đáp án đúng: B
Giải thích: Chỗ trống cần điền đứng sau trạng từ "even" (thậm chí) và đứng trướC
danh từ "number" (số lượng)
Cần tìm một tính từ ở dạng so sánh hơn để phù hợp với cấu trúc
Chọn B
Dịch: Một số người đi làm đã đến muộn vì thời tiết, nhưng việc cấm đường thậm chí
còn ảnh hưởng đến nhiều người hơn.
Từ vựng:
- commuter: người đi làm (đi và về thường ngày trên một con đường)
- road closure: việc cấm đường
- affect (v): ảnh hưởng'),
(@exercise_id_11, 2, 'Vallentrade manages clients'' accounts more ---- than most other brokerage firms.', 'conserves', 'conservative', 'conservatively', 'conserving', 'C', 'Đáp án đúng: C
Giải thích: Ta cần điền một từ loại thích hợp để điền vào chỗ trống
Phân tích cấu trúc câu ta thấy mệnh đề phía trước chỗ trống cần điền đã đầy đủ
S-V-O
=> từ cần điền là một trạng từ được dùng ở dạng so sánhhơn để bổ nghĩa cho động
từ ''manage ở phía trước
đáp án đúng là C
Dịch: Vallentrade quản lý tài khoản của khách hàng một cách thận trọng hơn hầu hết
các công ty môi giới khác.
Từ vựng:
Manage (v): quản lý
Conserve (v): duy trì, giữ gìn
Conservative (adj): (1) thận trọng; (2) để bảo tồn, duy trì; (3) bảo thủ
Brokerage (n): sự môi giới, nghề môi giới'),
(@exercise_id_11, 3, 'Liu''s Foods is pleased to reveal the_ product in its famous soup line: pumpkin', 'popularity of', 'as popular as', 'most popular', 'popular than', 'C', 'Đáp án đúng: C
Giải thích: Chỗ trống cần điền 1 tính từ hoặc 1 cụm tính từ để bổ nghĩa cho danh từ
"product" phía sau nó. Do trước chỗ trống có mạo từ "the" - dấu hiệu dạng so sánh
nhất → Chọn C
Dịch: Liu''s Foods hân hạnh tiết lộ sản phẩm phổ biến nhất trong dòng súp nổi tiếng
của hãng: súp bí đỏ.
Từ vựng:
- reveal: (v) tiết lộ, bộc lộ
popular: (adj) phổ biến, được yêu thích
- pumpkin (n): bí đỏ'),
(@exercise_id_11, 4, 'Although many factors contribute to a successful business, Mr. Lee thinks that', 'essential', 'most essential', 'essentially', 'more essentially', 'B', 'Đáp án đúng: B
Giải thích: Chỗ trống cần điền đứng sau mạo từ "the"→ dấu hiệu dạng so sánh nhất
→ Chọn B
Tạm dịch: Mặc dù có nhiều yếu tố góp phần tạo nên một doanh nghiệp thành công,
nhưng theo ông Lee cho rằng việc giữ cho khách hàng hài lòng là cần thiết nhất.
Từ vựng:
- factor (n): yếu tố
contribute (v): góp phần
successful (a): thành công
- satisfy (v): làm hài lòng'),
(@exercise_id_11, 5, 'The Aznet Foundation is offering three $5,000 grants to entrepreneurs with the most', 'imagine', 'imagining', 'imaginative', 'imagination', 'C', 'Đáp án đúng: C
Giải thích: Ta cần chọn một từ loại thích hợp để hoàn thành cụm danh từ "the most
_business ideas". Ở đây từ cần điền đứng trước các danh từ "business ideas" và
đi liền với dạng so sánh nhất của tính từ “the most" ⇒ ta cần chọn 1 tính từ → loại
đáp án A (động từ) và đáp án D (danh từ). Loại đáp án B vì imagine không có dạng
tính từ đuôi -ing
⇒ Chọn C.
Dịch: Quỹ Aznet đang cung cấp ba khoản tài trợ trị giá 5.000 đô la cho các doanh
nhân có ý tưởng kinh doanh sáng tạo nhất.
Từ vựng:
- entrepreneur: (n) doanh nhân
- grant: (v) tài trợ, cấp cho
- grant: (n) khoản tiền tài trợ'),
(@exercise_id_11, 6, 'The general manager has implemented a system to fill online orders of costume', 'quick', 'quickest', 'quicker', 'quickly', 'D', 'Đáp án đúng: D
Giải thích: Chỗ trống cần điền một trạng từ để bổ nghĩa cho động từ "fill" trước đó.
Loại A (động từ), B (tính từ dạng so sánh nhất), C (tính từ dạng so sánh hơn)
Chọn đáp án D
Dịch: Tổng giám đốc đã triển khai một hệ thống điền đơn đặt hàng trực tuyến các
dòng trang phục nữ trang nhanh chóng hơn.
Từ vựng:
implement (v): triển khai, thực hiện
- costume (n): trang phục
- jewelry (n): trang sức'),
(@exercise_id_11, 7, 'Complete the form carefully to ensure the processing of your application.', 'rapidly', 'more rapidly', 'most rapid', 'rapidity', 'C', 'Đáp án đúng: C
Giải thích: Ta nhận thấy từ loại cần tìm đứng trước một danh từ ''processing''
→ Cần tìm một tính từ để bổ nghĩa cho nó.
Loại đáp án A và B (có hậu tố -ly → trạng từ)
Loại đáp án D (có hậu tố -ity → danh từ)
⇒ Chọn C
Dịch:
Hoàn thành mẫu đơn một cách cẩn thận để đảm bảo đơn đăng ký của bạn được xử
lý nhanh nhất.
Từ vựng:
- ensure (v): đảm bảo
- rapid (adj): nhanh
rapidity (n): sự nhanh chóng
application (n): đơn đăng ký
- process (v): xử lý'),
(@exercise_id_11, 8, 'Sales of our computer software were good last quarter, but sales for our mobile', 'strong', 'stronger', 'strongly', 'strongest', 'B', 'Đáp án đúng: B
Giải thích: Ta nhận thấy vị trí của từ cần điền đứng ngay sau trạng từ ''even''.
''even'' là trạng từ thường được sử dụng trong so sánh hơn, dùng để nhấn mạnh, mang
nghĩa thậm chí ...hơn''
→ Cần tìm một tính từ ở dạng so sánh hơn
Loại đáp án A (tính từ thường), đáp án C (trạng từ hậu tố -ly) và đáp án D (tính từ
dạng so sánh nhất)
⇒ Chọn B
Lưu ý: Still/ a lot/ even/much /far + tính từ dạng so sánh hơn
Dịch: Doanh số bán phần mềm máy tính của chúng tôi quý trước rất tốt, nhưng doanh
số bán ứng dụng di động của chúng tôi thậm chí còn cao hơn.
Từ vựng:
software (n): phần mềm
quarter (n): quý
mobile application: úng dụng di động'),
(@exercise_id_11, 9, 'The study showed that customers aged 35 to 44 paid with a Sonoka credit card', 'frequently', 'frequent', 'more frequently', 'frequency', 'C', 'Đáp án đúng: C
Giải thích: Ta nhận thấy từ cần điền đứng trước than và có hai đối tượng xuất hiện
trong bài ''customers aged 35 to 44'' (1) ''customers in any other age groups'' (2)→
Dấu hiệu của cấu trúc so sánh hơn
Trong mệnh đề vì đã xuất hiện động từ paid trước đó → ta cần tìm một trạng từ bổ
nghĩa cho nó.
⇒ Chọn C.
Dịch: Nghiên cứu chỉ ra rằng khách hàng trong độ tuổi từ 35 đến 44 thanh toán với
thẻ tín dụng Sonoka thường xuyên hơn khách hàng trong nhóm tuổi khác.
Từ vựng:
study (n): nghiên cứu
- credit card: thẻ tín dụng
- frequent (adj): thường xuyên
- frequency (n): sự thường xuyên'),
(@exercise_id_11, 10, 'Ms. Ellis designed one of the most _ marketing campaigns the department had', 'create', 'creation', 'creative', 'creatively', 'C', 'Đáp án đúng: C
Giải thích: Ta nhận thấy từ loại cần điền đứng trước cụm danh từ ''marketing
campaigns'' và đứng sau cụm từ one of the mosť - dấu hiệu của dạng so sánh nhất
→ Cần tìm một tính từ
Loại đáp án A (động từ), đáp án B (danh từ hậu tố -tion) và đáp án D (trạng từ hậu tố
-ly)
⇒ Chọn C (tính từ hậu tố -ive)
Dịch: Cô Ellis đã sáng tạo ra một trong những chiến lược marketing sáng tạo nhất
mà phòng ban từng thấy.
Từ vựng:
design (v): thiết kế, sáng tạo
creative (adj): sáng tạo
- campaign (n): chiến dịch, chiến lược
- department (n): phòng ban'),
(@exercise_id_11, 11, 'Prethart Tool Company has created a more _ drill than its previous models.', 'powerful', 'powers', 'powerfully', 'power', 'A', 'Đáp án đúng: A
Giải thích: Ta nhận thấy từ loại cần điền đứng sau ''more - dấu hiệu nhận biết cấu
trúc so sánh hơn
→ Cần điền một tính từ
→ Loại đáp án B và D (danh từ) và đáp án C (trạng từ có hậu tố -ly)
⇒ Chọn A (tính từ hậu tố -ful)
Dịch: Công ty dụng cụ Prehar đã tạo ra mẫu khoan mạnh mẽ hơn các mẫu trước đó.
Từ vựng:
- tool (n): dụng cụ
- drill (n): cái khoan
- previous (adj): trước đó
- model (n): mô hình mẫu'),
(@exercise_id_11, 12, 'Attendees said the fireworks were the most_ part of the festival.', 'impression', 'impressive', 'impresses', 'impressed', 'B', 'Đáp án đúng: B
Giải thích: Ta nhận thấy vị trí từ cần điền đứng sau dạng so sánh nhất ''the mosť'' và
đứng trước một danh từ ''part
→ Cần tìm một tính từ
Loại đáp án A (danh từ hậu tố -ion), đáp án C và D (động từ chia thì đuôi -(e)s và đuôi
-ed)
→ Chọn B (tính từ hậu tố -ive)
Dịch: Người tham dự nói rằng pháo hoa là phần ấn tượng nhất của lễ hội.
Từ vựng:
- attendee (n): người tham dự
- firework (n): pháo hoa
- impressive (adj): ấn tượng nhất
- impression (n): sự ấn tượng'),
(@exercise_id_11, 13, 'No one at the Anshelt Corporation campaigned for expansion of the internship', 'energetic', 'most energetic', 'energetically', 'more energetically', 'D', 'Đáp án đúng: D
Giải thích: Ta nhận thấy vị trí của từ loại cần điền đứng sau động từ ''campaigned''
→ Cần tìm một trạng từ
Loại đáp án A và B (tính từ hậu tố -ic)
Ở vế sau của câu có xuất hiện dấu hiệu của so sánh hơn ‘than
⇒ Chon D
Dịch: Không ai ở Anshelt Corporation vận động hăng hái hơn Melody Ahn cho việc
mở rộng chương trình thực tập.
Từ vựng:
- corporation (n): tập đoàn
- campaign (v): vận động
- energetic (adj): tràn đầy năng lượng, nhiệt huyết
- expansion (n): sự mở rộng
internship (n): chương trình thực tập'),
(@exercise_id_11, 14, 'The new microwave soup containers are_ than the previous ones.', 'rigid', 'most rigidly', 'rigidly', 'more rigid', 'D', 'Đáp án đúng: D
Đáp án: Ta nhận thấy vị trí của từ cần điền đứng trước từ than - dấu hiệu của so
sánh hơn và trong câu chỉ có động từ chính ''are - động từ to be
→ Cần tìm một tính từ được viết ở dạng so sánh hơn
⇒ Chọn D
Dịch: Các đồ đựng súp trong lò vi sóng mới cứng hơn so với các đồ đựng trước đó.
Từ vựng:
- container (n): hộp đựng
- rigid (adj): cứng, rắn
- previous (adj): trước đó'),
(@exercise_id_11, 15, 'The Ford Group''s proposed advertising campaign is by far the most _ we have', 'innovate', 'innovative', 'innovations', 'innovatively', 'B', 'Đáp án đúng: B
Giải thích: Ta nhận thấy từ loại cần điền đứng sau động từ chính ''is'' và đứng ngay
sau ''the most'' - dấu hiệu nhận biết của so sánh nhất
→ Cần tìm một tính từ
Loại đáp án A (động từ), đáp án C (danh từ hậu tố -tion) và đáp án D (trạng từ hậu tố
-ly)
⇒ Chọn B
Dịch: Chiến dịch quảng cáo được đề xuất của Tập đoàn Ford là sáng tạo nhất mà
chúng tôi đã thấy cho đến nay.
Từ vựng:
- propose (v): đề nghị, đề xuất
advertising campaign: chiến dịch quảng cáo
innovative (adj): mang tính sáng tạo
innovation (n): sự sáng tạo
- innovate (v): cải cách, đổi mới'),
(@exercise_id_11, 16, 'The new printer operates more than the previous model did.', 'quickest', 'quickness', 'quick', 'quickly', 'D', 'Đáp án đúng: D
Giải thích: Ta nhận thấy vị trí của từ loại cần điền nằm sau động từ chính của câu
''operates'' và nằm giữa cấu trúc so sánh hơn ''more ... than''
→ Cần tìm một trạng từ
Loại đáp án A (so sánh nhất), đáp án B (danh từ hậu tố -ness) và đáp án C (tính từ)
⇒ Chọn D
Dịch: Máy in mới vận hành nhanh hơn mẫu trước đây.
Từ vựng:
- operate (v): vận hành
- model (n): mẫu, phiên bản'),
(@exercise_id_11, 17, 'The Ferrera Museum plans to exhibit a collection of Lucia Almeida''s most _', 'innovative', 'innovation', 'innovatively', 'innovate', 'A', 'Đáp án đúng: A
Giải thích: Ta nhận thấy vị trí của từ loại cần điền nằm trước danh từ ''sculptures''và
nằm sau cấu trúc so sánh nhất ''most''
→ Cần tìm một tính từ
Loại đáp án B (danh từ hậu tố -tion), đáp án C (trạng từ hậu tố -ly) và đáp án D (động
từ)
⇒ Chọn A (tính từ hậu tố -ive)
Dịch: Bảo tàng Ferrera lên kế hoạch trưng bày một bộ sưu tập những bức điêu khắc
sáng tạo nhất của Lucia Almeida.
Từ vựng:
- exhibit (v): trưng bày
collection (n): bộ sưu tập
innovative (adj): tính sáng tạo
sculpture (n): bức điêu khắc'),
(@exercise_id_11, 18, 'Prices at Taylor City Books are lower than at other online bookstores.', 'more significant', 'significant', 'significance', 'significantly', 'D', 'Đáp án đúng: D
Giải thích: Ta nhận thấy vị trí của từ loại cần điền đứng trước tính từ ''lower'' và năm
trong cấu trúc so sánh hơn ''lower than'', trong câu cũng đã có động từ chính ''are''
→ Cần tìm một trạng từ bổ nghĩa cho tính từ ''lower''
Loại đáp án A (more + tính từ), đáp án B (tính từ hậu tố -ant) và đáp án C (danh từ
hậu tố -ance)
⇒ Chọn D (trạng từ hậu tố -ly)
Dịch: Giá cả tại Taylor City Books thấp hơn một cách đáng kể so với giá ở các nhà
sách trực tuyến khác.
Từ vựng:
significant (adj): đáng kể, quan trọng
- significance (n): sự quan trọng, tính trọng đại'),
(@exercise_id_11, 19, 'Thank you for being one of Danton Transportation''s most _ customers over the', 'valuation', 'valued', 'value', 'values', 'B', 'Đáp án đúng: B
Phân tích: Ta nhận thấy vị trí của từ loại cần điền đứng trước danh từ ''customers'' và
nằm trong cấu trúc so sánh nhất ''most''
→ Cần tìm một tính từ
Loại đáp án A (danh từ hậu tố -tion), đáp án C (vừa là danh từ vừa là động từ) và đáp
án D (động từ đuôi -(e)s)
⇒ Chọn đáp án B (tính từ đuôi -ed)
Dịch: Cảm ơn bạn đã là một trong những khách hàng đặc biệt nhất của Danton
Transport trong mười năm qua.
Từ vựng:
valuation (n): sự định giá
- value (v, n): trân trọng; giá trị
- transportation (n): sự vận tải, chuyên chở'),
(@exercise_id_11, 20, 'The latest survey shows that our downtown store is more for local shoppers', 'conveniences', 'conveniently', 'convenience', 'convenient', 'D', 'Đáp án đúng: D
Giải thích: Ta nhận thấy vị trí của từ loại cần điền đứng sau động từ to be'' (is) và
nằm trong cấu trúc so sánh hơn ''more''
Cần tìm một tính từ
Loại đáp án A và C (danh từ hậu tố -ce), đáp án B (trạng từ hậu tố -ly)
⇒ Chon D
Dịch: Khảo sát mới nhất cho thấy cửa hàng ở trung tâm thành phố thuận tiện hơn
cho người mua hàng địa phương so với địa điểm ngoại ô của chúng tôi.
Từ vựng:
- latest (adj): mới nhất
- downtown store: cửa hàng ở trung tâm thành phố
suburban (adj): ngoại ô');


-- ==========================================
-- Original File: V19__add_slug_to_exercises.sql
-- ==========================================
-- V19__add_slug_to_exercises.sql

-- 1. Thêm cột slug (cho phép null tạm thời để update dữ liệu cũ)


-- 2. Cập nhật dữ liệu cũ (Tạo slug từ title)
-- Chuyển thành lowercase và thay khoảng trắng bằng dấu gạch ngang (giải pháp đơn giản cho tên tiếng Việt không dấu hoặc tiếng Anh)


-- Nếu có bài tập ngữ pháp mới





-- 3. Đặt UNIQUE constraint cho slug



-- ==========================================
-- Original File: V20__remove_redundant_columns_exercises.sql
-- ==========================================
-- =====================================================
-- V20__remove_redundant_columns_exercises.sql
-- Xóa các cột title, slug, description khỏi bảng exercises vì dư thừa
-- =====================================================




-- ==========================================
-- Original File: V21__reorganize_part5_topics.sql
-- ==========================================
-- =====================================================
-- V21__reorganize_part5_topics.sql
-- Cập nhật dữ liệu Part 5: Chia nhỏ thành các topic riêng biệt
-- =====================================================

SET SQL_SAFE_UPDATES = 0;

-- 0. Xóa topic Part 5 cũ (điều này sẽ xóa cascade luôn các lesson cũ thuộc topic này)
DELETE FROM topics WHERE slug = 'part-5-incomplete-sentences';

-- 1. Thêm các topic mới cho Part 5
INSERT IGNORE INTO topics (section_id, title, slug, description, order_index, is_active) VALUES
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), 'Tổng quan', 'topic-tong-quan-part-5', 'Tổng quan', 1, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), 'Câu hỏi từ loại', 'topic-cau-hoi-tu-loai-part-5', 'Câu hỏi từ loại', 2, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), 'Câu hỏi ngữ pháp', 'topic-cau-hoi-ngu-phap-part-5', 'Câu hỏi ngữ pháp', 3, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), 'Câu hỏi từ vựng', 'topic-cau-hoi-tu-vung-part-5', 'Câu hỏi từ vựng', 4, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), '[Câu hỏi từ vựng] Danh từ', 'topic-cau-hoi-tu-vung-danh-tu', '[Câu hỏi từ vựng] Danh từ', 5, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), '[Câu hỏi từ vựng] Động từ', 'topic-cau-hoi-tu-vung-dong-tu', '[Câu hỏi từ vựng] Động từ', 6, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), '[Câu hỏi từ vựng] Tính từ', 'topic-cau-hoi-tu-vung-tinh-tu', '[Câu hỏi từ vựng] Tính từ', 7, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), '[Câu hỏi từ vựng] Trạng từ', 'topic-cau-hoi-tu-vung-trang-tu', '[Câu hỏi từ vựng] Trạng từ', 8, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), '[Câu hỏi từ loại] Danh từ', 'topic-cau-hoi-tu-loai-danh-tu', '[Câu hỏi từ loại] Danh từ', 9, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), '[Câu hỏi từ loại] Tính từ', 'topic-cau-hoi-tu-loai-tinh-tu', '[Câu hỏi từ loại] Tính từ', 10, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), '[Câu hỏi từ loại] Trạng từ', 'topic-cau-hoi-tu-loai-trang-tu', '[Câu hỏi từ loại] Trạng từ', 11, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), '[Câu hỏi từ loại] Động từ', 'topic-cau-hoi-tu-loai-dong-tu', '[Câu hỏi từ loại] Động từ', 12, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), '[Câu hỏi ngữ pháp] Đại từ', 'topic-cau-hoi-ngu-phap-dai-tu', '[Câu hỏi ngữ pháp] Đại từ', 13, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), '[Câu hỏi ngữ pháp] Thì của động từ', 'topic-cau-hoi-ngu-phap-thi-dong-tu', '[Câu hỏi ngữ pháp] Thì của động từ', 14, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), '[Câu hỏi ngữ pháp] Thể của động từ (chủ động vs bị động)', 'topic-cau-hoi-ngu-phap-the-dong-tu', '[Câu hỏi ngữ pháp] Thể của động từ (chủ động vs bị động)', 15, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), '[Câu hỏi ngữ pháp] Cấu trúc phân từ', 'topic-cau-hoi-ngu-phap-cau-truc-phan-tu', '[Câu hỏi ngữ pháp] Cấu trúc phân từ', 16, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), '[Câu hỏi ngữ pháp] Dạng của động từ - Động từ nguyên mẫu có to (to V)', 'topic-cau-hoi-ngu-phap-dong-tu-to-v', '[Câu hỏi ngữ pháp] Dạng của động từ - Động từ nguyên mẫu có to (to V)', 17, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), '[Câu hỏi ngữ pháp] Dạng của động từ - Danh động từ (Ving)', 'topic-cau-hoi-ngu-phap-danh-dong-tu', '[Câu hỏi ngữ pháp] Dạng của động từ - Danh động từ (Ving)', 18, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), '[Câu hỏi ngữ pháp] Dạng của động từ - Động từ nguyên mẫu (V inf)', 'topic-cau-hoi-ngu-phap-dong-tu-nguyen-mau', '[Câu hỏi ngữ pháp] Dạng của động từ - Động từ nguyên mẫu (V inf)', 19, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), '[Câu hỏi ngữ pháp] Liên từ', 'topic-cau-hoi-ngu-phap-lien-tu', '[Câu hỏi ngữ pháp] Liên từ', 20, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), '[Câu hỏi ngữ pháp] Giới từ', 'topic-cau-hoi-ngu-phap-gioi-tu', '[Câu hỏi ngữ pháp] Giới từ', 21, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), '[Câu hỏi ngữ pháp] Câu cầu khiến', 'topic-cau-hoi-ngu-phap-cau-cau-khien', '[Câu hỏi ngữ pháp] Câu cầu khiến', 22, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), '[Câu hỏi ngữ pháp] Mệnh đề quan hệ', 'topic-cau-hoi-ngu-phap-menh-de-quan-he', '[Câu hỏi ngữ pháp] Mệnh đề quan hệ', 23, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), '[Câu hỏi ngữ pháp] Cấu trúc so sánh', 'topic-cau-hoi-ngu-phap-cau-truc-so-sanh', '[Câu hỏi ngữ pháp] Cấu trúc so sánh', 24, TRUE),
((SELECT id FROM sections WHERE slug = 'part-5-incomplete-sentences-dien-tu-vao-cau'), 'Luyện tập tổng hợp', 'topic-luyen-tap-tong-hop-part-5', 'Luyện tập tổng hợp', 25, TRUE);

-- 2. Thêm các bài học (lessons) cho các topic Part 5
INSERT IGNORE INTO lessons (
    topic_id,
    title,
    slug,
    duration_minutes,
    order_index,
    is_active
) VALUES
-- Lesson 1: Tổng quan
((SELECT id FROM topics WHERE slug = 'topic-tong-quan-part-5'),
 'Tổng quan',
 'lesson-tong-quan-part-5',
        20,
 1,
 TRUE
),

-- Lesson 2: Câu hỏi từ loại
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-tu-loai-part-5'),
 'Câu hỏi từ loại',
 'lesson-cau-hoi-tu-loai',
        20,
 1,
 TRUE
),

-- Lesson 3: Câu hỏi ngữ pháp
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-ngu-phap-part-5'),
 'Câu hỏi ngữ pháp',
 'lesson-cau-hoi-ngu-phap',
        20,
 1,
 TRUE
),

-- Lesson 4: Câu hỏi từ vựng
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-tu-vung-part-5'),
 'Câu hỏi từ vựng',
 'lesson-cau-hoi-tu-vung',
        20,
 1,
 TRUE
);


-- ==========================================
-- Original File: V23__reorganize_part6_topics.sql
-- ==========================================
-- =====================================================
-- V23__reorganize_part6_topics.sql
-- Restructure Part 6 topics, rename lessons, and create corresponding exercises.
-- =====================================================

-- Lấy ID của Section "Part 6"
SET @section_id = (SELECT id FROM sections WHERE slug = 'part-6-text-completion-dien-tu-vao-doan-van' LIMIT 1);

-- 1. Tạo 7 Topic mới cho Part 6
INSERT IGNORE INTO topics (section_id, title, slug, description, order_index, is_active) VALUES
(@section_id, 'Tổng quan', 'topic-part6-tong-quan', 'Tổng quan Part 6', 1, TRUE),
(@section_id, 'Câu hỏi từ loại', 'topic-part6-cau-hoi-tu-loai', 'Câu hỏi từ loại Part 6', 2, TRUE),
(@section_id, 'Câu hỏi ngữ pháp', 'topic-part6-cau-hoi-ngu-phap', 'Câu hỏi ngữ pháp Part 6', 3, TRUE),
(@section_id, 'Câu hỏi từ vựng', 'topic-part6-cau-hoi-tu-vung', 'Câu hỏi từ vựng Part 6', 4, TRUE),
(@section_id, 'Câu hỏi điền câu vào đoạn văn', 'topic-part6-dien-cau-vao-doan-van', 'Câu hỏi điền câu vào đoạn văn Part 6', 5, TRUE),
(@section_id, 'Luyện tập theo hình thức văn bản', 'topic-part6-luyen-tap-hinh-thuc-van-ban', 'Luyện tập theo hình thức văn bản Part 6', 6, TRUE),
(@section_id, 'Luyện tập tổng hợp', 'topic-part6-luyen-tap-tong-hop', 'Luyện tập tổng hợp Part 6', 7, TRUE);

-- 2. Di chuyển các lessons cũ sang Topic mới và đổi tên thành "Video bài giảng: Lý thuyết"

-- 2.1 Lesson: Tổng quan
UPDATE lessons 
SET topic_id = (SELECT id FROM topics WHERE slug = 'topic-part6-tong-quan' LIMIT 1),
    title = 'Video bài giảng: Lý thuyết',
    slug = 'lesson-part6-tong-quan-ly-thuyet'
WHERE slug = 'lesson-tong-quan-part-6';

-- 2.2 Lesson: Câu hỏi từ loại
UPDATE lessons 
SET topic_id = (SELECT id FROM topics WHERE slug = 'topic-part6-cau-hoi-tu-loai' LIMIT 1),
    title = 'Video bài giảng: Lý thuyết',
    slug = 'lesson-part6-cau-hoi-tu-loai-ly-thuyet'
WHERE slug = 'lesson-cau-hoi-tu-loai-part-6';

-- 2.3 Lesson: Câu hỏi ngữ pháp
UPDATE lessons 
SET topic_id = (SELECT id FROM topics WHERE slug = 'topic-part6-cau-hoi-ngu-phap' LIMIT 1),
    title = 'Video bài giảng: Lý thuyết',
    slug = 'lesson-part6-cau-hoi-ngu-phap-ly-thuyet'
WHERE slug = 'lesson-cau-hoi-ngu-phap-part-6';

-- 2.4 Lesson: Câu hỏi từ vựng
UPDATE lessons 
SET topic_id = (SELECT id FROM topics WHERE slug = 'topic-part6-cau-hoi-tu-vung' LIMIT 1),
    title = 'Video bài giảng: Lý thuyết',
    slug = 'lesson-part6-cau-hoi-tu-vung-ly-thuyet'
WHERE slug = 'lesson-cau-hoi-tu-vung-part-6';

-- 2.5 Lesson: Câu hỏi điền câu vào đoạn văn
UPDATE lessons 
SET topic_id = (SELECT id FROM topics WHERE slug = 'topic-part6-dien-cau-vao-doan-van' LIMIT 1),
    title = 'Video bài giảng: Lý thuyết',
    slug = 'lesson-part6-dien-cau-vao-doan-van-ly-thuyet'
WHERE slug = 'lesson-cau-hoi-dien-cau-vao-doan-van';

-- 3. Xóa các lessons cũ vốn dĩ là chỗ để bài tập (exercises)
DELETE FROM lessons WHERE slug IN (
    'lesson-luyen-tap-hinh-thuc-van-ban-email-letter',
    'lesson-luyen-tap-hinh-thuc-van-ban-article-review',
    'lesson-luyen-tap-hinh-thuc-van-ban-advertisement',
    'lesson-luyen-tap-hinh-thuc-van-ban-notice-announcement',
    'lesson-luyen-tap-hinh-thuc-van-ban-memo',
    'lesson-luyen-tap-tong-hop-part-6'
);

-- 4. Xóa Topic cũ mang tên "Part 6: Text Completion" do đã trống
-- Lệnh xóa này an toàn vì chúng ta đã di chuyển/xóa hết lessons bên trong.
DELETE FROM topics WHERE slug = 'part-6-text-completion';

-- 5. Tạo Exercises (Bài tập) cho các Topic mới

-- 5.1 Topic: Câu hỏi từ loại
INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type) VALUES
((SELECT id FROM topics WHERE slug = 'topic-part6-cau-hoi-tu-loai' LIMIT 1), 0, 1, TRUE, 'READING_PART6');

-- 5.2 Topic: Câu hỏi ngữ pháp
INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type) VALUES
((SELECT id FROM topics WHERE slug = 'topic-part6-cau-hoi-ngu-phap' LIMIT 1), 0, 1, TRUE, 'READING_PART6');

-- 5.3 Topic: Câu hỏi từ vựng
INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type) VALUES
((SELECT id FROM topics WHERE slug = 'topic-part6-cau-hoi-tu-vung' LIMIT 1), 0, 1, TRUE, 'READING_PART6');

-- 5.4 Topic: Câu hỏi điền câu vào đoạn văn
INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type) VALUES
((SELECT id FROM topics WHERE slug = 'topic-part6-dien-cau-vao-doan-van' LIMIT 1), 0, 1, TRUE, 'READING_PART6');

-- 5.5 Topic: Luyện tập theo hình thức văn bản
-- For this topic, we will insert 5 exercises. They will be distinguished by their order_index.
INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type) VALUES
((SELECT id FROM topics WHERE slug = 'topic-part6-luyen-tap-hinh-thuc-van-ban' LIMIT 1), 0, 1, TRUE, 'READING_PART6'),
((SELECT id FROM topics WHERE slug = 'topic-part6-luyen-tap-hinh-thuc-van-ban' LIMIT 1), 0, 2, TRUE, 'READING_PART6'),
((SELECT id FROM topics WHERE slug = 'topic-part6-luyen-tap-hinh-thuc-van-ban' LIMIT 1), 0, 3, TRUE, 'READING_PART6'),
((SELECT id FROM topics WHERE slug = 'topic-part6-luyen-tap-hinh-thuc-van-ban' LIMIT 1), 0, 4, TRUE, 'READING_PART6'),
((SELECT id FROM topics WHERE slug = 'topic-part6-luyen-tap-hinh-thuc-van-ban' LIMIT 1), 0, 5, TRUE, 'READING_PART6');

-- 5.6 Topic: Luyện tập tổng hợp
INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type) VALUES
((SELECT id FROM topics WHERE slug = 'topic-part6-luyen-tap-tong-hop' LIMIT 1), 0, 1, TRUE, 'READING_PART6');


-- ==========================================
-- Original File: V24__reorganize_part7_topics.sql
-- ==========================================
-- =====================================================
-- V24__reorganize_part7_topics.sql
-- Restructure Part 7 topics, rename lessons, and create corresponding exercises.
-- =====================================================

-- Lấy ID của Section "Part 7"
SET @section_id = (SELECT id FROM sections WHERE slug = 'part-7-reading-comprehension-doc-hieu-van-ban' LIMIT 1);

-- 1. Tạo 16 Topic mới cho Part 7
INSERT IGNORE INTO topics (section_id, title, slug, description, order_index, is_active) VALUES
(@section_id, 'Tổng quan', 'topic-part7-tong-quan', 'Tổng quan Part 7', 1, TRUE),
(@section_id, 'Câu hỏi về chủ đề, mục đích', 'topic-part7-cau-hoi-chu-de-muc-dich', 'Câu hỏi về chủ đề, mục đích Part 7', 2, TRUE),
(@section_id, 'Câu hỏi tìm thông tin', 'topic-part7-cau-hoi-tim-thong-tin', 'Câu hỏi tìm thông tin Part 7', 3, TRUE),
(@section_id, 'Câu hỏi suy luận', 'topic-part7-cau-hoi-suy-luan', 'Câu hỏi suy luận Part 7', 4, TRUE),
(@section_id, 'Câu hỏi tìm từ đồng nghĩa', 'topic-part7-cau-hoi-tim-tu-dong-nghia', 'Câu hỏi tìm từ đồng nghĩa Part 7', 5, TRUE),
(@section_id, 'Câu hỏi về hàm ý câu nói', 'topic-part7-cau-hoi-ham-y-cau-noi', 'Câu hỏi về hàm ý câu nói Part 7', 6, TRUE),
(@section_id, 'Câu hỏi tìm chi tiết sai', 'topic-part7-cau-hoi-tim-chi-tiet-sai', 'Câu hỏi tìm chi tiết sai Part 7', 7, TRUE),
(@section_id, 'Câu hỏi điền câu', 'topic-part7-cau-hoi-dien-cau', 'Câu hỏi điền câu Part 7', 8, TRUE),
(@section_id, 'Dạng bài Article/ Review - Bài báo/ Bài đánh giá', 'topic-part7-dang-bai-article-review', 'Dạng bài Article/ Review Part 7', 9, TRUE),
(@section_id, 'Dạng bài Announcement/ Notice - Thông báo', 'topic-part7-dang-bai-announcement-notice', 'Dạng bài Announcement/ Notice Part 7', 10, TRUE),
(@section_id, 'Dạng bài Email/ Letter - Thư điện tử/ Thư tay', 'topic-part7-dang-bai-email-letter', 'Dạng bài Email/ Letter Part 7', 11, TRUE),
(@section_id, 'Dạng bài Advertisement - Quảng cáo', 'topic-part7-dang-bai-advertisement', 'Dạng bài Advertisement Part 7', 12, TRUE),
(@section_id, 'Dạng bài Form - Biểu mẫu', 'topic-part7-dang-bai-form', 'Dạng bài Form Part 7', 13, TRUE),
(@section_id, 'Dạng bài Text message chain - Chuỗi tin nhắn', 'topic-part7-dang-bai-text-message-chain', 'Dạng bài Text message chain Part 7', 14, TRUE),
(@section_id, 'Luyện tập theo cấu trúc', 'topic-part7-luyen-tap-cau-truc', 'Luyện tập theo cấu trúc Part 7', 15, TRUE),
(@section_id, 'Luyện tập tổng hợp', 'topic-part7-luyen-tap-tong-hop', 'Luyện tập tổng hợp Part 7', 16, TRUE);

-- 2. Di chuyển các lessons cũ sang Topic mới và đổi tên

-- 2.1 Lesson: Tổng quan
UPDATE lessons 
SET topic_id = (SELECT id FROM topics WHERE slug = 'topic-part7-tong-quan' LIMIT 1),
    title = 'Video bài giảng: Lý thuyết',
    slug = 'lesson-part7-tong-quan-ly-thuyet'
WHERE slug = 'lesson-tong-quan-part-7';

-- 2.2 Lesson: Câu hỏi về chủ đề, mục đích
UPDATE lessons 
SET topic_id = (SELECT id FROM topics WHERE slug = 'topic-part7-cau-hoi-chu-de-muc-dich' LIMIT 1),
    title = 'Video bài giảng: Lý thuyết',
    slug = 'lesson-part7-cau-hoi-chu-de-muc-dich-ly-thuyet'
WHERE slug = 'lesson-cau-hoi-chu-de-muc-dich-part-7';

-- 2.3 Lesson: Câu hỏi tìm thông tin
UPDATE lessons 
SET topic_id = (SELECT id FROM topics WHERE slug = 'topic-part7-cau-hoi-tim-thong-tin' LIMIT 1),
    title = 'Video bài giảng: Lý thuyết',
    slug = 'lesson-part7-cau-hoi-tim-thong-tin-ly-thuyet'
WHERE slug = 'lesson-cau-hoi-tim-thong-tin';

-- 2.4 Lesson: Câu hỏi suy luận
UPDATE lessons 
SET topic_id = (SELECT id FROM topics WHERE slug = 'topic-part7-cau-hoi-suy-luan' LIMIT 1),
    title = 'Video bài giảng: Lý thuyết',
    slug = 'lesson-part7-cau-hoi-suy-luan-ly-thuyet'
WHERE slug = 'lesson-cau-hoi-suy-luan';

-- 2.5 Lesson: Câu hỏi tìm từ đồng nghĩa
UPDATE lessons 
SET topic_id = (SELECT id FROM topics WHERE slug = 'topic-part7-cau-hoi-tim-tu-dong-nghia' LIMIT 1),
    title = 'Video bài giảng: Lý thuyết',
    slug = 'lesson-part7-cau-hoi-tim-tu-dong-nghia-ly-thuyet'
WHERE slug = 'lesson-cau-hoi-tim-tu-dong-nghia';

-- 2.6 Lesson: Câu hỏi về hàm ý câu nói
UPDATE lessons 
SET topic_id = (SELECT id FROM topics WHERE slug = 'topic-part7-cau-hoi-ham-y-cau-noi' LIMIT 1),
    title = 'Video bài giảng: Lý thuyết',
    slug = 'lesson-part7-cau-hoi-ham-y-cau-noi-ly-thuyet'
WHERE slug = 'lesson-cau-hoi-ham-y-cau-noi-part-7';

-- 2.7 Lesson: Câu hỏi tìm chi tiết sai
UPDATE lessons 
SET topic_id = (SELECT id FROM topics WHERE slug = 'topic-part7-cau-hoi-tim-chi-tiet-sai' LIMIT 1),
    title = 'Video bài giảng: Lý thuyết',
    slug = 'lesson-part7-cau-hoi-tim-chi-tiet-sai-ly-thuyet'
WHERE slug = 'lesson-cau-hoi-tim-chi-tiet-sai';

-- 2.8 Lesson: Câu hỏi điền câu
UPDATE lessons 
SET topic_id = (SELECT id FROM topics WHERE slug = 'topic-part7-cau-hoi-dien-cau' LIMIT 1),
    title = 'Video bài giảng: Lý thuyết',
    slug = 'lesson-part7-cau-hoi-dien-cau-ly-thuyet'
WHERE slug = 'lesson-cau-hoi-dien-cau-part-7';

-- 2.9 Lesson: Dạng bài Article/ Review
UPDATE lessons 
SET topic_id = (SELECT id FROM topics WHERE slug = 'topic-part7-dang-bai-article-review' LIMIT 1),
    title = 'Lý thuyết: Lý thuyết',
    slug = 'lesson-part7-dang-bai-article-review-ly-thuyet'
WHERE slug = 'lesson-dang-bai-article-review';

-- 2.10 Lesson: Dạng bài Announcement/ Notice
UPDATE lessons 
SET topic_id = (SELECT id FROM topics WHERE slug = 'topic-part7-dang-bai-announcement-notice' LIMIT 1),
    title = 'Lý thuyết: Lý thuyết',
    slug = 'lesson-part7-dang-bai-announcement-notice-ly-thuyet'
WHERE slug = 'lesson-dang-bai-announcement-notice';

-- 2.11 Lesson: Dạng bài Email/ Letter
UPDATE lessons 
SET topic_id = (SELECT id FROM topics WHERE slug = 'topic-part7-dang-bai-email-letter' LIMIT 1),
    title = 'Lý thuyết: Lý thuyết',
    slug = 'lesson-part7-dang-bai-email-letter-ly-thuyet'
WHERE slug = 'lesson-dang-bai-email-letter';

-- 2.12 Lesson: Dạng bài Advertisement
UPDATE lessons 
SET topic_id = (SELECT id FROM topics WHERE slug = 'topic-part7-dang-bai-advertisement' LIMIT 1),
    title = 'Lý thuyết: Lý thuyết',
    slug = 'lesson-part7-dang-bai-advertisement-ly-thuyet'
WHERE slug = 'lesson-dang-bai-advertisement-part-7';

-- 2.13 Lesson: Dạng bài Form
UPDATE lessons 
SET topic_id = (SELECT id FROM topics WHERE slug = 'topic-part7-dang-bai-form' LIMIT 1),
    title = 'Lý thuyết: Lý thuyết',
    slug = 'lesson-part7-dang-bai-form-ly-thuyet'
WHERE slug = 'lesson-dang-bai-form';

-- 2.14 Lesson: Dạng bài Text message chain
UPDATE lessons 
SET topic_id = (SELECT id FROM topics WHERE slug = 'topic-part7-dang-bai-text-message-chain' LIMIT 1),
    title = 'Lý thuyết: Lý thuyết',
    slug = 'lesson-part7-dang-bai-text-message-chain-ly-thuyet'
WHERE slug = 'lesson-dang-bai-text-message-chain';


-- 3. Xóa các lessons cũ vốn dĩ là chỗ để bài tập (exercises)
DELETE FROM lessons WHERE slug IN (
    'lesson-luyen-tap-cau-truc-mot-doan',
    'lesson-luyen-tap-cau-truc-nhieu-doan',
    'lesson-luyen-tap-tong-hop-part-7'
);

-- 4. Xóa Topic cũ mang tên "Part 7: Reading Comprehension" do đã trống
DELETE FROM topics WHERE slug = 'part-7-reading-comprehension';

-- 5. Tạo Exercises (Bài tập) cho các Topic mới

-- Topic 2: Câu hỏi về chủ đề, mục đích
INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type) VALUES
((SELECT id FROM topics WHERE slug = 'topic-part7-cau-hoi-chu-de-muc-dich' LIMIT 1), 0, 1, TRUE, 'READING_PART7');

-- Topic 3: Câu hỏi tìm thông tin
INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type) VALUES
((SELECT id FROM topics WHERE slug = 'topic-part7-cau-hoi-tim-thong-tin' LIMIT 1), 0, 1, TRUE, 'READING_PART7');

-- Topic 4: Câu hỏi suy luận
INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type) VALUES
((SELECT id FROM topics WHERE slug = 'topic-part7-cau-hoi-suy-luan' LIMIT 1), 0, 1, TRUE, 'READING_PART7');

-- Topic 5: Câu hỏi tìm từ đồng nghĩa
INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type) VALUES
((SELECT id FROM topics WHERE slug = 'topic-part7-cau-hoi-tim-tu-dong-nghia' LIMIT 1), 0, 1, TRUE, 'READING_PART7');

-- Topic 6: Câu hỏi về hàm ý câu nói
INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type) VALUES
((SELECT id FROM topics WHERE slug = 'topic-part7-cau-hoi-ham-y-cau-noi' LIMIT 1), 0, 1, TRUE, 'READING_PART7');

-- Topic 7: Câu hỏi tìm chi tiết sai
INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type) VALUES
((SELECT id FROM topics WHERE slug = 'topic-part7-cau-hoi-tim-chi-tiet-sai' LIMIT 1), 0, 1, TRUE, 'READING_PART7');

-- Topic 8: Câu hỏi điền câu
INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type) VALUES
((SELECT id FROM topics WHERE slug = 'topic-part7-cau-hoi-dien-cau' LIMIT 1), 0, 1, TRUE, 'READING_PART7');

-- Topic 9: Dạng bài Article/ Review
INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type) VALUES
((SELECT id FROM topics WHERE slug = 'topic-part7-dang-bai-article-review' LIMIT 1), 0, 1, TRUE, 'READING_PART7');

-- Topic 10: Dạng bài Announcement/ Notice
INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type) VALUES
((SELECT id FROM topics WHERE slug = 'topic-part7-dang-bai-announcement-notice' LIMIT 1), 0, 1, TRUE, 'READING_PART7');

-- Topic 11: Dạng bài Email/ Letter
INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type) VALUES
((SELECT id FROM topics WHERE slug = 'topic-part7-dang-bai-email-letter' LIMIT 1), 0, 1, TRUE, 'READING_PART7');

-- Topic 12: Dạng bài Advertisement
INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type) VALUES
((SELECT id FROM topics WHERE slug = 'topic-part7-dang-bai-advertisement' LIMIT 1), 0, 1, TRUE, 'READING_PART7');

-- Topic 13: Dạng bài Form
INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type) VALUES
((SELECT id FROM topics WHERE slug = 'topic-part7-dang-bai-form' LIMIT 1), 0, 1, TRUE, 'READING_PART7');

-- Topic 14: Dạng bài Text message chain
INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type) VALUES
((SELECT id FROM topics WHERE slug = 'topic-part7-dang-bai-text-message-chain' LIMIT 1), 0, 1, TRUE, 'READING_PART7');

-- Topic 15: Luyện tập theo cấu trúc (2 exercises)
INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type) VALUES
((SELECT id FROM topics WHERE slug = 'topic-part7-luyen-tap-cau-truc' LIMIT 1), 0, 1, TRUE, 'READING_PART7'),
((SELECT id FROM topics WHERE slug = 'topic-part7-luyen-tap-cau-truc' LIMIT 1), 0, 2, TRUE, 'READING_PART7');

-- Topic 16: Luyện tập tổng hợp
INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type) VALUES
((SELECT id FROM topics WHERE slug = 'topic-part7-luyen-tap-tong-hop' LIMIT 1), 0, 1, TRUE, 'READING_PART7');


-- ==========================================
-- Original File: V25__reorganize_part4_topics.sql
-- ==========================================
-- =====================================================
-- V25__reorganize_part4_topics.sql
-- Cập nhật dữ liệu Part 4: Chia nhỏ thành các topic riêng biệt
-- =====================================================

SET SQL_SAFE_UPDATES = 0;

-- 0. Xóa topic Part 4 cũ (điều này sẽ xóa cascade luôn các lesson cũ thuộc topic này)
DELETE FROM topics WHERE slug = 'part-4-talks';

-- 1. Thêm các topic mới cho Part 4
INSERT IGNORE INTO topics (section_id, title, slug, description, order_index, is_active) VALUES
((SELECT id FROM sections WHERE slug = 'part-4-talks-nghe-hieu-bai-noi'), 'Tổng quan', 'topic-tong-quan-part-4', 'Tổng quan', 1, TRUE),
((SELECT id FROM sections WHERE slug = 'part-4-talks-nghe-hieu-bai-noi'), 'Câu hỏi về chủ đề, mục đích', 'topic-cau-hoi-ve-chu-de-muc-dich-part-4', 'Câu hỏi về chủ đề, mục đích', 2, TRUE),
((SELECT id FROM sections WHERE slug = 'part-4-talks-nghe-hieu-bai-noi'), 'Câu hỏi về danh tính, địa điểm', 'topic-cau-hoi-ve-danh-tinh-dia-diem-part-4', 'Câu hỏi về danh tính, địa điểm', 3, TRUE),
((SELECT id FROM sections WHERE slug = 'part-4-talks-nghe-hieu-bai-noi'), 'Câu hỏi về chi tiết', 'topic-cau-hoi-ve-chi-tiet-part-4', 'Câu hỏi về chi tiết', 4, TRUE),
((SELECT id FROM sections WHERE slug = 'part-4-talks-nghe-hieu-bai-noi'), 'Câu hỏi yêu cầu, gợi ý', 'topic-cau-hoi-yeu-cau-goi-y-part-4', 'Câu hỏi yêu cầu, gợi ý', 5, TRUE),
((SELECT id FROM sections WHERE slug = 'part-4-talks-nghe-hieu-bai-noi'), 'Câu hỏi về hành động tương lai', 'topic-cau-hoi-ve-hanh-dong-tuong-lai-part-4', 'Câu hỏi về hành động tương lai', 6, TRUE),
((SELECT id FROM sections WHERE slug = 'part-4-talks-nghe-hieu-bai-noi'), 'Câu hỏi về hàm ý câu nói', 'topic-cau-hoi-ve-ham-y-cau-noi-part-4', 'Câu hỏi về hàm ý câu nói', 7, TRUE),
((SELECT id FROM sections WHERE slug = 'part-4-talks-nghe-hieu-bai-noi'), 'Câu hỏi kết hợp bảng biểu', 'topic-cau-hoi-ket-hop-bang-bieu-part-4', 'Câu hỏi kết hợp bảng biểu', 8, TRUE),
((SELECT id FROM sections WHERE slug = 'part-4-talks-nghe-hieu-bai-noi'), 'Dạng bài Telephone message - Tin nhắn thoại', 'topic-dang-bai-telephone-message-part-4', 'Dạng bài Telephone message - Tin nhắn thoại', 9, TRUE),
((SELECT id FROM sections WHERE slug = 'part-4-talks-nghe-hieu-bai-noi'), 'Dạng bài Advertisement - Quảng cáo', 'topic-dang-bai-advertisement-part-4', 'Dạng bài Advertisement - Quảng cáo', 10, TRUE),
((SELECT id FROM sections WHERE slug = 'part-4-talks-nghe-hieu-bai-noi'), 'Dạng bài Announcement - Thông báo', 'topic-dang-bai-announcement-part-4', 'Dạng bài Announcement - Thông báo', 11, TRUE),
((SELECT id FROM sections WHERE slug = 'part-4-talks-nghe-hieu-bai-noi'), 'Dạng bài Talk - Bài phát biểu, diễn văn', 'topic-dang-bai-talk-part-4', 'Dạng bài Talk - Bài phát biểu, diễn văn', 12, TRUE),
((SELECT id FROM sections WHERE slug = 'part-4-talks-nghe-hieu-bai-noi'), 'Dạng bài News report, Broadcast - Bản tin', 'topic-dang-bai-news-report-part-4', 'Dạng bài News report, Broadcast - Bản tin', 13, TRUE),
((SELECT id FROM sections WHERE slug = 'part-4-talks-nghe-hieu-bai-noi'), 'Dạng bài Excerpt from a meeting - Trích dẫn từ buổi họp', 'topic-dang-bai-excerpt-from-a-meeting-part-4', 'Dạng bài Excerpt from a meeting - Trích dẫn từ buổi họp', 14, TRUE),
((SELECT id FROM sections WHERE slug = 'part-4-talks-nghe-hieu-bai-noi'), 'Luyện tập tổng hợp', 'topic-luyen-tap-tong-hop-part-4', 'Luyện tập tổng hợp', 15, TRUE);

-- 2. Thêm các bài học (lessons) cho topic Part 4
INSERT IGNORE INTO lessons (
    topic_id,
    title,
    slug,
    duration_minutes,
    order_index,
    is_active
) VALUES
-- Lesson 1: Tổng quan
((SELECT id FROM topics WHERE slug = 'topic-tong-quan-part-4'),
 'Video bài giảng: Lý thuyết',
 'lesson-tong-quan-part-4',
        20,
 1,
 TRUE
),

-- Lesson 2: Câu hỏi về chủ đề, mục đích
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-ve-chu-de-muc-dich-part-4'),
 'Video bài giảng: Lý thuyết',
 'lesson-cau-hoi-ve-chu-de-muc-dich-part4',
        20,
 1,
 TRUE
),

-- Lesson 3: Câu hỏi về danh tính, địa điểm
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-ve-danh-tinh-dia-diem-part-4'),
 'Video bài giảng: Lý thuyết',
 'lesson-cau-hoi-ve-danh-tinh-dia-diem',
        20,
 1,
 TRUE
),

-- Lesson 4: Câu hỏi về chi tiết
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-ve-chi-tiet-part-4'),
 'Video bài giảng: Lý thuyết',
 'lesson-cau-hoi-ve-chi-tiet',
        20,
 1,
 TRUE
),

-- Lesson 5: Câu hỏi yêu cầu, gợi ý
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-yeu-cau-goi-y-part-4'),
 'Video bài giảng: Lý thuyết',
 'lesson-cau-hoi-yeu-cau-goi-y',
        20,
 1,
 TRUE
),

-- Lesson 6: Câu hỏi về hành động tương lai
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-ve-hanh-dong-tuong-lai-part-4'),
 'Video bài giảng: Lý thuyết',
 'lesson-cau-hoi-ve-hanh-dong-tuong-lai-part4',
        20,
 1,
 TRUE
),

-- Lesson 7: Câu hỏi về hàm ý câu nói
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-ve-ham-y-cau-noi-part-4'),
 'Video bài giảng: Lý thuyết',
 'lesson-cau-hoi-ve-ham-y-cau-noi-part4',
        20,
 1,
 TRUE
),

-- Lesson 8: Câu hỏi kết hợp bảng biểu
((SELECT id FROM topics WHERE slug = 'topic-cau-hoi-ket-hop-bang-bieu-part-4'),
 'Video bài giảng: Lý thuyết',
 'lesson-cau-hoi-ket-hop-bang-bieu-part4',
        20,
 1,
 TRUE
),

-- Lesson 9: Dạng bài Telephone message - Tin nhắn thoại
((SELECT id FROM topics WHERE slug = 'topic-dang-bai-telephone-message-part-4'),
 'Lý thuyết: Lý thuyết',
 'lesson-dang-bai-telephone-message',
        20,
 1,
 TRUE
),

-- Lesson 10: Dạng bài Advertisement - Quảng cáo
((SELECT id FROM topics WHERE slug = 'topic-dang-bai-advertisement-part-4'),
 'Lý thuyết: Lý thuyết',
 'lesson-dang-bai-advertisement',
        20,
 1,
 TRUE
),

-- Lesson 11: Dạng bài Announcement - Thông báo
((SELECT id FROM topics WHERE slug = 'topic-dang-bai-announcement-part-4'),
 'Lý thuyết: Lý thuyết',
 'lesson-dang-bai-announcement',
        20,
 1,
 TRUE
),

-- Lesson 12: Dạng bài Talk - Bài phát biểu, diễn văn
((SELECT id FROM topics WHERE slug = 'topic-dang-bai-talk-part-4'),
 'Lý thuyết: Lý thuyết',
 'lesson-dang-bai-talk',
        20,
 1,
 TRUE
),

-- Lesson 13: Dạng bài News report, Broadcast - Bản tin
((SELECT id FROM topics WHERE slug = 'topic-dang-bai-news-report-part-4'),
 'Lý thuyết: Lý thuyết',
 'lesson-dang-bai-news-report',
        20,
 1,
 TRUE
),

-- Lesson 14: Dạng bài Excerpt from a meeting - Trích dẫn từ buổi họp
((SELECT id FROM topics WHERE slug = 'topic-dang-bai-excerpt-from-a-meeting-part-4'),
 'Lý thuyết: Lý thuyết',
 'lesson-dang-bai-excerpt-from-a-meeting',
        20,
 1,
 TRUE
);


-- ==========================================
-- Original File: V26__insert_part6_cau_hoi_tu_loai_questions.sql
-- ==========================================
-- =====================================================
-- Thêm bài tập cho Topic topic-part6-cau-hoi-tu-loai
-- =====================================================

SET @topic_id = (SELECT id FROM topics WHERE slug = 'topic-part6-cau-hoi-tu-loai' LIMIT 1);

SET @exercise_id = (SELECT id FROM exercises WHERE topic_id = @topic_id LIMIT 1);

UPDATE exercises SET total_questions = 20 WHERE id = @exercise_id;

-- Group 1
INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, passage) VALUES (@exercise_id, 1, '', 'WXO Radio Turns 50!\n\nOn February 3 WXO Radio will celebrate its fiftieth anniversary. That’s half a century of stimulating _____(135). Over the years, we _____(136) our listeners breaking news, thought-provoking stories, and popular music from around the world. Now we invite you to celebrate with us during an open house from 5:00 P.M. to 6.30 P.M. on February 3 at our Eighth Street studio. Take a tour and see some of the behind-the-scenes magic. Watch a demonstration of our digital audio equipment. _____(137). The open house is free, but registration is required. We hope you can join us for this _____(138) occasion.\n\n---\n\nDịch nghĩa\n\nWXO Radio bước qua tuổi 50!\n\nVào ngày 3 tháng 2, WXO Radio sẽ tổ chức kỷ niệm thành lập lần thứ 50. Đó là nửa thế kỷ của các chương trình phát sóng thú vị này. Trong những năm qua, chúng tôi đã cung cấp cho người nghe của chúng tôi những tin tức nóng hổi, những câu chuyện đáng suy ngẫm và âm nhạc thịnh hành từ khắp nơi trên thế giới. Bây giờ chúng tôi mời bạn cùng ăn mừng với chúng tôi tại sự kiện từ 5:00 giờ đến 6:30 chiều vào ngày 3 tháng 2 tại studio Eighth Street của chúng tôi. Hãy tham quan và xem một số điều kỳ diệu ở hậu trường. Hãy thưởng thức phần trình diễn bằng các thiết bị âm thanh kỹ thuật số của chúng tôi. Bạn thậm chí còn có thể gặp một số nhân viên phát thanh yêu thích của bạn. Sự kiện này miễn phí, nhưng bạn cần đăng ký. Chúng tôi hy vọng bạn có thể tham gia cùng chúng tôi trong dịp đặc biệt này.');
SET @group_id = LAST_INSERT_ID();
INSERT INTO exercise_questions (exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id, @group_id, 138, '(138)', 'special', 'specialize', 'especially', 'specialization', 'A', 'Ta cần 1 tính từ đi trước và bổ sung ý nghĩa cho danh từ “occasion” phía sau, chọn A.');

-- Group 2
INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, passage) VALUES (@exercise_id, 2, '', 'Date: November 5\nSubject: Welcome to Art Today\nAttachment: Form\nDear Ms. Bhat:\nThank you for subscribing to Art Today! _____(143) you will be among the first to know about exciting art exhibits, concerts, auctions, and festivals throughout Western Canada. Your first issue will arrive within the next few days, and then each issue will be sent at the beginning of the month. _____(144). Your subscription also allows you unlimited _____(145) to articles, videos, and other multimedia on our Web site. All you need to do is log in using your subscriber number and password, which you will find _____(146) the enclosed enrollment form.\nSincerely,\nKen Suzuki\nCustomer Representative\n\n---\n\nDịch nghĩa\n\nTừ: Chăm sóc khách hàng (custcare@arttodaymag.ca)\n\nĐến: Karina Bhat (kbhat871@5mail.ca)\n\nNgày: 5 tháng 11\n\nChủ đề: Chào mừng đến Art Today\n\nĐính kèm: Biểu mẫu\n\nCô Bhat thân mến:\n\nCảm ơn bạn đã đăng ký Art Today! Bây giờ bạn sẽ là một trong những người đầu tiên biết về triển lãm nghệ thuật, các buổi hòa nhạc, đấu giá và lễ hội thú vị trên khắp miền Tây Canada. Số báo đầu tiên của bạn sẽ đến trong vòng vài ngày tới và sau đó mỗi số sẽ được gửi vào đầu tháng. Nếu bạn không nhận được số báo của bạn trong một tuần, vui lòng liên hệ với chúng tôi ngay lập tức. Sau khi Đăng ký bạn cũng có thể truy cập không giới hạn vào các bài viết, video và đa phương tiện khác trên trang web của chúng tôi. Tất cả những gì bạn cần làm là đăng nhập bằng số thuê bao và mật khẩu, những cái này bạn sẽ tìm thấy trên mẫu đăng ký đính kèm.\n\nTrân trọng,\n\nKen Suzuki\n\nĐại diện chăm sóc khách hàng');
SET @group_id = LAST_INSERT_ID();
INSERT INTO exercise_questions (exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id, @group_id, 145, '(145)', 'accessing', 'accesses', 'accessed', 'access', 'D', 'Chúng ta có cấu trúc ALLOW SOMEONE SOMETHING, mà “unlimited” là tính từ, vậy thì ta cần 1 danh từ điền vào chỗ trống để hoàn thiện cấu trúc này., access là danh từ không đếm được\n→ Chọn D');

-- Group 3
INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, passage) VALUES (@exercise_id, 3, '', 'To: saul_ortega@jmail.net\nFrom: k_morris@tknmanufacturing.com\nDate: October 18\nSubject: Factory Manager position\nDear Mr. Ortega,\nYou are officially invited to a second interview. This time, I will be meeting only with the top candidates to determine who is most _____(135) for the manager position. I believe you possess many of the _____(136) we are looking for.\nI trust that you remain interested in this job opportunity. _____(137), would a 1:00 PM appointment next Tuesday work for you? Please prepare a proposal that explains how you would increase production at our plant without decreasing quality. _____(138)\nBest regards,\nKaren Morris\nTKN Manufacturing\n202-555-0127 ext. 23\n\n---\n\nDịch nghĩa\n\nĐến: saul_ortega@jmail.net\n\nTừ: k_morris@tknmanufacturing.com\n\nNgày: 18 tháng 10\n\nChủ đề: Vị trí quản lý xưởng\n\nGửi anh Ortega,\n\nAnh chính thức được mời đến cuộc phỏng vấn thứ hai. Lần này, tôi sẽ chỉ gặp gỡ những ứng viên xuất sắc để xác định ai phù hợp nhất cho vị trí quản lý. Tôi tin rằng bạn sở hữu nhiều phẩm chất mà chúng tôi đang tìm kiếm.\n\nTôi tin rằng bạn vẫn quan tâm đến cơ hội việc làm này. Nếu đúng vậy, bạn có sắp xếp được một cuộc hẹn với tôi vào 1 giờ chiều thứ ba tới không? Hãy chuẩn bị một đề xuất cho việc làm thế nào để bạn sẽ tăng sản lượng tại nhà máy mà không làm giảm chất lượng. Tôi mong muốn được thấy ý kiến của bạn để có thể xây dựng được một nơi làm việc hiệu quả.\n\nTrân trọng,\n\nKaren Morris\n\nTKN Manufacturing\n\n202-555-0127 số máy lẻ 23');
SET @group_id = LAST_INSERT_ID();
INSERT INTO exercise_questions (exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id, @group_id, 135, '(135)', 'suiting', 'suitable', 'suit', 'suits', 'B', 'Ở câu này, từ cần điền nằm sau ‘the most’ → ta cần một tính từ\n→ chọn đáp án B');

-- Group 4
INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, passage) VALUES (@exercise_id, 4, '', 'Education Fair\n(9 July)–The annual International Higher Education Fair came to Jakarta for the third consecutive year on Saturday, 7 July. _____(143). As usual, American and Australian universities were _____(144) represented. _____(145), observers noted that participation from European and Asian universities has been increasing year by year. Also noticeable was the fact that many more graduate students attended the _____(146) this year than in the past.\n\n---\n\nDịch nghĩa\n\nNgày hội giáo dục\n\n(Ngày 9/7) Ngày hội Giáo dục Đại học Quốc tế hàng năm đã tổ chức tại Jakarta năm thứ 3 liên tiếp vào thứ 7 ngày 7/7. Ngày hội thu hút hàng trăm học viện trên toàn thế giới. Như thường lệ, những đại học của Mỹ và Úc có rất nhiều đại diện tham dự. Hơn thế nữa, theo những nhà quan sát thì số lượng các trường đại học từ châu Âu và châu Á tham dự ngày hội đang tăng lên từng năm. Và một điều đáng chú ý nữa là sinh viên đã tốt nghiệp tham gia sự kiện năm nay đã nhiều hơn lúc trước.');
SET @group_id = LAST_INSERT_ID();
INSERT INTO exercise_questions (exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id, @group_id, 144, '(144)', 'heavy', 'heavily', 'heavier', 'heaviness', 'B', 'A. nặng nề\nB. một cách nặng nề\nC. nặng hơn\nD. sự nặng nề\nNhìn vào chỗ trống cần điền, ta thấy từ cần điền đứng trước một động từ “represented”, vì thế ta cần một trạng từ bổ sung ý nghĩa cho động từ đó\n→ chọn đáp án B');

-- Group 5
INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, passage) VALUES (@exercise_id, 5, '', 'May 7\nBy Josip Kovach\nThe Greenville Transportation Commission (GTC) will hold a public meeting at City Hall on Thursday, May 15, at 7 P.M., to discuss its proposal to extend light rail service to Greenville Industrial Park. _____(139). Residents of the neighborhood have complained that the extension will generate too much noise during peak commuting hours. _____(140), the GTC has been studying the feasibility of installing noise barriers along the tracks. At the meeting, Leora Kelman, CEO of Acoustic Engineering, will explain how much noise reduction the GTC can _____(141) to achieve with the barriers. A _____(142) by Mayor Joe Rowan will follow.\n\n---\n\nDịch nghĩa\n\nNgày 7 tháng 5\n\nBởi Josip Kovach\n\nỦy ban Giao thông vận tải (GTC) sẽ tổ chức một buổi họp công khai tại Tòa thị chính vào thứ Năm, ngày 15 tháng 5, lúc 7 giờ sáng, để thảo luận về đề xuất mở rộng dịch vụ đường sắt đến Khu công nghiệp Greenville. Tuyến đường sắt sẽ chạy qua một khu dân cư. Cư dân trong khu phố đã phàn nàn rằng việc mở rộng này sẽ gây ra nhiều tiếng ồn trong giờ di chuyển cao điểm. Đáp lại, GTC đã nghiên cứu tính khả thi của việc cài đặt các rào chắn tiếng ồn dọc theo đường ray. Tại cuộc họp, Leora Kelman, Giám đốc điều hành của Acoustic Engineering, sẽ giải thích về mức độ giảm tiếng ồn có thể đạt được với các rào chắn . Bài thuyết trình của Thị trưởng Joe Rowan sẽ tiếp tục sau đó.');
SET @group_id = LAST_INSERT_ID();
INSERT INTO exercise_questions (exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id, @group_id, 142, '(142)', 'present', 'presenting', 'presenter', 'presentation', 'D', '→ như vậy từ cần điền cho câu số 142 phải là một danh từ. 2 lựa chọn C, D đều là danh từ nhưng xét về nghĩa thì đáp án D đúng\n→ chọn đáp án D\nSau mạo từ “a” ta cần một danh từ, xét ý nghĩa ta chọn “presentation”.');

-- Group 6
INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, passage) VALUES (@exercise_id, 6, '', 'For months, Yi Zhang, owner of Zhang Office Supplies, had been searching for a way to increase —– (139) Then, by sheer chance, he heard about an approach called Voice of the Customer (VOC). “When I called Hsing Market Research I was really intrigued as the method was presented to me. The representative I spoke with convinced me to give —– (140) a try.” Mr. Zhang learned that VOC uses market research as an aid to designing targeted advertisements. Using the method, he first determined —– (141) what potential customers are concerned about and what they want when shopping for office supplies. Then he used candid quotes from the people who participated in his market research to create advertisements for his Web site. —– (142) “Thanks to VOC,” he says, smiling, “my customer base has expanded like never before.”\n\n---\n\nDịch nghĩa\n\nTrong nhiều tháng, Yi Zhang, chủ sở hữu Văn phòng Zhang, đã tìm kiếm một cách để tăng doanh số bán hàng (139). “Khi tôi gọi cho Hsing Market Research, tôi thực sự bị thu hút bởi phương pháp này đã được giới thiệu cho tôi. Người đại diện mà tôi đã nói chuyện đã thuyết phục tôi dùng thử nó (140).” Ông Zhang được biết rằng VOC sử dụng nghiên cứu thị trường như một biện pháp hỗ trợ để thiết kế các quảng cáo được nhắm mục tiêu. Sử dụng phương pháp này, trước tiên, ông xác định chính xác (141) những gì khách hàng tiềm năng quan tâm và họ muốn gì khi mua sắm đồ dùng văn phòng. Sau đó, anh ấy sử dụng những câu trích dẫn thẳng thắn từ những người đã tham gia vào cuộc nghiên cứu thị trường của anh ấy để tạo quảng cáo cho trang web của anh ấy. Ông cũng sử dụng chúng trong các chiến dịch e-mail trực tiếp (142). “Cảm ơn VOC,” anh ấy mỉm cười nói, “cơ sở khách hàng của tôi đã mở rộng hơn bao giờ hết.”');
SET @group_id = LAST_INSERT_ID();
INSERT INTO exercise_questions (exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id, @group_id, 141, '(141)', 'exactly', 'exact', 'exacting', 'exactness', 'A', 'Giải thích: Chỗ trống cần điền đứng sau động từ ‘determined’ và đứng trước tân ngữ của động từ đó\n-> từ cần điền là một trạng từ\n-> đáp án đúng là A\nDịch: Sử dụng phương pháp này, trước tiên, ông xác định một cách chính xác những gì khách hàng tiềm năng quan tâm và họ muốn gì khi mua sắm đồ dùng văn phòng.\nTừ vựng:\nMethod (n): phương pháp\nDetermine (v): xác định\nConcern (v): quan tâm');

-- Group 7
INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, passage) VALUES (@exercise_id, 7, '', 'es only to products sold at Bethenie Industries stores and other licensed distributors. Products that are found to be defective may be shipped to our address for repair or exchange. Please note that products that are being returned because of damage should be shipped back to us, whenever possible, in their —– (138) packaging.\n\n---\n\nDịch nghĩa\n\nBethenie Industries đảm bảo rằng các sản phẩm của hãng sẽ hoạt động như được quảng cáo (135) trong ít nhất một năm kể từ ngày mua. Đối với một số sản phẩm nhất định, thời hạn này có thể được kéo dài (136). Bảo hành (137) này chỉ áp dụng cho các sản phẩm được bán tại các cửa hàng Bethenie Industries và các nhà phân phối được cấp phép khác. Các sản phẩm bị lỗi có thể được chuyển đến địa chỉ của chúng tôi để sửa chữa hoặc đổi hàng. Xin lưu ý rằng các sản phẩm đang được trả lại do bị hư hỏng nên được chuyển lại cho chúng tôi, bất cứ khi nào có thể, trong bao bì ban đầu (138) của chúng.');
SET @group_id = LAST_INSERT_ID();
INSERT INTO exercise_questions (exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id, @group_id, 138, '(138)', 'originally', 'original', 'origin', 'originality', 'B', 'Giải thích: Chỗ trống cần điền đứng trước danh từ ‘packaging’ và sau đại từ sở hữu ‘their’\n-> từ cần điền là một tính từ bổ nghĩa cho danh từ theo sau nó\n-> đáp án đúng là B\nDịch: Xin lưu ý rằng các sản phẩm đang được trả lại do bị hư hỏng nên được chuyển lại cho chúng tôi, bất cứ khi nào có thể, trong bao bì ban đầu của chúng.\nTừ vựng:\nReturn (v): trả lại\nDamage (n): hư hại\nPackaging (n): bao bì');

-- Group 8
INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, passage) VALUES (@exercise_id, 8, '', 'Bethenie Industries guarantees that its products will function as —– (135) for at least one year from date of purchase. —– (136). This —– (137) applies only to products sold at Bethenie Industries stores and other licensed distributors. Products that are found to be defective may be shipped to our address for repair or exchange. Please note that products that are being returned because of damage should be shipped back to us, whenever possible, in their —– (138) packaging.\n\n---\n\nDịch nghĩa\n\nBethenie Industries đảm bảo rằng các sản phẩm của hãng sẽ hoạt động như được quảng cáo (135) trong ít nhất một năm kể từ ngày mua. Đối với một số sản phẩm nhất định, thời hạn này có thể được kéo dài (136). Bảo hành (137) này chỉ áp dụng cho các sản phẩm được bán tại các cửa hàng Bethenie Industries và các nhà phân phối được cấp phép khác. Các sản phẩm bị lỗi có thể được chuyển đến địa chỉ của chúng tôi để sửa chữa hoặc đổi hàng. Xin lưu ý rằng các sản phẩm đang được trả lại do bị hư hỏng nên được chuyển lại cho chúng tôi, bất cứ khi nào có thể, trong bao bì ban đầu (138) của chúng.');
SET @group_id = LAST_INSERT_ID();
INSERT INTO exercise_questions (exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id, @group_id, 135, '(135)', 'advertising', 'advertised', 'advertisement', 'advertises', 'B', 'Giải thích:  chỗ trống cần điền đứng sau ‘as’ để tạo thành cụm bổ nghĩa cho động từ ‘function’ đứng trước => cần điền một danh từ hoặc phân từ quá khứ (diễn tả nghĩa bị động)\n=> loại (D) (vì là động từ đã chia số ít của advertise). Ta xét từng đáp án còn lại:\nC. advertisement trong trường hợp này là một danh từ đếm được, cần phải có từ hạn định đi kèm phía trước (VD: as a advertisement) nhưng trong câu lại không có => loại\nA. advertising nếu xét theo dạng danh từ (ngành quảng cáo) thì đưa vào câu không phù hợp (dịch: sản phẩm hoạt động như ngành quảng cáo). Nếu xét theo dạng Ving thì không phù hợp về ngữ pháp vì đây là phân từ hiện tại, diễn tả nghĩa chủ động.\n=> B. advertised. phù hợp với cấu trúc: as + VPII (quá khứ phân từ – dạng bị động của động từ) diễn tả một điều gì đó xảy ra theo cách đã được mô tả hoặc mong đợi trước đó. (VD: as mentioned, as discussed, as expected…)\nDịch: Bethenie Industries đảm bảo rằng các sản phẩm của hãng sẽ hoạt động như được quảng cáo trong ít nhất một năm kể từ ngày mua.\nTừ vựng:\nFunction (v): hoạt động\nGuarantee (v): đảm bảo');

-- Group 9
INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, passage) VALUES (@exercise_id, 9, '', 'Jamaica National Tourist Organization Offers Free Cultural Passes\nThe Jamaica National Tourist Organization (JAMTO) announces an exciting new program that provides free entry to a variety of cultural attractions. The program is sponsored by the JAMTO —– (143) the hotels and businesses listed on the back of this flyer. Together, we —– (144) you to take advantage of some of the finest cultural and educational experiences that Jamaica has to offer. —– (145) attractions include the Caribbean National Gardens, Montego Bay Potters Gallery, Jamaican Music Experience, and many others.\nTo obtain your pass, visit our Web site at www.jamto.org/freepass or stop by any JAMTO office. One pass is valid for up to five people. —– (146)\n\n---\n\nDịch nghĩa\n\nTổ chức du lịch quốc gia Jamaica cung cấp thẻ văn hóa miễn phí\n\nTổ chức Du lịch Quốc gia Jamaica (JAMTO) công bố một chương trình mới thú vị cho phép vào cửa miễn phí một loạt các điểm tham quan văn hóa. Chương trình được tài trợ bởi JAMTO cùng với (143) khách sạn và doanh nghiệp được liệt kê ở mặt sau của tờ rơi này. Cùng nhau mời (144) chúng tôi, bạn tận dụng một số trải nghiệm văn hóa và giáo dục tốt nhất mà Jamaica đã cung cấp. Tham gia (145) điểm tham quan bao gồm Vườn Quốc gia Caribe, Phòng trưng bày Montego Bay Potters, Trải nghiệm Âm nhạc Jamaica, và nhiều điểm khác.\n\nĐể lấy thẻ của bạn, hãy truy cập trang Web của chúng tôi tại www.jamto.org/freepass hoặc ghé qua bất kỳ văn phòng JAMTO nào. Một thẻ có giá trị cho tối đa năm người. Nó có thể được sử dụng trong ba ngày. (146)');
SET @group_id = LAST_INSERT_ID();
INSERT INTO exercise_questions (exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id, @group_id, 144, '(144)', 'invite', 'invited', 'may invite', 'were inviting', 'A', 'Giải thích: Chỗ trống cần điền đứng sau chủ ngữ chính của câu ‘we’ và theo sau nó là đại từ tân ngữ ‘you’ -> từ cần điền là động từ\nDựa vào bối cảnh của email, ta thấy người viết đang đề cập đến hiện tại\n-> động từ của câu sẽ chia ở thì hiện tại\n-> đáp án đúng là A\nDịch: Cùng nhau, chúng tôi mời bạn tận dụng một số trải nghiệm văn hóa và giáo dục tốt nhất mà Jamaica đã cung cấp.\nTừ vựng:\nTake advantage of: nắm bắt lợi thế\nOffer (v): cung cấp');

-- Group 10
INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, passage) VALUES (@exercise_id, 10, '', 'Healthy Foods Market has planned some exciting renovations in the coming weeks. During this time the store will remain open, but certain departments will be temporarily unavailable. Beginning on August 3, the refrigerated and frozen-food sections of the store —— (139) to be under construction.—– (140), food from these areas will be unavailable while work is being completed. Remodeling should be finished by August 9. Store managers are confident that the —– (141) days of inconvenience will be well worth it.\n—– (142). At this event, there will be complimentary samples of some new food choices, including an expanded selection of nutritious, ready-to-eat lunch and dinner meals.\n\n---\n\nDịch nghĩa\n\nHealthy Foods Market đã lên kế hoạch cho một số cải tạo thú vị trong những tuần tới. Trong thời gian này, cửa hàng sẽ vẫn mở cửa, nhưng một số phòng ban sẽ tạm thời không hoạt động. Bắt đầu từ ngày 3 tháng 8, các bộ phận làm lạnh và thực phẩm đông lạnh của cửa hàng nằm trong lịch (139) xây dựng. Do đó (140), thực phẩm từ những khu vực này sẽ không có sẵn trong khi công việc đang được hoàn thành. Việc tu sửa sẽ hoàn thành trước ngày 9 tháng 8. Các quản lý cửa hàng tin rằng vài (141) ngày bất tiện sẽ rất xứng đáng.\n\nMột lễ kỷ niệm đặc biệt sẽ diễn ra vào ngày 12 tháng 8 (142). Tại sự kiện này, sẽ có các mẫu miễn phí của một số lựa chọn thực phẩm mới, bao gồm nhiều lựa chọn các bữa trưa và tối bổ dưỡng, ăn liền.');
SET @group_id = LAST_INSERT_ID();
INSERT INTO exercise_questions (exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id, @group_id, 139, '(139)', 'schedules', 'to be scheduled', 'scheduling', 'are scheduled', 'D', 'Giải thích: Chỗ trống cần điền đứng sau cụm danh từ làm chủ ngữ của câu ‘the refrigerated and frozen-food sections of the store’ -> từ cần điền đóng vai trò là động từ chính của câu -> loại đáp án B và C\nVì chủ ngữ chính của câu ở dạng số nhiều -> động từ cần chia ở dạng số nhiều\n-> đáp án đúng là D\nDịch: Bắt đầu từ ngày 03/08, các khu vực làm lạnh và thực phẩm động lạnh của cửa hàng sẽ dự kiến được xây dựng\nTừ vựng:\nSection (n): khu vực\nConstruction (n): sự xây dựng');

-- Group 11
INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, passage) VALUES (@exercise_id, 11, '', 'Position: Gold & Slide Accounting Firm\nWe are looking for enthusiastic candidates with an educational background in finance or _____(139). All candidates should have some computer experience. Job experience is not _____(140) but preferred. Candidates with a bilingual language ability _____(141) favored. Positions include jobs in accounting, statistics, and general office assistant. If you are interested, please visit our website at www.G&Saccountingfirm.com/employment for more information. You can send your cover letters and resumes to Karen Hill at khill@G&S.com. We will begin interviewing candidates on Monday, November 5. _____(142).\n\n---\n\nDịch nghĩa\n\nVị trí: Văn phòng Kế toán Gold & Slide\n\nChúng tôi đang tìm kiếm những ứng viên nhiệt huyết với nền tảng học vấn ngành tài chính hay kế toán. Tất cả những ứng viên nên có một chút kinh nghiệm máy tính. Kinh nghiệm làm việc thì không cần thiết nhưng nếu có thì vẫn tốt hơn. Những ứng viên có khả năng song ngữ sẽ được ưu tiên. Các vị trí bao gồm công việc kế toán, thống kê, và trợ lý văn phòng. Nếu bạn quan tâm, xin vui lòng đến trang web của chúng tôi tại địa chỉ www.G&Saccountingfirm.com/employment để biết thêm thông tin. Bạn có thể gửi đơn xin việc và sơ yếu lý lịch đến cho Karen Hill tại địa chỉ e-mail khill@G&S.com. Chúng tôi sẽ bắt đầu phỏng vấn các ứng viên vào thứ Hai, ngày 5 tháng 11. Các vị trí công việc này sẽ bắt đầu vào tháng tiếp theo.');
SET @group_id = LAST_INSERT_ID();
INSERT INTO exercise_questions (exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id, @group_id, 139, '(139)', 'account', 'accountant', 'accounting', 'accounted', 'C', 'Đây là câu hỏi về từ loại, từ cần điền cùng dạng với ‘finance’ là ngành tài chính, nên điền ‘accounting’ là ngành kế toán. Các danh từ A là tài khoản, B là người kế toán. Do đó chọn C.');

-- Group 12
INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, passage) VALUES (@exercise_id, 12, '', 'Pizza Chef Wanted\nPapa Gino’s is hiring, and all _____(139) applicants will be considered. _____(140). Even if you have no experience, training will be provided if you meet our requirements. To meet our requirements, you must have a _____(141) health card, reliable transportation, and be able to work evenings and weekends. Please apply in person at Papa Gino’s on State and Pine. _____(142) look forward to meeting you.\n\n---\n\nDịch nghĩa\n\nCần tuyển đầu bếp pizza\n\nPapa Gino đang tuyển dụng, và tất cả những người nộp đơn đủ tiêu chuẩn đều sẽ được cân nhắc. Chúng tôi đang tìm những ứng viên có một ít kinh nghiệm về đồ ăn Ý. Ngay cả khi bạn không có kinh nghiệm, bạn sẽ được đào tạo nếu bạn thoả mãn các yêu cầu. Để thoả mãn các yêu cầu của chúng tôi, bạn phải có một thẻ thông tin sức khoẻ còn hiệu lực, phương tiện di chuyển ổn định, và có thể làm việc buổi tối và cuối tuần. Vui lòng ứng tuyển trực tiếp tại Papa Gino’s tại State and Pine. Chúng tôi mong chờ được gặp bạn.');
SET @group_id = LAST_INSERT_ID();
INSERT INTO exercise_questions (exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id, @group_id, 139, '(139)', 'qualify', 'qualification', 'qualified', 'to qualify', 'C', 'Trong mệnh đề “all _____ applicants will be considered” có chủ ngữ là cụm danh từ “all _____ applicants”. Trong cụm danh từ này, danh từ chính của cụm là “applicants”, vì vậy chỗ trống cần điền một từ bổ nghĩa cho danh từ chính này => tính từ “qualified” (đủ điều kiện) là phù hợp nhất.\n=> Chọn C');

-- Group 13
INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, passage) VALUES (@exercise_id, 13, '', '(139)\nCitrusine: Total Flu for Night-time\nGet ready for cold and flu season with Citrusine. Citrusine is a _____(135) medicated night-time tea that can treat symptoms of the flu including fever, aches and pains, nasal congestion, cough, and sore throat. Wake up feeling _____(136) and ready to conquer another day. Citrusine should not be taken if you’re planning to operate machinery or drive a vehicle. Keep out of the reach of children. _____(137).\nCitrusine is the number-one-selling medication _____(138) the flu and is guaranteed to provide results if taken as directed. Visit our website for more information.\nwww.citrusine.com\n\n---\n\nDịch nghĩa\n\nCitrusine: Total Flu cho ban đêm\n\nHãy chuẩn bị sẵn sàng cho mùa cảm cúm với Citrusine. Citrusine là một loại trà dược liệu dùng ban đêm dịu nhẹ có thể trị các triệu chứng của cúm, bao gồm sốt, đau nhức, nghẹt mũi, ho, và rát cổ họng. Hãy ngủ dậy và cảm thấy tươi mới và sẵn sàng chinh phục một ngày mới. Citrusine không nên được dùng nếu bạn đang dự định sẽ vận hành máy móc hoặc lái xe. Để xa tầm tay trẻ em. Và nếu các triệu chứng kéo dài hơn 10 ngày, hãy nhờ bác sĩ tư vấn.\n\nCitrusine là dược phẩm dành cho cảm cúm bán chạy số 1 và đảm bảo mang lại hiệu quả nếu được dùng theo chỉ dẫn. Vào trang web của chúng tôi để biết thêm thông tin.\n\nwww.citrusine.com');
SET @group_id = LAST_INSERT_ID();
INSERT INTO exercise_questions (exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id, @group_id, 136, '(136)', 'refreshing', 'refreshed', 'refreshes', 'refresh', 'B', 'Chỗ trống sau động từ “feel” => cần chọn tính từ => loại C và D. Còn lại “refreshing” và “refreshed”, vì động từ V-ing và V3/V-ed có khả năng làm tính từ. Các tính từ đuôi -ed (refreshed) thường được dùng diễn tả trạng thái của sự vật/con người, trong khi các tính từ đuôi -ing (refreshing) thường dùng để diễn tả tính chất của sự vật/con người. Dựa vào nghĩa của câu, ta chọn “refreshed”: cảm thấy được làm tươi mới = cảm thấy tươi mới.\n=> Chọn B');

-- Group 14
INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, passage) VALUES (@exercise_id, 14, '', 'Black Hill Beans\nBlack Hill Beans is a Louisianan coffee company and the pioneer of the Louisiana coffee fruit. We oversee a vertically _____(143) supply chain that starts with the highest quality coffee and coffee fruit from Black Hill, Louisiana. We _____(144) three award-winning beans, Summer Harvest, Dark Southern, and Black Earth. All can be shipped to you _____(145) 24 hours anywhere in the continental U.S. Black Hill Beans’ coffee is also sold at every Launders Superstore in the U.S.\nWhether you’re looking for excellent coffee or a bit of southern comfort, Black Hill Beans is the right choice for your coffee. _____(146). It’s nice to feel patriotic while you drink. Visit us online today to hear more about our story.\nwww.blackhillbeans.com\n\n---\n\nDịch nghĩa\n\nBlack Hill Beans\n\nHạt cà phê Black Hill là một công ty cà phê ở Louisiana và là người tiên phong về quả cà phê Louisiana. Chúng tôi giám sát một chuỗi cung ứng tích hợp theo chiều dọc bắt đầu với cà phê và quả cà phê chất lượng cao nhất từ Black Hill, Louisiana. Chúng tôi sản xuất 3 loại hạt đạt giải thưởng, Summer Harvest, Dark Southern, và Black Earth. Tất cả đều có thể được giao đến bạn trong vòng 24 giờ bất kỳ ở đâu trong Hoa Kỳ lục địa (các bang trong lục địa). Cà phê của Black Hill Beans cũng được bán ở tất cả các siêu cửa hàng Launders Superstore ở Hoa Kỳ.\n\nDù bạn đang tìm kiếm cà phê hảo hạng hay một chút sự dễ chịu phương nam, Black Hill là lựa chọn cà phê đúng đắn của bạn. Nó được làm ra ở Mỹ và là thực phẩm hữu cơ. Vừa uống vừa cảm thấy tinh thần yêu nước thì thật tuyệt. Hãy ghé thăm chúng tôi trực tuyến để tìm hiểu nhiều hơn về câu chuyện của chúng tôi.\n\nwww.blackhillbeans.com');
SET @group_id = LAST_INSERT_ID();
INSERT INTO exercise_questions (exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id, @group_id, 143, '(143)', 'integrates', 'to integrate', 'integrated', 'integration', 'C', 'Sau chỗ trống là cụm danh từ “supply chain” và trước chỗ trống là trạng từ “vertically” –> cần điền tính từ, để bổ nghĩa cho cụm danh từ đứng sau nó, và được bổ nghĩa bởi trạng từ đứng trước nó. Động từ dạng V3/V-ed có thể đóng vai trò như một tính từ –> chọn “integrated”.\n=> Chọn C');

-- Group 15
INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, passage) VALUES (@exercise_id, 15, '', 'Come visit Wild Water Parks, your summer destination for family and friends of all ages. We have kiddie pools, we have outdoor pools, we have indoor pools, we have waves, and we have _____(131) water slides, including our Death Fall, the largest slide in the state. We have everything for everyone in _____(132) group. Don’t forget our delicious snack stands and restaurants. We also have gift shops and playgrounds. _____(133). You can get tickets by calling 123-5555 or a season’s pass for a _____(134) of the price. Call now and experience the fun!\n\n---\n\nDịch nghĩa\n\nHãy đến thăm công viên nước Wild Water Parks, điểm đến mùa hè dành cho gia đình và bạn bè thuộc mọi lứa tuổi. Chúng tôi có hồ bơi trẻ em, chúng tôi có hồ bơi ngoài trời, chúng tôi có hồ bơi trong nhà, chúng tôi có sóng biển, và chúng tôi có ống trượt nước thú vị, bao gồm Death Fall, ống trượt lớn nhất trong bang. Chúng tôi có tất cả mọi thứ cho mọi người trong nhóm của bạn. Đừng quên những quầy đồ ăn nhẹ và nhà hàng ngon miệng của chúng tôi. Chúng tôi cũng có những cửa hàng bán quà tặng và sân chơi. Chúng tôi thậm chí còn có cả công viên chó dành cho người bạn đồng hành đầy lông của bạn. Bạn có thể mua vé bằng cách gọi số 123-5555 hoặc mua giấy vào cửa cho cả mùa với một phần nhỏ của giá tiền. Hãy gọi cho chúng tôi ngay bây giờ và có những trải nghiệm thú vị.');
SET @group_id = LAST_INSERT_ID();
INSERT INTO exercise_questions (exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id, @group_id, 131, '(131)', 'excite', 'excited', 'exciting', 'excitement', 'C', 'Giải thích: Chúng ta cần chọn tính từ để bổ nghĩa cho “water slides” –> “excited” hoặc “exciting”. Các tính từ đuôi -ed (excited) thường được dùng diễn tả trạng thái của sự vật/con người, trong khi các tính từ đuôi -ing (exciting) thường dùng để diễn tả tính chất của sự vật/con người. Dựa vào ngữ cảnh, ta chọn “exciting”.\n=> Chọn C');

-- Group 16
INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, passage) VALUES (@exercise_id, 16, '', 'Date: June 21\nTo: Mike Harris\nFrom: Rhonda Cross\nSubject: RE: Landscaping and Maintenance\nThank you for your _____(135) about our services. Arbor Care is a green lawn care and landscaping business. We only use environmentally friendly techniques and products when caring for the grounds of any business. We’ve been working in the Portland area for _____(136) 20 years. Currently, we are serving more than 150 businesses in the downtown area.\nAs to your specific request, yes, we can easily remove dead trees and replace them with something that fits the _____(137) landscaping. To give you an exact quote, we would need to stop by and assess the situation in person. To have one of our garden technicians stop by, please call us at (713)678-9916. _____(138).\n\n---\n\nDịch nghĩa\n\nNgày: 21 tháng 6\nTới: Mike Harris\nTừ: Rhonda Cross\nChủ đề: Trả lời: Làm cảnh quan vườn và Duy trì\n\nCảm ơn câu hỏi của bạn về những dịch vụ của chúng tôi. Arbor Care là một doanh nghiệp chăm sóc thảm cỏ xanh và làm cảnh quan vườn. Chúng tôi chỉ sử dụng những kỹ thuật và sản phẩm thân thiện với môi trường khi chăm sóc cho đất nền của bất kỳ doanh nghiệp nào. Chúng tôi đã làm việc ở khu vực Portland trong hơn 20 năm. Hiện tại, chúng tôi đang phục vụ cho hơn 150 doanh nghiệp trong khu vực trung tâm thành phố.\n\nĐể trả lời yêu cầu cụ thể của bạn, vâng, chúng tôi có thể dễ dàng loại bỏ cây chết và thay thế chúng bằng cái gì đó phù hợp với cảnh quan hiện hữu. Để báo giá chính xác, chúng tôi sẽ cần trực tiếp ghé qua và đánh giá tình trạng hiện tại. Để yêu cầu một trong số những kỹ thuật viên làm vườn ghé qua, vui lòng gọi cho chúng tôi đến số (713)678-9916. Chúng tôi hy vọng bạn liên lạc sớm.');
SET @group_id = LAST_INSERT_ID();
INSERT INTO exercise_questions (exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id, @group_id, 137, '(137)', 'exist', 'existed', 'existing', 'exists', 'C', 'Chỗ trống nằm sau một mạo từ (the) và trước một danh từ (landscaping), nên nó phải là một từ có thể bổ nghĩa cho danh từ => “existed” hoặc “existing”. Các tính từ đuôi -ed (existed) thường được dùng diễn tả trạng thái của sự vật/con người, trong khi các tính từ đuôi -ing (existing) thường dùng để diễn tả tính chất của sự vật/con người. Dựa vào nghĩa, chọn “existing”.\n=> Chọn C');

-- Group 17
INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, passage) VALUES (@exercise_id, 17, '', '\n\n---\n\nDịch nghĩa\n\nDịch vụ Green Clean Hãy gọi cho chúng tôi: 347-281-7834\n\n________ Từ năm 2005, Green Clean đã cung cấp các dịch vụ vệ sinh chuyên nghiệp và thân thiện với môi trường có chất lượng cao đều đặn cho tất cả các cơ sở thương mại và công nghiệp. ________ Chúng tôi hiểu rõ sự đóng góp mà một nhân viên giỏi mang lại cho ________ chúng tôi, và chúng tôi cam kết lựa chọn những người giỏi nhất để làm việc cho bạn.\n\nSứ mệnh của Green Clean là làm hài lòng nhu cầu của khách hàng hàng ngày trong khi cung cấp sự kết hợp tốt nhất về chất lượng, giá cả và giao hàng. Chúng tôi thực hiện điều này bằng cách liên tục cải thiện các hệ thống ________ của chúng tôi. Mục tiêu của chúng tôi là làm cho cơ sở của bạn sạch sẽ tối đa theo cách thân thiện với môi trường nhất có thể. Hãy truy cập website của chúng tôi ngay hôm nay tại www.greenclean.com.');
SET @group_id = LAST_INSERT_ID();
INSERT INTO exercise_questions (exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id, @group_id, 138, '(138)', 'to operate', 'operates', 'operated', 'operation', 'D', 'Bốn phương án đều chung gốc từ, chỉ khác từ loại: A, B và C đều là động từ, chỉ có D là danh từ. Xét câu: We accomplish this by continually improving our systems of ___ => chỗ trống phải là một danh từ.\n=> Chọn D\nDịch: Chúng tôi thực hiện điều này bằng cách liên tục cải thiện hệ thống hoạt động.');

-- Group 18
INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, passage) VALUES (@exercise_id, 18, '', 'COPENHAGEN (25 May)-Odense Media announced today that initial sales of the latest version of its tablet, Virtusonic, have —–(131) the company’s expectations. Company spokesperson Kerstin Vestergaard attributes the —— (132) sales to a number of factors. First, there is the tablet’s high quality case. —– (133). In addition, the Virtusonic has an adaptive screen brightness feature. This allows it to adjust automatically to less-than-ideal —– (134) conditions. Vestergaard believes that these characteristics make the Virtusonic a must-have for consumers.\n\n---\n\nDịch nghĩa\n\nCOPENHAGEN (25 tháng 5) – Odense Media đã công bố hôm nay rằng doanh số ban đầu của phiên bản mới nhất của máy tính bảng, Virtusonic, đã vượt qua (131) kỳ vọng của công ty. Người phát ngôn của công ty Kerstin Vestergaard cho rằng doanh số bán hàng ấn tượng (132) là do một số yếu tố. Đầu tiên, đó là vỏ chất lượng cao của máy tính bảng. Vỏ bảo vệ đảm bảo độ bền của thiết bị (133). Ngoài ra, Virtusonic có tính năng thích ứng độ sáng màn hình. Điều này cho phép nó tự động điều chỉnh theo các điều kiện ánh sáng kém hơn lý tưởng (134). Vestergaard tin rằng những đặc điểm này khiến Virtusonic trở thành sản phẩm bắt buộc phải có đối với người tiêu dùng.');
SET @group_id = LAST_INSERT_ID();
INSERT INTO exercise_questions (exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id, @group_id, 132, '(132)', 'impress', 'impressing', 'impressive', 'impressed', 'C', 'Đây là câu hỏi điền từ loại, ‘sales’ là danh từ nên phía trước thiếu một tính từ, đáp án đúng là C.');

-- Group 19
INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, passage) VALUES (@exercise_id, 19, '', 'Morlon Home Goods Set to Open\nTISDALE (2 April) Morlon Home Goods will open this Friday in a 130 square meter space on Waverly Road that was formerly —– (143) by Binkleys Market. The store features home decor items, such as lamps, wall art, and small furniture from around the globe, all at affordable prices. “Morlon has a great variety of attractive items for the modern home. Our inventory changes —– (144). Patrons like to stop in often to see what is new,” said Naoko Sasaki, the chain’s marketing director. This is the first Morlon in the local area. —– (145). A grand opening —– (146) featuring free food, giveaways, and discount coupons will be held on Saturday, 13 April from 10:00 A.M. to 6:00 P.M.\n\n---\n\nDịch nghĩa\n\nMorlon Home Goods sắp mở\n\nTISDALE (2 tháng 4) Morlon Home Goods sẽ khai trương vào thứ Sáu tuần này trong một không gian rộng 130 mét vuông trên Đường Waverly mà trước đây đã bị chiếm giữ bởi Chợ Binkleys (143). Cửa hàng có các mặt hàng trang trí nhà cửa, chẳng hạn như đèn, nghệ thuật treo tường và đồ nội thất nhỏ từ khắp nơi trên thế giới, tất cả đều có giá cả phải chăng. “Morlon có rất nhiều mặt hàng hấp dẫn cho ngôi nhà hiện đại. Hàng tồn kho của chúng tôi thay đổi thường xuyên (144). Khách hàng quen muốn ghé lại thường xuyên để xem có gì mới, ”Naoko Sasaki, giám đốc tiếp thị của chuỗi cho biết. Đây là Morlon đầu tiên trong khu vực địa phương. Công ty có mười bốn cửa hàng khác trên khắp đất nước (145). Một lễ kỷ niệm khai trương (146) bao gồm đồ ăn miễn phí, quà tặng và phiếu giảm giá sẽ được tổ chức vào Thứ Bảy, ngày 13 tháng 4 từ 10:00 sáng. đến 6:00 chiều.');
SET @group_id = LAST_INSERT_ID();
INSERT INTO exercise_questions (exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id, @group_id, 143, '(143)', 'occupation', 'occupied', 'occupy', 'occupying', 'B', 'Đây là dạng câu hỏi từ loại. Ta thấy cấu trúc ‘was formerly….’ là thể bị động, nên phần thiếu cần điền là 1 động từ ở dạng V3/ed. Đáp án đúng là B.');

-- Group 20
INSERT INTO exercise_question_groups (exercise_id, order_index, audio_url, passage) VALUES (@exercise_id, 20, '', '9 October\nEva Archer, Owner\nArcher Café\n40 Thorpe Street\nPort Fairy VIC 3284\nDear Ms. Archer:\nAn inspection of your restaurant was conducted on 16 September by —– （131）of the Department of Health and Safety. —– (132). The purpose of the inspection was to confirm that your business is in compliance with all local regulations and that all —– (133) permits are up-to-date. The Department has determined that all regulations are being followed —– (134). Therefore, no further action is required on your part.\nSincerely,\nOliver Wu\nDepartment of Health and Safety\n\n---\n\nDịch nghĩa\n\nNgày 9 tháng 10\n\nEva Archer, Chủ sở hữu\n\nArcher Café\n\n40 Phố Thorpe\n\nPort Fairy VIC 3284\n\nCô Archer thân mến:\n\nMột cuộc kiểm tra nhà hàng của bạn đã được tiến hành vào ngày 16 tháng 9 bởi các đại diện (131) của Phòng Sức khỏe và An toàn. Những cuộc kiểm tra như vậy được tiến hành mỗi năm một lần (132). Mục đích của cuộc kiểm tra là để xác nhận rằng doanh nghiệp của bạn tuân thủ tất cả các quy định địa phương và tất cả các giấy phép cần thiết (133) đều được cập nhật. Phòng đã xác định rằng tất cả các quy định đang được tuân thủ một cách thỏa đáng (134). Do đó, bạn không cần thực hiện thêm hành động nào.\n\nTrân trọng,\n\nOliver Wu\n\nBộ Y tế và An toàn');
SET @group_id = LAST_INSERT_ID();
INSERT INTO exercise_questions (exercise_id, group_id, question_number, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(@exercise_id, @group_id, 131, '(131)', 'represents', 'representative', 'representatives', 'representations', 'C', 'Chỗ trống trong bài là phần Object của câu bị động, nên chỗ còn thiếu là một danh từ chỉ người và phải ở dạng số nhiều, loại đáp án A và B. Đáp án ‘representations’ nghĩa là sự đại diện, nên chọn C. representatives .');


-- ==========================================
-- Original File: V27__practice_stats_schema.sql
-- ==========================================
-- =====================================================
-- V27__practice_stats_schema.sql
-- Thêm source_topic_id và các bảng cho Luyện tập tổng hợp
-- =====================================================

-- ===== 1. Thêm source_topic_id vào exercise_question_groups =====
-- Dùng cho grouped exercises (Part 1-4, 6-7)


-- ===== 2. Thêm source_topic_id vào exercise_questions =====
-- Dùng cho ungrouped exercises (Grammar, Part 5)


-- ===== 3. Bảng spaced repetition stats =====


-- ===== 4. Bảng practice sessions (cho biểu đồ tiến bộ) =====


-- Indexes








-- ==========================================
-- Original File: V28__add_base_entity_columns_to_practice_sessions.sql
-- ==========================================
-- =====================================================
-- V28__add_base_entity_columns_to_practice_sessions.sql
-- Thêm created_at và updated_at cho practice_sessions vì entity kế thừa BaseEntity
-- =====================================================





SET FOREIGN_KEY_CHECKS=1;
