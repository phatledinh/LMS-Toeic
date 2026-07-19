-- =====================================================
-- V8__flashcard_schema.sql
-- Schema + dữ liệu mẫu cho module Flashcard
-- =====================================================

-- Bảng decks (bộ flashcard)
CREATE TABLE decks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    list_name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_type ENUM('SYSTEM', 'USER') NOT NULL DEFAULT 'SYSTEM',
    user_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng flashcards (thẻ từ vựng)
CREATE TABLE flashcards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    deck_id BIGINT NOT NULL,
    word VARCHAR(255) NOT NULL,
    phonetic VARCHAR(100),
    part_of_speech VARCHAR(20),
    meaning_vi TEXT NOT NULL,
    meaning_en TEXT,
    examples JSON,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng theo dõi tiến độ học
CREATE TABLE user_flashcard_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    flashcard_id BIGINT NOT NULL,
    difficulty ENUM('EASY', 'MEDIUM', 'HARD', 'SKIP') NULL,
    review_count INT DEFAULT 0,
    next_review_at TIMESTAMP NULL,
    quiz_correct INT DEFAULT 0,
    quiz_wrong INT DEFAULT 0,
    last_practiced_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_flashcard (user_id, flashcard_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (flashcard_id) REFERENCES flashcards(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes
CREATE INDEX idx_decks_owner ON decks(owner_type);
CREATE INDEX idx_decks_user ON decks(user_id);
CREATE INDEX idx_flashcards_deck ON flashcards(deck_id);
CREATE INDEX idx_ufp_user ON user_flashcard_progress(user_id);

-- =====================================================
-- Dữ liệu mẫu: 3 bộ hệ thống, mỗi bộ 10 từ
-- =====================================================

-- List 1: Travel & Transportation
INSERT IGNORE INTO decks (list_name, description, owner_type) VALUES
('List 1', 'Từ vựng về Du lịch & Giao thông', 'SYSTEM');

SET @deck1 = LAST_INSERT_ID();

INSERT IGNORE INTO flashcards (deck_id, word, phonetic, part_of_speech, meaning_vi, meaning_en, examples) VALUES
(@deck1, 'subway',     '/ˈsʌbweɪ/',      '(n)', 'đường hầm, tàu điện ngầm', 'a tunnel under the road for people to walk through', '["He ran through the pedestrian subway.", "I don''t like to travel through the subway after dark."]'),
(@deck1, 'airport',    '/ˈeəpɔːrt/',      '(n)', 'sân bay', 'the place where you go to get on a plane', '["We arrived at the airport two hours early.", "The airport was crowded with travelers."]'),
(@deck1, 'brochure',   '/broʊˈʃʊr/',      '(n)', 'ấn phẩm quảng cáo', 'a small paper book that gives information about a product or service', '["Pick up a brochure at the front desk.", "The travel brochure showed beautiful beaches."]'),
(@deck1, 'rental',     '/ˈrentl/',         '(n)', 'sự cho thuê', 'the act of paying for the use of something', '["The rental car was waiting at the airport.", "Monthly rental costs have increased."]'),
(@deck1, 'luggage',    '/ˈlʌɡɪdʒ/',       '(n)', 'hành lý', 'bags and cases that you carry your clothes in when you go on a journey', '["Please collect your luggage from the carousel.", "She packed her luggage the night before."]'),
(@deck1, 'shipment',   '/ˈʃɪpmənt/',      '(n)', 'sự giao hàng', 'delivery of goods, e.g. carried by a large vehicle', '["The shipment will arrive next Monday.", "We received a large shipment of supplies."]'),
(@deck1, 'traveler',   '/ˈtrævələr/',      '(n)', 'khách du lịch', 'a tourist or adventurer who visits many countries', '["The traveler explored ancient ruins.", "Every traveler should carry a passport."]'),
(@deck1, 'itinerary',  '/aɪˈtɪnəreri/',    '(n)', 'lịch trình', 'a plan of a journey including the route and the places that you visit', '["Check the itinerary before departure.", "Our itinerary includes three cities."]'),
(@deck1, 'departure',  '/dɪˈpɑːrtʃər/',    '(n)', 'sự khởi hành', 'the act of leaving a place', '["The departure time is 8 AM.", "Delays affected all departure flights."]'),
(@deck1, 'destination','/ˌdestɪˈneɪʃn/',   '(n)', 'điểm đến', 'the place to which someone or something is going', '["We reached our destination by noon.", "Paris is a popular tourist destination."]');

-- List 2: Business & Finance
INSERT IGNORE INTO decks (list_name, description, owner_type) VALUES
('List 2', 'Từ vựng về Kinh doanh & Tài chính', 'SYSTEM');

SET @deck2 = LAST_INSERT_ID();

INSERT IGNORE INTO flashcards (deck_id, word, phonetic, part_of_speech, meaning_vi, meaning_en, examples) VALUES
(@deck2, 'contract',   '/ˈkɒntrækt/',     '(n)', 'hợp đồng', 'a written legal agreement between two people or businesses', '["Please sign the contract before Friday.", "The contract expires next month."]'),
(@deck2, 'invoice',    '/ˈɪnvɔɪs/',       '(n)', 'hóa đơn', 'a list of goods sent or services provided, with a statement of the sum due', '["Send the invoice to accounting.", "The invoice was paid on time."]'),
(@deck2, 'budget',     '/ˈbʌdʒɪt/',       '(n)', 'ngân sách', 'the amount of money available to spend on something', '["We need to stay within budget.", "The project budget was approved."]'),
(@deck2, 'deadline',   '/ˈdedlaɪn/',      '(n)', 'hạn chót', 'a time or day by which something must be done', '["The deadline is next Friday.", "Don''t miss the deadline for submission."]'),
(@deck2, 'profit',     '/ˈprɒfɪt/',       '(n)', 'lợi nhuận', 'money that is earned in trade or business after paying costs', '["The company made a huge profit.", "Net profit increased by 20%."]'),
(@deck2, 'revenue',    '/ˈrevənjuː/',     '(n)', 'doanh thu', 'the money that a government or company receives regularly', '["Annual revenue exceeded expectations.", "The revenue report is due tomorrow."]'),
(@deck2, 'warehouse',  '/ˈweəhaʊs/',      '(n)', 'nhà kho', 'a large building for storing goods', '["Goods are stored in the warehouse.", "The new warehouse is fully automated."]'),
(@deck2, 'inventory',  '/ˈɪnvəntɔːri/',   '(n)', 'hàng tồn kho', 'a complete list of items such as goods in stock', '["Check the inventory levels weekly.", "The inventory system needs updating."]'),
(@deck2, 'negotiate',  '/nɪˈɡoʊʃieɪt/',   '(v)', 'đàm phán', 'to discuss something in order to reach an agreement', '["We need to negotiate a better price.", "They negotiated the terms of the deal."]'),
(@deck2, 'merchandise','/ˈmɜːrtʃəndaɪz/', '(n)', 'hàng hóa', 'goods that are bought and sold', '["The store displays merchandise attractively.", "New merchandise arrives every week."]');

-- List 3: Office & Workplace
INSERT IGNORE INTO decks (list_name, description, owner_type) VALUES
('List 3', 'Từ vựng về Văn phòng & Nơi làm việc', 'SYSTEM');

SET @deck3 = LAST_INSERT_ID();

INSERT IGNORE INTO flashcards (deck_id, word, phonetic, part_of_speech, meaning_vi, meaning_en, examples) VALUES
(@deck3, 'colleague',    '/ˈkɒliːɡ/',        '(n)', 'đồng nghiệp', 'a person that you work with', '["My colleague helped with the report.", "She invited her colleagues to the party."]'),
(@deck3, 'supervisor',   '/ˈsuːpərvaɪzər/',   '(n)', 'người giám sát', 'a person who manages and directs workers', '["Report to your supervisor immediately.", "The supervisor approved the leave request."]'),
(@deck3, 'department',   '/dɪˈpɑːrtmənt/',    '(n)', 'phòng ban', 'a division of a large organization', '["She works in the marketing department.", "Each department has its own budget."]'),
(@deck3, 'conference',   '/ˈkɒnfərəns/',      '(n)', 'hội nghị', 'a large official meeting usually lasting several days', '["The annual conference is in June.", "She presented at the conference."]'),
(@deck3, 'schedule',     '/ˈʃedjuːl/',        '(n)', 'lịch trình', 'a plan that lists all the work to be done and when', '["Check the meeting schedule.", "The project is behind schedule."]'),
(@deck3, 'agenda',       '/əˈdʒendə/',        '(n)', 'chương trình nghị sự', 'a list of items to be discussed at a meeting', '["The first item on the agenda is budget.", "Please review the meeting agenda."]'),
(@deck3, 'appointment',  '/əˈpɔɪntmənt/',     '(n)', 'cuộc hẹn', 'a formal arrangement to meet someone at a particular time', '["I have an appointment at 3 PM.", "Please schedule an appointment."]'),
(@deck3, 'promotion',    '/prəˈmoʊʃn/',       '(n)', 'sự thăng chức', 'a move to a higher position or rank', '["She received a promotion last month.", "Hard work leads to promotion."]'),
(@deck3, 'resign',       '/rɪˈzaɪn/',         '(v)', 'từ chức', 'to give up a job or position by telling your employer', '["He decided to resign from the company.", "She resigned due to health issues."]'),
(@deck3, 'candidate',    '/ˈkændɪdət/',       '(n)', 'ứng cử viên', 'a person who applies for a job or is nominated for election', '["The candidate had impressive qualifications.", "We interviewed five candidates."]');
