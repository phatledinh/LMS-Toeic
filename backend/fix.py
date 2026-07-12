lines_to_add = [
"(2, 'Động từ nguyên mẫu', 'dong-tu-nguyen-mau', 'Cách sử dụng Bare Infinitive (Động từ nguyên mẫu không to).', 8, TRUE),\n",
"(2, 'Động từ nguyên mẫu có ''to''', 'dong-tu-nguyen-mau-co-to', 'Cách sử dụng To-Infinitive (Động từ nguyên mẫu có to).', 9, TRUE),\n",
"(2, 'Danh động từ', 'danh-dong-tu', 'Cách sử dụng Gerund (V-ing) trong các trường hợp cụ thể.', 10, TRUE),\n",
"(2, 'Phân từ và cấu trúc phân từ', 'phan-tu-va-cau-truc-phan-tu', 'Hiện tại phân từ (V-ing) và Quá khứ phân từ (V-ed/V3).', 11, TRUE),\n",
"(2, 'Trạng từ', 'trang-tu', 'Phân loại, vị trí và chức năng của trạng từ trong câu.', 12, TRUE),\n",
"(2, 'Giới từ', 'gioi-tu', 'Cách sử dụng giới từ chỉ thời gian, nơi chốn và các cụm giới từ.', 13, TRUE),\n",
"(2, 'Liên từ', 'lien-tu', 'Liên từ kết hợp, liên từ tương quan và liên từ phụ thuộc.', 14, TRUE),\n",
"(2, 'Mệnh đề quan hệ', 'menh-de-quan-he', 'Mệnh đề quan hệ xác định, không xác định và rút gọn mệnh đề quan hệ.', 15, TRUE),\n",
"(2, 'Câu điều kiện', 'cau-dieu-kien', 'Câu điều kiện loại 1, 2, 3 và câu điều kiện hỗn hợp.', 16, TRUE),\n",
"(2, 'Cấu trúc phân từ', 'cau-truc-phan-tu', 'Bài tập nâng cao và các dạng đặc biệt của cấu trúc phân từ.', 17, TRUE),\n",
"(2, 'Cấu trúc so sánh', 'cau-truc-so-sanh', 'So sánh bằng, so sánh hơn và so sánh nhất.', 18, TRUE);\n"
]

with open('c:\\Project\\LMS Toeic\\backend\\src\\main\\resources\\db\\migration\\V3__consolidated_course_data.sql', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if 'ALTER TABLE lessons ADD COLUMN slug VARCHAR(255) NOT NULL UNIQUE AFTER title;' in line:
        continue
    new_lines.append(line)
    if "(2, 'Thể', 'the', 'Thể chủ động và bị động (Active and Passive Voice).', 7, TRUE)," in line:
        new_lines.extend(lines_to_add)

with open('c:\\Project\\LMS Toeic\\backend\\src\\main\\resources\\db\\migration\\V3__consolidated_course_data.sql', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
