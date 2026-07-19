// Mock API Service cho LMS Toeic Client (Generated from Flyway)

export const SERVER_URL = 'http://localhost:8080';
export const BASE_URL = `${SERVER_URL}/api/v1`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Có lỗi xảy ra');
  return data;
};

const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

const mockSections = [
  {
    "id": 1,
    "title": "Từ vựng TOEIC",
    "slug": "tu-vung-toeic",
    "description": "Tổng hợp từ vựng thường gặp trong bài thi TOEIC",
    "orderIndex": 1
  },
  {
    "id": 2,
    "title": "Ngữ pháp TOEIC",
    "slug": "ngu-phap-toeic",
    "description": "Hệ thống các chủ điểm ngữ pháp trọng tâm TOEIC",
    "orderIndex": 2
  },
  {
    "id": 3,
    "title": "Part 1: Photographs - Nghe tranh",
    "slug": "part-1-photographs-nghe-tranh",
    "description": "Luyện tập kỹ năng mô tả hình ảnh trong Part 1",
    "orderIndex": 3
  },
  {
    "id": 4,
    "title": "Part 2: Question - Response - Hỏi - đáp",
    "slug": "part-2-question-response-hoi-dap",
    "description": "Luyện tập trả lời các câu hỏi ngắn trong Part 2",
    "orderIndex": 4
  },
  {
    "id": 5,
    "title": "Part 3: Conversations - Nghe hiểu đối thoại",
    "slug": "part-3-conversations-nghe-hieu-doi-thoai",
    "description": "Luyện tập nghe hiểu các đoạn hội thoại trong Part 3",
    "orderIndex": 5
  },
  {
    "id": 6,
    "title": "Part 4: Talks - Nghe hiểu bài nói",
    "slug": "part-4-talks-nghe-hieu-bai-noi",
    "description": "Luyện tập nghe hiểu các bài nói ngắn trong Part 4",
    "orderIndex": 6
  },
  {
    "id": 7,
    "title": "Part 5: Incomplete Sentences - Điền từ vào câu",
    "slug": "part-5-incomplete-sentences-dien-tu-vao-cau",
    "description": "Luyện tập hoàn thành câu dựa trên ngữ pháp và từ vựng Part 5",
    "orderIndex": 7
  },
  {
    "id": 8,
    "title": "Part 6: Text Completion - Điền từ vào đoạn văn",
    "slug": "part-6-text-completion-dien-tu-vao-doan-van",
    "description": "Luyện tập hoàn thành đoạn văn Part 6",
    "orderIndex": 8
  },
  {
    "id": 9,
    "title": "Part 7: Reading Comprehension - Đọc hiểu văn bản",
    "slug": "part-7-reading-comprehension-doc-hieu-van-ban",
    "description": "Luyện kỹ năng đọc hiểu các văn bản khác nhau Part 7",
    "orderIndex": 9
  }
];

const mockTopics = [
  {
    "id": 1,
    "sectionId": 2,
    "title": "Kiến thức cơ bản 1: từ loại và cụm từ",
    "slug": "kien-thuc-co-ban-1-tu-loai-va-cum-tu",
    "description": "Các khái niệm cơ bản về từ loại và cách hình thành cụm từ.",
    "orderIndex": 1
  },
  {
    "id": 2,
    "sectionId": 2,
    "title": "Kiến thức cơ bản 2: mệnh đề và câu",
    "slug": "kien-thuc-co-ban-2-menh-de-va-cau",
    "description": "Cấu trúc mệnh đề và các loại câu cơ bản trong tiếng Anh.",
    "orderIndex": 2
  },
  {
    "id": 3,
    "sectionId": 2,
    "title": "Danh từ",
    "slug": "danh-tu",
    "description": "Phân loại, vị trí và chức năng của danh từ trong câu.",
    "orderIndex": 3
  },
  {
    "id": 4,
    "sectionId": 2,
    "title": "Đại từ",
    "slug": "dai-tu",
    "description": "Các loại đại từ nhân xưng, phản thân, chỉ định và cách sử dụng.",
    "orderIndex": 4
  },
  {
    "id": 5,
    "sectionId": 2,
    "title": "Tính từ",
    "slug": "tinh-tu",
    "description": "Vị trí, chức năng và trật tự của tính từ.",
    "orderIndex": 5
  },
  {
    "id": 6,
    "sectionId": 2,
    "title": "Thì",
    "slug": "thi",
    "description": "Tổng hợp các thì cơ bản và thường gặp nhất trong TOEIC.",
    "orderIndex": 6
  },
  {
    "id": 7,
    "sectionId": 2,
    "title": "Trạng từ",
    "slug": "trang-tu",
    "description": "Phân loại, vị trí và chức năng của trạng từ trong câu.",
    "orderIndex": 12
  },
  {
    "id": 8,
    "sectionId": 2,
    "title": "Giới từ",
    "slug": "gioi-tu",
    "description": "Cách sử dụng giới từ chỉ thời gian, nơi chốn và các cụm giới từ.",
    "orderIndex": 13
  },
  {
    "id": 9,
    "sectionId": 2,
    "title": "Liên từ",
    "slug": "lien-tu",
    "description": "Liên từ kết hợp, liên từ tương quan và liên từ phụ thuộc.",
    "orderIndex": 14
  },
  {
    "id": 10,
    "sectionId": 2,
    "title": "Mệnh đề quan hệ",
    "slug": "menh-de-quan-he",
    "description": "Mệnh đề quan hệ xác định, không xác định và rút gọn mệnh đề quan hệ.",
    "orderIndex": 15
  },
  {
    "id": 11,
    "sectionId": 2,
    "title": "Câu điều kiện",
    "slug": "cau-dieu-kien",
    "description": "Câu điều kiện loại 1, 2, 3 và câu điều kiện hỗn hợp.",
    "orderIndex": 16
  },
  {
    "id": 12,
    "sectionId": 2,
    "title": "Cấu trúc phân từ",
    "slug": "cau-truc-phan-tu",
    "description": "Bài tập nâng cao và các dạng đặc biệt của cấu trúc phân từ.",
    "orderIndex": 17
  },
  {
    "id": 13,
    "sectionId": 2,
    "title": "Cấu trúc so sánh",
    "slug": "cau-truc-so-sanh",
    "description": "So sánh bằng, so sánh hơn và so sánh nhất.",
    "orderIndex": 18
  },
  {
    "id": 14,
    "sectionId": 3,
    "title": "Tổng quan",
    "slug": "topic-tong-quan-part-1",
    "description": "Tổng quan",
    "orderIndex": 1
  },
  {
    "id": 15,
    "sectionId": 3,
    "title": "Tranh tả người",
    "slug": "topic-tranh-ta-nguoi-part-1",
    "description": "Tranh tả người",
    "orderIndex": 2
  },
  {
    "id": 16,
    "sectionId": 3,
    "title": "Tranh tả vật",
    "slug": "topic-tranh-ta-vat-part-1",
    "description": "Tranh tả vật",
    "orderIndex": 3
  },
  {
    "id": 17,
    "sectionId": 3,
    "title": "Tranh tả cả người và vật",
    "slug": "topic-tranh-ta-ca-nguoi-va-vat-part-1",
    "description": "Tranh tả cả người và vật",
    "orderIndex": 4
  },
  {
    "id": 18,
    "sectionId": 3,
    "title": "Luyện tập tổng hợp",
    "slug": "topic-luyen-tap-tong-hop-part-1",
    "description": "Luyện tập tổng hợp",
    "orderIndex": 5
  },
  {
    "id": 19,
    "sectionId": 4,
    "title": "Tổng quan",
    "slug": "topic-tong-quan-part-2",
    "description": "Tổng quan",
    "orderIndex": 1
  },
  {
    "id": 20,
    "sectionId": 4,
    "title": "Câu hỏi WHO",
    "slug": "topic-cau-hoi-who-part-2",
    "description": "Câu hỏi WHO",
    "orderIndex": 2
  },
  {
    "id": 21,
    "sectionId": 4,
    "title": "Câu hỏi WHAT",
    "slug": "topic-cau-hoi-what-part-2",
    "description": "Câu hỏi WHAT",
    "orderIndex": 3
  },
  {
    "id": 22,
    "sectionId": 4,
    "title": "Câu hỏi WHERE",
    "slug": "topic-cau-hoi-where-part-2",
    "description": "Câu hỏi WHERE",
    "orderIndex": 4
  },
  {
    "id": 23,
    "sectionId": 4,
    "title": "Câu hỏi WHEN",
    "slug": "topic-cau-hoi-when-part-2",
    "description": "Câu hỏi WHEN",
    "orderIndex": 5
  },
  {
    "id": 24,
    "sectionId": 4,
    "title": "Câu hỏi WHY",
    "slug": "topic-cau-hoi-why-part-2",
    "description": "Câu hỏi WHY",
    "orderIndex": 6
  },
  {
    "id": 25,
    "sectionId": 4,
    "title": "Câu hỏi HOW",
    "slug": "topic-cau-hoi-how-part-2",
    "description": "Câu hỏi HOW",
    "orderIndex": 7
  },
  {
    "id": 26,
    "sectionId": 4,
    "title": "Câu hỏi YES/NO",
    "slug": "topic-cau-hoi-yes-no-part-2",
    "description": "Câu hỏi YES/NO",
    "orderIndex": 8
  },
  {
    "id": 27,
    "sectionId": 4,
    "title": "Câu hỏi lựa chọn",
    "slug": "topic-cau-hoi-lua-chon-part-2",
    "description": "Câu hỏi lựa chọn",
    "orderIndex": 9
  },
  {
    "id": 28,
    "sectionId": 4,
    "title": "Câu hỏi đuôi",
    "slug": "topic-cau-hoi-duoi-part-2",
    "description": "Câu hỏi đuôi",
    "orderIndex": 10
  },
  {
    "id": 29,
    "sectionId": 4,
    "title": "Câu đề nghị, yêu cầu",
    "slug": "topic-cau-de-nghi-yeu-cau-part-2",
    "description": "Câu đề nghị, yêu cầu",
    "orderIndex": 11
  },
  {
    "id": 30,
    "sectionId": 4,
    "title": "Câu trần thuật",
    "slug": "topic-cau-tran-thuat-part-2",
    "description": "Câu trần thuật",
    "orderIndex": 12
  },
  {
    "id": 31,
    "sectionId": 4,
    "title": "Luyện tập tổng hợp",
    "slug": "topic-luyen-tap-tong-hop-part-2",
    "description": "Luyện tập tổng hợp",
    "orderIndex": 13
  },
  {
    "id": 32,
    "sectionId": 5,
    "title": "Tổng quan",
    "slug": "topic-tong-quan-part-3",
    "description": "Tổng quan",
    "orderIndex": 1
  },
  {
    "id": 33,
    "sectionId": 5,
    "title": "Câu hỏi về chủ đề, mục đích",
    "slug": "topic-cau-hoi-ve-chu-de-muc-dich-part-3",
    "description": "Câu hỏi về chủ đề, mục đích",
    "orderIndex": 2
  },
  {
    "id": 34,
    "sectionId": 5,
    "title": "Câu hỏi về địa điểm hội thoại",
    "slug": "topic-cau-hoi-ve-dia-diem-hoi-thoai-part-3",
    "description": "Câu hỏi về địa điểm hội thoại",
    "orderIndex": 3
  },
  {
    "id": 35,
    "sectionId": 5,
    "title": "Câu hỏi về danh tính người nói",
    "slug": "topic-cau-hoi-ve-danh-tinh-nguoi-noi-part-3",
    "description": "Câu hỏi về danh tính người nói",
    "orderIndex": 4
  },
  {
    "id": 36,
    "sectionId": 5,
    "title": "Câu hỏi về chi tiết cuộc hội thoại",
    "slug": "topic-cau-hoi-ve-chi-tiet-cuoc-hoi-thoai-part-3",
    "description": "Câu hỏi về chi tiết cuộc hội thoại",
    "orderIndex": 5
  },
  {
    "id": 37,
    "sectionId": 5,
    "title": "Câu hỏi về hành động tương lai",
    "slug": "topic-cau-hoi-ve-hanh-dong-tuong-lai-part-3",
    "description": "Câu hỏi về hành động tương lai",
    "orderIndex": 6
  },
  {
    "id": 38,
    "sectionId": 5,
    "title": "Câu hỏi về yêu cầu, gợi ý",
    "slug": "topic-cau-hoi-ve-yeu-cau-goi-y-part-3",
    "description": "Câu hỏi về yêu cầu, gợi ý",
    "orderIndex": 7
  },
  {
    "id": 39,
    "sectionId": 5,
    "title": "Câu hỏi về hàm ý câu nói",
    "slug": "topic-cau-hoi-ve-ham-y-cau-noi-part-3",
    "description": "Câu hỏi về hàm ý câu nói",
    "orderIndex": 8
  },
  {
    "id": 40,
    "sectionId": 5,
    "title": "Câu hỏi kết hợp bảng biểu",
    "slug": "topic-cau-hoi-ket-hop-bang-bieu-part-3",
    "description": "Câu hỏi kết hợp bảng biểu",
    "orderIndex": 9
  },
  {
    "id": 41,
    "sectionId": 5,
    "title": "Chủ đề các cuộc đối thoại",
    "slug": "topic-chu-de-cac-cuoc-doi-thoai-part-3",
    "description": "Chủ đề các cuộc đối thoại",
    "orderIndex": 10
  },
  {
    "id": 42,
    "sectionId": 5,
    "title": "Luyện tập tổng hợp",
    "slug": "topic-luyen-tap-tong-hop-part-3",
    "description": "Luyện tập tổng hợp",
    "orderIndex": 11
  },
  {
    "id": 43,
    "sectionId": 6,
    "title": "Part 4: Talks",
    "slug": "part-4-talks",
    "description": "Các bài học Part 4",
    "orderIndex": 1
  },
  {
    "id": 44,
    "sectionId": 7,
    "title": "Part 5: Incomplete Sentences",
    "slug": "part-5-incomplete-sentences",
    "description": "Các bài học Part 5",
    "orderIndex": 1
  },
  {
    "id": 45,
    "sectionId": 8,
    "title": "Part 6: Text Completion",
    "slug": "part-6-text-completion",
    "description": "Các bài học Part 6",
    "orderIndex": 1
  },
  {
    "id": 46,
    "sectionId": 9,
    "title": "Part 7: Reading Comprehension",
    "slug": "part-7-reading-comprehension",
    "description": "Các bài học Part 7",
    "orderIndex": 1
  },
  {
    "id": 47,
    "sectionId": 7,
    "title": "Tổng quan",
    "slug": "topic-tong-quan-part-5",
    "description": "Tổng quan",
    "orderIndex": 1
  },
  {
    "id": 48,
    "sectionId": 7,
    "title": "Câu hỏi từ loại",
    "slug": "topic-cau-hoi-tu-loai-part-5",
    "description": "Câu hỏi từ loại",
    "orderIndex": 2
  },
  {
    "id": 49,
    "sectionId": 7,
    "title": "Câu hỏi ngữ pháp",
    "slug": "topic-cau-hoi-ngu-phap-part-5",
    "description": "Câu hỏi ngữ pháp",
    "orderIndex": 3
  },
  {
    "id": 50,
    "sectionId": 7,
    "title": "Câu hỏi từ vựng",
    "slug": "topic-cau-hoi-tu-vung-part-5",
    "description": "Câu hỏi từ vựng",
    "orderIndex": 4
  },
  {
    "id": 51,
    "sectionId": 7,
    "title": "[Câu hỏi từ vựng] Danh từ",
    "slug": "topic-cau-hoi-tu-vung-danh-tu",
    "description": "[Câu hỏi từ vựng] Danh từ",
    "orderIndex": 5
  },
  {
    "id": 52,
    "sectionId": 7,
    "title": "[Câu hỏi từ vựng] Động từ",
    "slug": "topic-cau-hoi-tu-vung-dong-tu",
    "description": "[Câu hỏi từ vựng] Động từ",
    "orderIndex": 6
  },
  {
    "id": 53,
    "sectionId": 7,
    "title": "[Câu hỏi từ vựng] Tính từ",
    "slug": "topic-cau-hoi-tu-vung-tinh-tu",
    "description": "[Câu hỏi từ vựng] Tính từ",
    "orderIndex": 7
  },
  {
    "id": 54,
    "sectionId": 7,
    "title": "[Câu hỏi từ vựng] Trạng từ",
    "slug": "topic-cau-hoi-tu-vung-trang-tu",
    "description": "[Câu hỏi từ vựng] Trạng từ",
    "orderIndex": 8
  },
  {
    "id": 55,
    "sectionId": 7,
    "title": "[Câu hỏi từ loại] Danh từ",
    "slug": "topic-cau-hoi-tu-loai-danh-tu",
    "description": "[Câu hỏi từ loại] Danh từ",
    "orderIndex": 9
  },
  {
    "id": 56,
    "sectionId": 7,
    "title": "[Câu hỏi từ loại] Tính từ",
    "slug": "topic-cau-hoi-tu-loai-tinh-tu",
    "description": "[Câu hỏi từ loại] Tính từ",
    "orderIndex": 10
  },
  {
    "id": 57,
    "sectionId": 7,
    "title": "[Câu hỏi từ loại] Trạng từ",
    "slug": "topic-cau-hoi-tu-loai-trang-tu",
    "description": "[Câu hỏi từ loại] Trạng từ",
    "orderIndex": 11
  },
  {
    "id": 58,
    "sectionId": 7,
    "title": "[Câu hỏi từ loại] Động từ",
    "slug": "topic-cau-hoi-tu-loai-dong-tu",
    "description": "[Câu hỏi từ loại] Động từ",
    "orderIndex": 12
  },
  {
    "id": 59,
    "sectionId": 7,
    "title": "[Câu hỏi ngữ pháp] Đại từ",
    "slug": "topic-cau-hoi-ngu-phap-dai-tu",
    "description": "[Câu hỏi ngữ pháp] Đại từ",
    "orderIndex": 13
  },
  {
    "id": 60,
    "sectionId": 7,
    "title": "[Câu hỏi ngữ pháp] Thì của động từ",
    "slug": "topic-cau-hoi-ngu-phap-thi-dong-tu",
    "description": "[Câu hỏi ngữ pháp] Thì của động từ",
    "orderIndex": 14
  },
  {
    "id": 61,
    "sectionId": 7,
    "title": "[Câu hỏi ngữ pháp] Cấu trúc phân từ",
    "slug": "topic-cau-hoi-ngu-phap-cau-truc-phan-tu",
    "description": "[Câu hỏi ngữ pháp] Cấu trúc phân từ",
    "orderIndex": 16
  },
  {
    "id": 62,
    "sectionId": 7,
    "title": "[Câu hỏi ngữ pháp] Liên từ",
    "slug": "topic-cau-hoi-ngu-phap-lien-tu",
    "description": "[Câu hỏi ngữ pháp] Liên từ",
    "orderIndex": 20
  },
  {
    "id": 63,
    "sectionId": 7,
    "title": "[Câu hỏi ngữ pháp] Giới từ",
    "slug": "topic-cau-hoi-ngu-phap-gioi-tu",
    "description": "[Câu hỏi ngữ pháp] Giới từ",
    "orderIndex": 21
  },
  {
    "id": 64,
    "sectionId": 7,
    "title": "[Câu hỏi ngữ pháp] Câu cầu khiến",
    "slug": "topic-cau-hoi-ngu-phap-cau-cau-khien",
    "description": "[Câu hỏi ngữ pháp] Câu cầu khiến",
    "orderIndex": 22
  },
  {
    "id": 65,
    "sectionId": 7,
    "title": "[Câu hỏi ngữ pháp] Mệnh đề quan hệ",
    "slug": "topic-cau-hoi-ngu-phap-menh-de-quan-he",
    "description": "[Câu hỏi ngữ pháp] Mệnh đề quan hệ",
    "orderIndex": 23
  },
  {
    "id": 66,
    "sectionId": 7,
    "title": "[Câu hỏi ngữ pháp] Cấu trúc so sánh",
    "slug": "topic-cau-hoi-ngu-phap-cau-truc-so-sanh",
    "description": "[Câu hỏi ngữ pháp] Cấu trúc so sánh",
    "orderIndex": 24
  },
  {
    "id": 67,
    "sectionId": 7,
    "title": "Luyện tập tổng hợp",
    "slug": "topic-luyen-tap-tong-hop-part-5",
    "description": "Luyện tập tổng hợp",
    "orderIndex": 25
  },
  {
    "id": 68,
    "sectionId": 1,
    "title": "Tổng quan",
    "slug": "topic-part6-tong-quan",
    "description": "Tổng quan Part 6",
    "orderIndex": 1
  },
  {
    "id": 69,
    "sectionId": 1,
    "title": "Câu hỏi từ loại",
    "slug": "topic-part6-cau-hoi-tu-loai",
    "description": "Câu hỏi từ loại Part 6",
    "orderIndex": 2
  },
  {
    "id": 70,
    "sectionId": 1,
    "title": "Câu hỏi ngữ pháp",
    "slug": "topic-part6-cau-hoi-ngu-phap",
    "description": "Câu hỏi ngữ pháp Part 6",
    "orderIndex": 3
  },
  {
    "id": 71,
    "sectionId": 1,
    "title": "Câu hỏi từ vựng",
    "slug": "topic-part6-cau-hoi-tu-vung",
    "description": "Câu hỏi từ vựng Part 6",
    "orderIndex": 4
  },
  {
    "id": 72,
    "sectionId": 1,
    "title": "Câu hỏi điền câu vào đoạn văn",
    "slug": "topic-part6-dien-cau-vao-doan-van",
    "description": "Câu hỏi điền câu vào đoạn văn Part 6",
    "orderIndex": 5
  },
  {
    "id": 73,
    "sectionId": 1,
    "title": "Luyện tập theo hình thức văn bản",
    "slug": "topic-part6-luyen-tap-hinh-thuc-van-ban",
    "description": "Luyện tập theo hình thức văn bản Part 6",
    "orderIndex": 6
  },
  {
    "id": 74,
    "sectionId": 1,
    "title": "Luyện tập tổng hợp",
    "slug": "topic-part6-luyen-tap-tong-hop",
    "description": "Luyện tập tổng hợp Part 6",
    "orderIndex": 7
  },
  {
    "id": 75,
    "sectionId": 1,
    "title": "Tổng quan",
    "slug": "topic-part7-tong-quan",
    "description": "Tổng quan Part 7",
    "orderIndex": 1
  },
  {
    "id": 76,
    "sectionId": 1,
    "title": "Câu hỏi về chủ đề, mục đích",
    "slug": "topic-part7-cau-hoi-chu-de-muc-dich",
    "description": "Câu hỏi về chủ đề, mục đích Part 7",
    "orderIndex": 2
  },
  {
    "id": 77,
    "sectionId": 1,
    "title": "Câu hỏi tìm thông tin",
    "slug": "topic-part7-cau-hoi-tim-thong-tin",
    "description": "Câu hỏi tìm thông tin Part 7",
    "orderIndex": 3
  },
  {
    "id": 78,
    "sectionId": 1,
    "title": "Câu hỏi suy luận",
    "slug": "topic-part7-cau-hoi-suy-luan",
    "description": "Câu hỏi suy luận Part 7",
    "orderIndex": 4
  },
  {
    "id": 79,
    "sectionId": 1,
    "title": "Câu hỏi tìm từ đồng nghĩa",
    "slug": "topic-part7-cau-hoi-tim-tu-dong-nghia",
    "description": "Câu hỏi tìm từ đồng nghĩa Part 7",
    "orderIndex": 5
  },
  {
    "id": 80,
    "sectionId": 1,
    "title": "Câu hỏi về hàm ý câu nói",
    "slug": "topic-part7-cau-hoi-ham-y-cau-noi",
    "description": "Câu hỏi về hàm ý câu nói Part 7",
    "orderIndex": 6
  },
  {
    "id": 81,
    "sectionId": 1,
    "title": "Câu hỏi tìm chi tiết sai",
    "slug": "topic-part7-cau-hoi-tim-chi-tiet-sai",
    "description": "Câu hỏi tìm chi tiết sai Part 7",
    "orderIndex": 7
  },
  {
    "id": 82,
    "sectionId": 1,
    "title": "Câu hỏi điền câu",
    "slug": "topic-part7-cau-hoi-dien-cau",
    "description": "Câu hỏi điền câu Part 7",
    "orderIndex": 8
  },
  {
    "id": 83,
    "sectionId": 1,
    "title": "Dạng bài Article/ Review - Bài báo/ Bài đánh giá",
    "slug": "topic-part7-dang-bai-article-review",
    "description": "Dạng bài Article/ Review Part 7",
    "orderIndex": 9
  },
  {
    "id": 84,
    "sectionId": 1,
    "title": "Dạng bài Announcement/ Notice - Thông báo",
    "slug": "topic-part7-dang-bai-announcement-notice",
    "description": "Dạng bài Announcement/ Notice Part 7",
    "orderIndex": 10
  },
  {
    "id": 85,
    "sectionId": 1,
    "title": "Dạng bài Email/ Letter - Thư điện tử/ Thư tay",
    "slug": "topic-part7-dang-bai-email-letter",
    "description": "Dạng bài Email/ Letter Part 7",
    "orderIndex": 11
  },
  {
    "id": 86,
    "sectionId": 1,
    "title": "Dạng bài Advertisement - Quảng cáo",
    "slug": "topic-part7-dang-bai-advertisement",
    "description": "Dạng bài Advertisement Part 7",
    "orderIndex": 12
  },
  {
    "id": 87,
    "sectionId": 1,
    "title": "Dạng bài Form - Biểu mẫu",
    "slug": "topic-part7-dang-bai-form",
    "description": "Dạng bài Form Part 7",
    "orderIndex": 13
  },
  {
    "id": 88,
    "sectionId": 1,
    "title": "Dạng bài Text message chain - Chuỗi tin nhắn",
    "slug": "topic-part7-dang-bai-text-message-chain",
    "description": "Dạng bài Text message chain Part 7",
    "orderIndex": 14
  },
  {
    "id": 89,
    "sectionId": 1,
    "title": "Luyện tập theo cấu trúc",
    "slug": "topic-part7-luyen-tap-cau-truc",
    "description": "Luyện tập theo cấu trúc Part 7",
    "orderIndex": 15
  },
  {
    "id": 90,
    "sectionId": 1,
    "title": "Luyện tập tổng hợp",
    "slug": "topic-part7-luyen-tap-tong-hop",
    "description": "Luyện tập tổng hợp Part 7",
    "orderIndex": 16
  },
  {
    "id": 91,
    "sectionId": 6,
    "title": "Tổng quan",
    "slug": "topic-tong-quan-part-4",
    "description": "Tổng quan",
    "orderIndex": 1
  },
  {
    "id": 92,
    "sectionId": 6,
    "title": "Câu hỏi về chủ đề, mục đích",
    "slug": "topic-cau-hoi-ve-chu-de-muc-dich-part-4",
    "description": "Câu hỏi về chủ đề, mục đích",
    "orderIndex": 2
  },
  {
    "id": 93,
    "sectionId": 6,
    "title": "Câu hỏi về danh tính, địa điểm",
    "slug": "topic-cau-hoi-ve-danh-tinh-dia-diem-part-4",
    "description": "Câu hỏi về danh tính, địa điểm",
    "orderIndex": 3
  },
  {
    "id": 94,
    "sectionId": 6,
    "title": "Câu hỏi về chi tiết",
    "slug": "topic-cau-hoi-ve-chi-tiet-part-4",
    "description": "Câu hỏi về chi tiết",
    "orderIndex": 4
  },
  {
    "id": 95,
    "sectionId": 6,
    "title": "Câu hỏi yêu cầu, gợi ý",
    "slug": "topic-cau-hoi-yeu-cau-goi-y-part-4",
    "description": "Câu hỏi yêu cầu, gợi ý",
    "orderIndex": 5
  },
  {
    "id": 96,
    "sectionId": 6,
    "title": "Câu hỏi về hành động tương lai",
    "slug": "topic-cau-hoi-ve-hanh-dong-tuong-lai-part-4",
    "description": "Câu hỏi về hành động tương lai",
    "orderIndex": 6
  },
  {
    "id": 97,
    "sectionId": 6,
    "title": "Câu hỏi về hàm ý câu nói",
    "slug": "topic-cau-hoi-ve-ham-y-cau-noi-part-4",
    "description": "Câu hỏi về hàm ý câu nói",
    "orderIndex": 7
  },
  {
    "id": 98,
    "sectionId": 6,
    "title": "Câu hỏi kết hợp bảng biểu",
    "slug": "topic-cau-hoi-ket-hop-bang-bieu-part-4",
    "description": "Câu hỏi kết hợp bảng biểu",
    "orderIndex": 8
  },
  {
    "id": 99,
    "sectionId": 6,
    "title": "Dạng bài Telephone message - Tin nhắn thoại",
    "slug": "topic-dang-bai-telephone-message-part-4",
    "description": "Dạng bài Telephone message - Tin nhắn thoại",
    "orderIndex": 9
  },
  {
    "id": 100,
    "sectionId": 6,
    "title": "Dạng bài Advertisement - Quảng cáo",
    "slug": "topic-dang-bai-advertisement-part-4",
    "description": "Dạng bài Advertisement - Quảng cáo",
    "orderIndex": 10
  },
  {
    "id": 101,
    "sectionId": 6,
    "title": "Dạng bài Announcement - Thông báo",
    "slug": "topic-dang-bai-announcement-part-4",
    "description": "Dạng bài Announcement - Thông báo",
    "orderIndex": 11
  },
  {
    "id": 102,
    "sectionId": 6,
    "title": "Dạng bài Talk - Bài phát biểu, diễn văn",
    "slug": "topic-dang-bai-talk-part-4",
    "description": "Dạng bài Talk - Bài phát biểu, diễn văn",
    "orderIndex": 12
  },
  {
    "id": 103,
    "sectionId": 6,
    "title": "Dạng bài News report, Broadcast - Bản tin",
    "slug": "topic-dang-bai-news-report-part-4",
    "description": "Dạng bài News report, Broadcast - Bản tin",
    "orderIndex": 13
  },
  {
    "id": 104,
    "sectionId": 6,
    "title": "Dạng bài Excerpt from a meeting - Trích dẫn từ buổi họp",
    "slug": "topic-dang-bai-excerpt-from-a-meeting-part-4",
    "description": "Dạng bài Excerpt from a meeting - Trích dẫn từ buổi họp",
    "orderIndex": 14
  },
  {
    "id": 105,
    "sectionId": 6,
    "title": "Luyện tập tổng hợp",
    "slug": "topic-luyen-tap-tong-hop-part-4",
    "description": "Luyện tập tổng hợp",
    "orderIndex": 15
  }
];

const mockLessons = [
  {
    "id": 1,
    "topicId": 1,
    "title": "Kiến thức cơ bản 1: từ loại và cụm từ",
    "slug": "lesson-kien-thuc-co-ban-1-tu-loai-va-cum-tu",
    "durationMinutes": 23,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 2,
    "topicId": 2,
    "title": "Kiến thức cơ bản 2: mệnh đề và câu",
    "slug": "lesson-kien-thuc-co-ban-2-menh-de-va-cau",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 3,
    "topicId": 3,
    "title": "Phân loại Danh từ",
    "slug": "lesson-phan-loai-danh-tu",
    "durationMinutes": 15,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 4,
    "topicId": 3,
    "title": "Vị trí và chức năng của Danh từ",
    "slug": "lesson-vi-tri-va-chuc-nang-cua-danh-tu",
    "durationMinutes": 20,
    "orderIndex": 2,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 5,
    "topicId": 4,
    "title": "Đại từ",
    "slug": "lesson-dai-tu",
    "durationMinutes": 25,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 6,
    "topicId": 5,
    "title": "Tính từ",
    "slug": "lesson-tinh-tu",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 7,
    "topicId": 6,
    "title": "Thì",
    "slug": "lesson-thi",
    "durationMinutes": 30,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 8,
    "topicId": 7,
    "title": "Trạng từ",
    "slug": "lesson-trang-tu",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 9,
    "topicId": 8,
    "title": "Giới từ",
    "slug": "lesson-gioi-tu",
    "durationMinutes": 25,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 10,
    "topicId": 9,
    "title": "Liên từ",
    "slug": "lesson-lien-tu",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 11,
    "topicId": 10,
    "title": "Mệnh đề quan hệ",
    "slug": "lesson-menh-de-quan-he",
    "durationMinutes": 30,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 12,
    "topicId": 11,
    "title": "Câu điều kiện",
    "slug": "lesson-cau-dieu-kien",
    "durationMinutes": 25,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 13,
    "topicId": 14,
    "title": "Tổng quan",
    "slug": "lesson-tong-quan-part-1",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 14,
    "topicId": 15,
    "title": "Tranh tả người",
    "slug": "lesson-tranh-ta-nguoi",
    "durationMinutes": 20,
    "orderIndex": 2,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 15,
    "topicId": 16,
    "title": "Tranh tả vật",
    "slug": "lesson-tranh-ta-vat",
    "durationMinutes": 20,
    "orderIndex": 3,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 16,
    "topicId": 17,
    "title": "Tranh tả cả người và vật",
    "slug": "lesson-tranh-ta-ca-nguoi-va-vat",
    "durationMinutes": 20,
    "orderIndex": 4,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 17,
    "topicId": 18,
    "title": "Luyện tập tổng hợp",
    "slug": "lesson-luyen-tap-tong-hop-part-1",
    "durationMinutes": 30,
    "orderIndex": 5,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 18,
    "topicId": 19,
    "title": "Tổng quan",
    "slug": "lesson-tong-quan-part-2",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 19,
    "topicId": 20,
    "title": "Câu hỏi WHO",
    "slug": "lesson-cau-hoi-who",
    "durationMinutes": 20,
    "orderIndex": 2,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 20,
    "topicId": 21,
    "title": "Câu hỏi WHAT",
    "slug": "lesson-cau-hoi-what",
    "durationMinutes": 20,
    "orderIndex": 3,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 21,
    "topicId": 22,
    "title": "Câu hỏi WHERE",
    "slug": "lesson-cau-hoi-where",
    "durationMinutes": 20,
    "orderIndex": 4,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 22,
    "topicId": 23,
    "title": "Câu hỏi WHEN",
    "slug": "lesson-cau-hoi-when",
    "durationMinutes": 20,
    "orderIndex": 5,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 23,
    "topicId": 24,
    "title": "Câu hỏi WHY",
    "slug": "lesson-cau-hoi-why",
    "durationMinutes": 20,
    "orderIndex": 6,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 24,
    "topicId": 25,
    "title": "Câu hỏi HOW",
    "slug": "lesson-cau-hoi-how",
    "durationMinutes": 20,
    "orderIndex": 7,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 25,
    "topicId": 26,
    "title": "Câu hỏi YES/NO",
    "slug": "lesson-cau-hoi-yes-no",
    "durationMinutes": 20,
    "orderIndex": 8,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 26,
    "topicId": 27,
    "title": "Câu hỏi lựa chọn",
    "slug": "lesson-cau-hoi-lua-chon",
    "durationMinutes": 20,
    "orderIndex": 9,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 27,
    "topicId": 28,
    "title": "Câu hỏi đuôi",
    "slug": "lesson-cau-hoi-duoi",
    "durationMinutes": 20,
    "orderIndex": 10,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 28,
    "topicId": 29,
    "title": "Câu đề nghị, yêu cầu",
    "slug": "lesson-cau-de-nghi-yeu-cau",
    "durationMinutes": 20,
    "orderIndex": 11,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 29,
    "topicId": 30,
    "title": "Câu trần thuật",
    "slug": "lesson-cau-tran-thuat",
    "durationMinutes": 20,
    "orderIndex": 12,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 30,
    "topicId": 31,
    "title": "Luyện tập tổng hợp",
    "slug": "lesson-luyen-tap-tong-hop-part-2",
    "durationMinutes": 30,
    "orderIndex": 13,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 31,
    "topicId": 32,
    "title": "Tổng quan",
    "slug": "lesson-tong-quan-part-3",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 32,
    "topicId": 33,
    "title": "Câu hỏi về chủ đề, mục đích",
    "slug": "lesson-cau-hoi-ve-chu-de-muc-dich",
    "durationMinutes": 20,
    "orderIndex": 2,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 33,
    "topicId": 34,
    "title": "Câu hỏi về địa điểm hội thoại",
    "slug": "lesson-cau-hoi-ve-dia-diem-hoi-thoai",
    "durationMinutes": 20,
    "orderIndex": 3,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 34,
    "topicId": 35,
    "title": "Câu hỏi về danh tính người nói",
    "slug": "lesson-cau-hoi-ve-danh-tinh-nguoi-noi",
    "durationMinutes": 20,
    "orderIndex": 4,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 35,
    "topicId": 36,
    "title": "Câu hỏi về chi tiết cuộc hội thoại",
    "slug": "lesson-cau-hoi-ve-chi-tiet-cuoc-hoi-thoai",
    "durationMinutes": 20,
    "orderIndex": 5,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 36,
    "topicId": 37,
    "title": "Câu hỏi về hành động tương lai",
    "slug": "lesson-cau-hoi-ve-hanh-dong-tuong-lai",
    "durationMinutes": 20,
    "orderIndex": 6,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 37,
    "topicId": 38,
    "title": "Câu hỏi về yêu cầu, gợi ý",
    "slug": "lesson-cau-hoi-ve-yeu-cau-goi-y",
    "durationMinutes": 20,
    "orderIndex": 7,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 38,
    "topicId": 39,
    "title": "Câu hỏi về hàm ý câu nói",
    "slug": "lesson-cau-hoi-ve-ham-y-cau-noi",
    "durationMinutes": 20,
    "orderIndex": 8,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 39,
    "topicId": 40,
    "title": "Câu hỏi kết hợp bảng biểu",
    "slug": "lesson-cau-hoi-ket-hop-bang-bieu",
    "durationMinutes": 20,
    "orderIndex": 9,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 40,
    "topicId": 41,
    "title": "General Office Work",
    "slug": "lesson-chu-de-doi-thoai-general-office-work",
    "durationMinutes": 15,
    "orderIndex": 10,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 41,
    "topicId": 41,
    "title": "Personnel",
    "slug": "lesson-chu-de-doi-thoai-personnel",
    "durationMinutes": 15,
    "orderIndex": 11,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 42,
    "topicId": 41,
    "title": "Business, Marketing",
    "slug": "lesson-chu-de-doi-thoai-business-marketing",
    "durationMinutes": 15,
    "orderIndex": 12,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 43,
    "topicId": 41,
    "title": "Event, Project",
    "slug": "lesson-chu-de-doi-thoai-event-project",
    "durationMinutes": 15,
    "orderIndex": 13,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 44,
    "topicId": 41,
    "title": "Facility",
    "slug": "lesson-chu-de-doi-thoai-facility",
    "durationMinutes": 15,
    "orderIndex": 14,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 45,
    "topicId": 41,
    "title": "Shopping, Service",
    "slug": "lesson-chu-de-doi-thoai-shopping-service",
    "durationMinutes": 15,
    "orderIndex": 15,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 46,
    "topicId": 41,
    "title": "Order, Delivery",
    "slug": "lesson-chu-de-doi-thoai-order-delivery",
    "durationMinutes": 15,
    "orderIndex": 16,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 47,
    "topicId": 41,
    "title": "Housing",
    "slug": "lesson-chu-de-doi-thoai-housing",
    "durationMinutes": 15,
    "orderIndex": 17,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 48,
    "topicId": 42,
    "title": "Luyện tập tổng hợp",
    "slug": "lesson-luyen-tap-tong-hop-part-3",
    "durationMinutes": 30,
    "orderIndex": 18,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 49,
    "topicId": 43,
    "title": "Tổng quan",
    "slug": "lesson-tong-quan-part-4",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 50,
    "topicId": 43,
    "title": "Câu hỏi về chủ đề, mục đích",
    "slug": "lesson-cau-hoi-ve-chu-de-muc-dich-part4",
    "durationMinutes": 20,
    "orderIndex": 2,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 51,
    "topicId": 43,
    "title": "Câu hỏi về danh tính, địa điểm",
    "slug": "lesson-cau-hoi-ve-danh-tinh-dia-diem",
    "durationMinutes": 20,
    "orderIndex": 3,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 52,
    "topicId": 43,
    "title": "Câu hỏi về chi tiết",
    "slug": "lesson-cau-hoi-ve-chi-tiet",
    "durationMinutes": 20,
    "orderIndex": 4,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 53,
    "topicId": 43,
    "title": "Câu hỏi yêu cầu, gợi ý",
    "slug": "lesson-cau-hoi-yeu-cau-goi-y",
    "durationMinutes": 20,
    "orderIndex": 5,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 54,
    "topicId": 43,
    "title": "Câu hỏi về hành động tương lai",
    "slug": "lesson-cau-hoi-ve-hanh-dong-tuong-lai-part4",
    "durationMinutes": 20,
    "orderIndex": 6,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 55,
    "topicId": 43,
    "title": "Câu hỏi về hàm ý câu nói",
    "slug": "lesson-cau-hoi-ve-ham-y-cau-noi-part4",
    "durationMinutes": 20,
    "orderIndex": 7,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 56,
    "topicId": 43,
    "title": "Câu hỏi kết hợp bảng biểu",
    "slug": "lesson-cau-hoi-ket-hop-bang-bieu-part4",
    "durationMinutes": 20,
    "orderIndex": 8,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 57,
    "topicId": 43,
    "title": "Dạng bài Telephone message - Tin nhắn thoại",
    "slug": "lesson-dang-bai-telephone-message",
    "durationMinutes": 20,
    "orderIndex": 9,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 58,
    "topicId": 43,
    "title": "Dạng bài Advertisement - Quảng cáo",
    "slug": "lesson-dang-bai-advertisement",
    "durationMinutes": 20,
    "orderIndex": 10,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 59,
    "topicId": 43,
    "title": "Dạng bài Announcement - Thông báo",
    "slug": "lesson-dang-bai-announcement",
    "durationMinutes": 20,
    "orderIndex": 11,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 60,
    "topicId": 43,
    "title": "Dạng bài Talk - Bài phát biểu, diễn văn",
    "slug": "lesson-dang-bai-talk",
    "durationMinutes": 20,
    "orderIndex": 12,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 61,
    "topicId": 43,
    "title": "Dạng bài News report, Broadcast - Bản tin",
    "slug": "lesson-dang-bai-news-report",
    "durationMinutes": 20,
    "orderIndex": 13,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 62,
    "topicId": 43,
    "title": "Dạng bài Excerpt from a meeting - Trích dẫn từ buổi họp",
    "slug": "lesson-dang-bai-excerpt-from-a-meeting",
    "durationMinutes": 20,
    "orderIndex": 14,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 63,
    "topicId": 43,
    "title": "Luyện tập tổng hợp",
    "slug": "lesson-luyen-tap-tong-hop-part-4",
    "durationMinutes": 30,
    "orderIndex": 15,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 64,
    "topicId": 44,
    "title": "Tổng quan",
    "slug": "lesson-tong-quan-part-5",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 65,
    "topicId": 44,
    "title": "Câu hỏi từ loại",
    "slug": "lesson-cau-hoi-tu-loai",
    "durationMinutes": 20,
    "orderIndex": 2,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 66,
    "topicId": 44,
    "title": "Câu hỏi ngữ pháp",
    "slug": "lesson-cau-hoi-ngu-phap",
    "durationMinutes": 20,
    "orderIndex": 3,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 67,
    "topicId": 44,
    "title": "Câu hỏi từ vựng",
    "slug": "lesson-cau-hoi-tu-vung",
    "durationMinutes": 20,
    "orderIndex": 4,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 68,
    "topicId": 44,
    "title": "[Câu hỏi từ vựng] Danh từ",
    "slug": "lesson-cau-hoi-tu-vung-danh-tu",
    "durationMinutes": 20,
    "orderIndex": 5,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 69,
    "topicId": 44,
    "title": "[Câu hỏi từ vựng] Động từ",
    "slug": "lesson-cau-hoi-tu-vung-dong-tu",
    "durationMinutes": 20,
    "orderIndex": 6,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 70,
    "topicId": 44,
    "title": "[Câu hỏi từ vựng] Tính từ",
    "slug": "lesson-cau-hoi-tu-vung-tinh-tu",
    "durationMinutes": 20,
    "orderIndex": 7,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 71,
    "topicId": 44,
    "title": "[Câu hỏi từ vựng] Trạng từ",
    "slug": "lesson-cau-hoi-tu-vung-trang-tu",
    "durationMinutes": 20,
    "orderIndex": 8,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 72,
    "topicId": 44,
    "title": "[Câu hỏi từ loại] Danh từ",
    "slug": "lesson-cau-hoi-tu-loai-danh-tu",
    "durationMinutes": 20,
    "orderIndex": 9,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 73,
    "topicId": 44,
    "title": "[Câu hỏi từ loại] Tính từ",
    "slug": "lesson-cau-hoi-tu-loai-tinh-tu",
    "durationMinutes": 20,
    "orderIndex": 10,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 74,
    "topicId": 44,
    "title": "[Câu hỏi từ loại] Trạng từ",
    "slug": "lesson-cau-hoi-tu-loai-trang-tu",
    "durationMinutes": 20,
    "orderIndex": 11,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 75,
    "topicId": 44,
    "title": "[Câu hỏi từ loại] Động từ",
    "slug": "lesson-cau-hoi-tu-loai-dong-tu",
    "durationMinutes": 20,
    "orderIndex": 12,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 76,
    "topicId": 44,
    "title": "[Câu hỏi ngữ pháp] Đại từ",
    "slug": "lesson-cau-hoi-ngu-phap-dai-tu",
    "durationMinutes": 20,
    "orderIndex": 13,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 77,
    "topicId": 44,
    "title": "[Câu hỏi ngữ pháp] Thì của động từ",
    "slug": "lesson-cau-hoi-ngu-phap-thi-dong-tu",
    "durationMinutes": 20,
    "orderIndex": 14,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 78,
    "topicId": 44,
    "title": "[Câu hỏi ngữ pháp] Cấu trúc phân từ",
    "slug": "lesson-cau-hoi-ngu-phap-cau-truc-phan-tu",
    "durationMinutes": 20,
    "orderIndex": 16,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 79,
    "topicId": 44,
    "title": "[Câu hỏi ngữ pháp] Liên từ",
    "slug": "lesson-cau-hoi-ngu-phap-lien-tu",
    "durationMinutes": 20,
    "orderIndex": 20,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 80,
    "topicId": 44,
    "title": "[Câu hỏi ngữ pháp] Giới từ",
    "slug": "lesson-cau-hoi-ngu-phap-gioi-tu",
    "durationMinutes": 20,
    "orderIndex": 21,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 81,
    "topicId": 44,
    "title": "[Câu hỏi ngữ pháp] Câu cầu khiến",
    "slug": "lesson-cau-hoi-ngu-phap-cau-cau-khien",
    "durationMinutes": 20,
    "orderIndex": 22,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 82,
    "topicId": 44,
    "title": "[Câu hỏi ngữ pháp] Mệnh đề quan hệ",
    "slug": "lesson-cau-hoi-ngu-phap-menh-de-quan-he",
    "durationMinutes": 20,
    "orderIndex": 23,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 83,
    "topicId": 44,
    "title": "[Câu hỏi ngữ pháp] Cấu trúc so sánh",
    "slug": "lesson-cau-hoi-ngu-phap-cau-truc-so-sanh",
    "durationMinutes": 20,
    "orderIndex": 24,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 84,
    "topicId": 44,
    "title": "Luyện tập tổng hợp",
    "slug": "lesson-luyen-tap-tong-hop-part-5",
    "durationMinutes": 30,
    "orderIndex": 25,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 85,
    "topicId": 45,
    "title": "Tổng quan",
    "slug": "lesson-tong-quan-part-6",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 86,
    "topicId": 45,
    "title": "Câu hỏi từ loại",
    "slug": "lesson-cau-hoi-tu-loai-part-6",
    "durationMinutes": 20,
    "orderIndex": 2,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 87,
    "topicId": 45,
    "title": "Câu hỏi ngữ pháp",
    "slug": "lesson-cau-hoi-ngu-phap-part-6",
    "durationMinutes": 20,
    "orderIndex": 3,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 88,
    "topicId": 45,
    "title": "Câu hỏi từ vựng",
    "slug": "lesson-cau-hoi-tu-vung-part-6",
    "durationMinutes": 20,
    "orderIndex": 4,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 89,
    "topicId": 45,
    "title": "Câu hỏi điền câu vào đoạn văn",
    "slug": "lesson-cau-hoi-dien-cau-vao-doan-van",
    "durationMinutes": 20,
    "orderIndex": 5,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 90,
    "topicId": 45,
    "title": "Luyện tập tổng hợp",
    "slug": "lesson-luyen-tap-tong-hop-part-6",
    "durationMinutes": 30,
    "orderIndex": 11,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 91,
    "topicId": 46,
    "title": "Tổng quan",
    "slug": "lesson-tong-quan-part-7",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 92,
    "topicId": 46,
    "title": "Câu hỏi về chủ đề, mục đích",
    "slug": "lesson-cau-hoi-chu-de-muc-dich-part-7",
    "durationMinutes": 20,
    "orderIndex": 2,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 93,
    "topicId": 46,
    "title": "Câu hỏi tìm thông tin",
    "slug": "lesson-cau-hoi-tim-thong-tin",
    "durationMinutes": 20,
    "orderIndex": 3,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 94,
    "topicId": 46,
    "title": "Câu hỏi suy luận",
    "slug": "lesson-cau-hoi-suy-luan",
    "durationMinutes": 20,
    "orderIndex": 4,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 95,
    "topicId": 46,
    "title": "Câu hỏi tìm từ đồng nghĩa",
    "slug": "lesson-cau-hoi-tim-tu-dong-nghia",
    "durationMinutes": 20,
    "orderIndex": 5,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 96,
    "topicId": 46,
    "title": "Câu hỏi về hàm ý câu nói",
    "slug": "lesson-cau-hoi-ham-y-cau-noi-part-7",
    "durationMinutes": 20,
    "orderIndex": 6,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 97,
    "topicId": 46,
    "title": "Câu hỏi tìm chi tiết sai",
    "slug": "lesson-cau-hoi-tim-chi-tiet-sai",
    "durationMinutes": 20,
    "orderIndex": 7,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 98,
    "topicId": 46,
    "title": "Câu hỏi điền câu",
    "slug": "lesson-cau-hoi-dien-cau-part-7",
    "durationMinutes": 20,
    "orderIndex": 8,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 99,
    "topicId": 46,
    "title": "Dạng bài Article/ Review - Bài báo/ Bài đánh giá",
    "slug": "lesson-dang-bai-article-review",
    "durationMinutes": 20,
    "orderIndex": 9,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 100,
    "topicId": 46,
    "title": "Dạng bài Announcement/ Notice - Thông báo",
    "slug": "lesson-dang-bai-announcement-notice",
    "durationMinutes": 20,
    "orderIndex": 10,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 101,
    "topicId": 46,
    "title": "Dạng bài Email/ Letter - Thư điện tử/ Thư tay",
    "slug": "lesson-dang-bai-email-letter",
    "durationMinutes": 20,
    "orderIndex": 11,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 102,
    "topicId": 46,
    "title": "Dạng bài Advertisement - Quảng cáo",
    "slug": "lesson-dang-bai-advertisement-part-7",
    "durationMinutes": 20,
    "orderIndex": 12,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 103,
    "topicId": 46,
    "title": "Dạng bài Form - Biểu mẫu",
    "slug": "lesson-dang-bai-form",
    "durationMinutes": 20,
    "orderIndex": 13,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 104,
    "topicId": 46,
    "title": "Dạng bài Text message chain - Chuỗi tin nhắn",
    "slug": "lesson-dang-bai-text-message-chain",
    "durationMinutes": 20,
    "orderIndex": 14,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 105,
    "topicId": 46,
    "title": "Luyện tập theo cấu trúc: Cấu trúc một đoạn",
    "slug": "lesson-luyen-tap-cau-truc-mot-doan",
    "durationMinutes": 20,
    "orderIndex": 15,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 106,
    "topicId": 46,
    "title": "Luyện tập theo cấu trúc: Cấu trúc nhiều đoạn",
    "slug": "lesson-luyen-tap-cau-truc-nhieu-doan",
    "durationMinutes": 20,
    "orderIndex": 16,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 107,
    "topicId": 46,
    "title": "Luyện tập tổng hợp",
    "slug": "lesson-luyen-tap-tong-hop-part-7",
    "durationMinutes": 30,
    "orderIndex": 17,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 108,
    "topicId": 47,
    "title": "Tổng quan",
    "slug": "lesson-tong-quan-part-5",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 109,
    "topicId": 48,
    "title": "Câu hỏi từ loại",
    "slug": "lesson-cau-hoi-tu-loai",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 110,
    "topicId": 49,
    "title": "Câu hỏi ngữ pháp",
    "slug": "lesson-cau-hoi-ngu-phap",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 111,
    "topicId": 50,
    "title": "Câu hỏi từ vựng",
    "slug": "lesson-cau-hoi-tu-vung",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 112,
    "topicId": 91,
    "title": "Video bài giảng: Lý thuyết",
    "slug": "lesson-tong-quan-part-4",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 113,
    "topicId": 92,
    "title": "Video bài giảng: Lý thuyết",
    "slug": "lesson-cau-hoi-ve-chu-de-muc-dich-part4",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 114,
    "topicId": 93,
    "title": "Video bài giảng: Lý thuyết",
    "slug": "lesson-cau-hoi-ve-danh-tinh-dia-diem",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 115,
    "topicId": 94,
    "title": "Video bài giảng: Lý thuyết",
    "slug": "lesson-cau-hoi-ve-chi-tiet",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 116,
    "topicId": 95,
    "title": "Video bài giảng: Lý thuyết",
    "slug": "lesson-cau-hoi-yeu-cau-goi-y",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 117,
    "topicId": 96,
    "title": "Video bài giảng: Lý thuyết",
    "slug": "lesson-cau-hoi-ve-hanh-dong-tuong-lai-part4",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 118,
    "topicId": 97,
    "title": "Video bài giảng: Lý thuyết",
    "slug": "lesson-cau-hoi-ve-ham-y-cau-noi-part4",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 119,
    "topicId": 98,
    "title": "Video bài giảng: Lý thuyết",
    "slug": "lesson-cau-hoi-ket-hop-bang-bieu-part4",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 120,
    "topicId": 99,
    "title": "Lý thuyết: Lý thuyết",
    "slug": "lesson-dang-bai-telephone-message",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 121,
    "topicId": 100,
    "title": "Lý thuyết: Lý thuyết",
    "slug": "lesson-dang-bai-advertisement",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 122,
    "topicId": 101,
    "title": "Lý thuyết: Lý thuyết",
    "slug": "lesson-dang-bai-announcement",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 123,
    "topicId": 102,
    "title": "Lý thuyết: Lý thuyết",
    "slug": "lesson-dang-bai-talk",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 124,
    "topicId": 103,
    "title": "Lý thuyết: Lý thuyết",
    "slug": "lesson-dang-bai-news-report",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  },
  {
    "id": 125,
    "topicId": 104,
    "title": "Lý thuyết: Lý thuyết",
    "slug": "lesson-dang-bai-excerpt-from-a-meeting",
    "durationMinutes": 20,
    "orderIndex": 1,
    "content": "<p>Nội dung bài học...</p>",
    "videoUrl": ""
  }
];

const mockExercises = [
  {
    "id": 1,
    "topicId": 1,
    "title": "15",
    "exerciseType": "1",
    "timeLimit": 0,
    "totalQuestions": 0,
    "orderIndex": 1
  },
  {
    "id": 2,
    "topicId": 1,
    "title": "13",
    "exerciseType": "1",
    "timeLimit": 0,
    "totalQuestions": 0,
    "orderIndex": 1
  },
  {
    "id": 3,
    "topicId": 1,
    "title": "15",
    "exerciseType": "1",
    "timeLimit": 0,
    "totalQuestions": 0,
    "orderIndex": 1
  },
  {
    "id": 4,
    "topicId": 1,
    "title": "9",
    "exerciseType": "1",
    "timeLimit": 0,
    "totalQuestions": 0,
    "orderIndex": 1
  },
  {
    "id": 5,
    "topicId": 1,
    "title": "14",
    "exerciseType": "1",
    "timeLimit": 0,
    "totalQuestions": 0,
    "orderIndex": 1
  },
  {
    "id": 6,
    "topicId": 1,
    "title": "8",
    "exerciseType": "1",
    "timeLimit": 0,
    "totalQuestions": 0,
    "orderIndex": 1
  },
  {
    "id": 7,
    "topicId": 1,
    "title": "16",
    "exerciseType": "1",
    "timeLimit": 0,
    "totalQuestions": 0,
    "orderIndex": 1
  },
  {
    "id": 8,
    "topicId": 1,
    "title": "15",
    "exerciseType": "1",
    "timeLimit": 0,
    "totalQuestions": 0,
    "orderIndex": 1
  },
  {
    "id": 9,
    "topicId": 1,
    "title": "3",
    "exerciseType": "1",
    "timeLimit": 0,
    "totalQuestions": 0,
    "orderIndex": 1
  },
  {
    "id": 10,
    "topicId": 1,
    "title": "15",
    "exerciseType": "1",
    "timeLimit": 0,
    "totalQuestions": 0,
    "orderIndex": 1
  },
  {
    "id": 11,
    "topicId": 1,
    "title": "2",
    "exerciseType": "1",
    "timeLimit": 0,
    "totalQuestions": 0,
    "orderIndex": 1
  },
  {
    "id": 12,
    "topicId": 1,
    "title": "8",
    "exerciseType": "1",
    "timeLimit": 0,
    "totalQuestions": 0,
    "orderIndex": 1
  },
  {
    "id": 13,
    "topicId": 1,
    "title": "20",
    "exerciseType": "1",
    "timeLimit": 0,
    "totalQuestions": 0,
    "orderIndex": 1
  }
];

const mockQuestions = [
  {
    id: 1,
    questionGroup: {
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      imageUrl: 'https://via.placeholder.com/400x300',
    },
    questionText: 'What is happening in the picture?',
    optionA: 'He is running.',
    optionB: 'She is walking.',
    optionC: 'They are eating.',
    optionD: 'He is sleeping.',
    correctAnswer: 'A',
    explanation: 'The picture shows a man running.',
    transcript: 'He is running. \n She is walking.',
    transcriptDictation: 'He is running.'
  },
  {
    id: 2,
    questionGroup: null,
    questionText: 'The new manager _____ arrive tomorrow morning.',
    optionA: 'will',
    optionB: 'is',
    optionC: 'was',
    optionD: 'did',
    correctAnswer: 'A',
    explanation: 'Tomorrow morning requires future tense.',
  }
];

const mockDecks = [
  { id: 1, name: 'TOEIC Vocabulary 600', description: 'Từ vựng TOEIC cơ bản', isSystem: true, totalCards: 10 },
  { id: 2, name: 'My Favorite Words', description: 'Từ vựng của tôi', isSystem: false, totalCards: 5 }
];

const mockFlashcards = [
  { id: 1, frontText: 'Accommodate', backText: 'Cung cấp chỗ ở', frontAudio: '', examples: 'The hotel can accommodate 500 guests.' },
  { id: 2, frontText: 'Ambiguous', backText: 'Mơ hồ', frontAudio: '', examples: 'His reply was ambiguous.' }
];

// Auth
export const login = async (data) => { await delay(); return { data: { token: 'mock-token', user: { id: 1, email: data.email, role: 'USER' } } }; };
export const register = async (data) => { await delay(); return { data: { message: 'Đăng ký thành công' } }; };

// Sections
export const getSections = async () => { await delay(); return { data: mockSections }; };
export const getSectionBySlug = async (slug) => { 
  await delay(); 
  const section = mockSections.find(s => s.slug === slug);
  if (!section) throw new Error('Not found');
  const sectionTopics = mockTopics.filter(t => t.sectionId === section.id).map(t => ({
    ...t,
    lessons: mockLessons.filter(l => l.topicId === t.id),
    exercises: mockExercises.filter(e => e.topicId === t.id)
  }));
  return { data: { ...section, topics: sectionTopics } };
};

// Topics
export const getTopicsBySection = async (sectionId) => { await delay(); return { data: mockTopics.filter(t => t.sectionId === Number(sectionId)) }; };
export const getTopicById = async (id) => { await delay(); return { data: mockTopics.find(t => t.id === Number(id)) }; };

// Lessons
export const getLessonsByTopic = async (topicId) => { await delay(); return { data: mockLessons.filter(l => l.topicId === Number(topicId)) }; };
export const getLessonById = async (id) => { await delay(); return { data: mockLessons.find(l => l.id === Number(id)) }; };

// Exercises
export const getExercisesByTopic = async (topicId) => { await delay(); return { data: mockExercises.filter(e => e.topicId === Number(topicId)) }; };
export const getExerciseDetailById = async (id) => { 
  await delay(); 
  const exercise = mockExercises.find(e => e.id === Number(id));
  if (!exercise) throw new Error('Not found');
  return { data: { ...exercise, questions: mockQuestions } };
};

// Flashcards (Decks)
export const getSystemDecks = () =>
  fetch(`${BASE_URL}/decks/system`, { headers: getAuthHeaders() }).then(handleResponse);

export const getDeckById = (id) =>
  fetch(`${BASE_URL}/decks/${id}`, { headers: getAuthHeaders() }).then(handleResponse);

export const getMyDecks = () =>
  fetch(`${BASE_URL}/decks/my`, { headers: getAuthHeaders() }).then(handleResponse);

export const createMyDeck = (data) =>
  fetch(`${BASE_URL}/decks/my`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const updateMyDeck = (id, data) =>
  fetch(`${BASE_URL}/decks/my/${id}`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteMyDeck = (id) =>
  fetch(`${BASE_URL}/decks/my/${id}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  }).then(handleResponse);

// ========== FlashCards (within a Deck) ==========
export const addFlashCard = (deckId, data) =>
  fetch(`${BASE_URL}/decks/${deckId}/flashcards`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const updateFlashCard = (id, data) =>
  fetch(`${BASE_URL}/flashcards/${id}`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteFlashCard = (id) =>
  fetch(`${BASE_URL}/flashcards/${id}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  }).then(handleResponse);

// ========== TTS (Text-to-Speech) ==========
export const getTtsUrl = (text, lang = 'en') =>
  `${BASE_URL}/tts?text=${encodeURIComponent(text)}&lang=${lang}`;

// Practice
export const getPracticeTopics = async (sectionSlug) => { await delay(); return { data: mockTopics }; };
export const getPracticeNextQuestion = async (sectionSlug, data) => { await delay(); return { data: mockQuestions[Math.floor(Math.random() * mockQuestions.length)] }; };
export const submitPracticeAnswer = async (data) => { await delay(); return { data: { correct: true } }; };
export const getPracticeStats = async (sectionSlug) => { await delay(); return { data: { totalPracticed: 100, correctRate: 85 } }; };
export const getPracticeProgress = async (sectionSlug, days) => { await delay(); return { data: [] }; };
export const startPracticeSession = async () => { await delay(); return { data: { id: Date.now() } }; };
export const endPracticeSession = async () => { await delay(); return { data: { success: true } }; };
