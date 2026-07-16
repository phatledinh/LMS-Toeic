import React from 'react';

const MainContent = () => {
  return (
    <main className="main-content">
      <div className="content-header">
        <h1 className="page-title">Complete TOEIC</h1>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="#5f6368">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
        </svg>
      </div>

      <div className="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
          <line x1="16" x2="16" y1="2" y2="6"/>
          <line x1="8" x2="8" y1="2" y2="6"/>
          <line x1="3" x2="21" y1="10" y2="10"/>
        </svg>
        Lịch học của bạn
      </div>
      <p className="subtitle">Tham khảo tất cả lịch học gợi ý, phù hợp target của bạn từ STUDY4</p>

      <div className="course-card">
        <div className="course-card-header">
          <div className="course-title">
            Complete TOEIC 650+
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{cursor: 'pointer'}}>
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
            </svg>
          </div>
          <span className="badge-active">Active</span>
        </div>

        <div className="course-description">
          <p><i>- Dành cho các bạn học viên target 650+ đã đăng ký khóa Complete TOEIC của STUDY4</i></p>
          <p><i>- Thứ tự học từng kỹ năng: chú ý CHỈ LUYỆN một part cho đến khi đạt tỉ lệ đúng 70-80% rồi mới chuyển sang part khác.</i></p>
          <p><span className="highlight">--- Listening: part 1 {'>'} part 2 {'>'} part 4 {'>'} part 3</span></p>
          <p>--------- Riêng part 3 và part 4, tập trung vào dạng câu hỏi không cần suy luận: chủ đề, danh tính, địa điểm, mục đích và bảng biểu.</p>
          <p><span className="highlight">--- Reading: part 5 {'>'} part 6 {'>'} part 7</span></p>
          <p>--------- Part 7, tập trung vào bài đọc đơn, đọc ghép 2 câu hỏi. Dạng câu hỏi tìm thông tin: danh tính, thời gian, địa điểm hoặc dạng tìm mục đích.</p>
          <p><i>- Chú ý không luyện nhiều part của 1 kỹ năng cùng một lúc</i></p>
        </div>

        <div className="tabs">
          <div className="tab active">Hôm nay cần làm</div>
          <div className="tab">Theo tuần</div>
          <div className="tab">Chỉnh sửa/Thêm mới</div>
        </div>

        <div className="task-grid">
          <div className="task-card">
            <h3 className="task-card-title">Reading: Hằng ngày</h3>
            <div className="task-item">
              <input type="checkbox" id="task1" />
              <label htmlFor="task1">Làm riêng từng part bạn muốn luyện tập (bấm thời gian 1 phút/câu)</label>
            </div>
            <div className="task-item">
              <input type="checkbox" id="task2" />
              <label htmlFor="task2">Tự chữa các câu làm sai rà soát lại kiến thức (Từ vựng, ngữ pháp)</label>
            </div>
          </div>

          <div className="task-card">
            <h3 className="task-card-title">Listening: Hằng ngày</h3>
            <div className="task-item">
              <input type="checkbox" id="task3" />
              <label htmlFor="task3">Làm riêng từng part bạn muốn luyện tập (bấm thời gian 1 phút/câu)</label>
            </div>
            <div className="task-item">
              <input type="checkbox" id="task4" />
              <label htmlFor="task4">Tự chữa các câu làm sai (áp dụng chép chính tả hoặc shadowing)</label>
            </div>
          </div>

          <div className="task-card">
            <h3 className="task-card-title">Từ vựng/ngữ pháp: Hàng ngày</h3>
            <div className="task-item">
              <input type="checkbox" id="task5" />
              <label htmlFor="task5">Học từ vựng (flashcards mỗi ngày 20-30 từ)</label>
            </div>
            <div className="task-item">
              <input type="checkbox" id="task6" />
              <label htmlFor="task6">Học và làm bài tập ngữ pháp (mỗi ngày 1 chủ đề ngữ pháp)</label>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
