import React, { useState, useEffect } from 'react';
import MediaPreview from './MediaPreview';
import AudioUploadField from '../../common/AudioUploadField';
import { getTopicsBySection } from '../../../services/api';

const GroupPart2Form = ({ initialData, onSave, onCancel, isPracticeTopic, sectionId, sectionSlug, topicSlug }) => {
  const [topics, setTopics] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    orderIndex: 1,
    sourceTopicId: '',
    audioUrl: '',
    imageUrl: '', // Always empty for part 2
    passage: '',
    questions: [
      { questionNumber: 1, content: 'Listen to the question and responses.', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', explanation: '' }
    ]
  });

  useEffect(() => {
    if (initialData) {
      const qs = initialData.questions && initialData.questions.length > 0 
        ? initialData.questions 
        : [{ questionNumber: 1, content: 'Listen to the question and responses.', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', explanation: '' }];
      setFormData({ ...formData, ...initialData, questions: qs, sourceTopicId: initialData.sourceTopicId || '' });
    }
  }, [initialData]);

  useEffect(() => {
    if (isPracticeTopic && sectionId) {
      getTopicsBySection(sectionId).then(res => {
        const filtered = res.data.filter(t => !t.slug.includes('tong-quan') && !t.slug.includes('luyen-tap-tong-hop'));
        setTopics(filtered);
      }).catch(err => console.error("Error fetching topics:", err));
    }
  }, [isPracticeTopic, sectionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    const updatedQuestions = [...formData.questions];
    updatedQuestions[0] = { ...updatedQuestions[0], [name]: value };
    setFormData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.audioUrl) {
      alert("Vui lòng tải audio lên hoặc nhập URL audio.");
      return;
    }
    onSave(formData);
  };

  const q = formData.questions[0];
  const fileNamePrefix = (sectionSlug && topicSlug && formData.orderIndex) ? `${sectionSlug}_${topicSlug}_q${formData.orderIndex}` : null;

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: isPracticeTopic ? '100px 1fr 1fr' : '100px 1fr', gap: '15px', marginBottom: '15px' }}>
        <div>
          <label style={styles.label}>Câu số <span style={{color: 'red'}}>*</span></label>
          <input type="number" name="orderIndex" value={formData.orderIndex} onChange={handleChange} required style={styles.input} />
        </div>
        {isPracticeTopic && (
          <div>
            <label style={styles.label}>Thuộc chủ đề</label>
            <select name="sourceTopicId" value={formData.sourceTopicId} onChange={handleChange} style={styles.select} required>
              <option value="">-- Chọn chủ đề --</option>
              {topics.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label style={styles.label}>Audio URL / Tải audio lên <span style={{color: 'red'}}>*</span></label>
          <AudioUploadField name="audioUrl" value={formData.audioUrl} onChange={handleChange} placeholder="https://..." />
        </div>
      </div>
      
      <MediaPreview audioUrl={formData.audioUrl} />

      <div style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0', marginTop: '20px' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Chi tiết Câu hỏi (Chỉ 3 lựa chọn)</h4>
        <div style={{ marginBottom: '15px' }}>
          <label style={styles.label}>📝 Nội dung câu hỏi</label>
          <textarea 
            name="content"
            placeholder="Nhập nội dung câu hỏi..." 
            value={q.content || ''} 
            onChange={handleQuestionChange} 
            style={{ ...styles.input, resize: 'vertical', minHeight: '60px' }} 
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={styles.label}>Đáp án A <span style={{color: 'red'}}>*</span></label>
            <input type="text" name="optionA" value={q.optionA} onChange={handleQuestionChange} style={styles.input} required />
          </div>
          <div>
            <label style={styles.label}>Đáp án B <span style={{color: 'red'}}>*</span></label>
            <input type="text" name="optionB" value={q.optionB} onChange={handleQuestionChange} style={styles.input} required />
          </div>
          <div>
            <label style={styles.label}>Đáp án C <span style={{color: 'red'}}>*</span></label>
            <input type="text" name="optionC" value={q.optionC} onChange={handleQuestionChange} style={styles.input} required />
          </div>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={styles.label}>Đáp án Đúng <span style={{color: 'red'}}>*</span></label>
          <select name="correctAnswer" value={q.correctAnswer} onChange={handleQuestionChange} style={styles.select} required>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>
        <div>
          <label style={styles.label}>💡 Giải thích đáp án (Tùy chọn)</label>
          <textarea 
            name="explanation"
            placeholder="Giải thích vì sao chọn đáp án này..." 
            value={q.explanation || ''} 
            onChange={handleQuestionChange} 
            style={{ ...styles.input, resize: 'vertical', minHeight: '60px' }} 
          />
        </div>
      </div>

      <div style={styles.footer}>
        <button type="button" onClick={onCancel} className="btn" style={{ marginRight: '10px' }}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu Nhóm Part 2</button>
      </div>
    </form>
  );
};

const styles = {
  label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#34495e', fontSize: '0.9rem' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', outline: 'none', transition: 'border-color 0.3s' },
  select: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', outline: 'none' },
  footer: { textAlign: 'right', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }
};

export default GroupPart2Form;
