import React, { useState, useEffect } from 'react';
import { getTopicsBySection } from '../../../services/api';

const FlatQuestionForm = ({ initialData, onSave, onCancel, isPracticeTopic, sectionId }) => {
  const [topics, setTopics] = useState([]);
  const [formData, setFormData] = useState({
    questionNumber: 1,
    sourceTopicId: '',
    content: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    explanation: '',
    ...initialData
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData, sourceTopicId: initialData.sourceTopicId || '' });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: isPracticeTopic ? '100px 1fr' : '100px', gap: '15px', marginBottom: '15px' }}>
        <div>
          <label style={styles.label}>Câu số <span style={{color: 'red'}}>*</span></label>
          <input type="number" name="questionNumber" value={formData.questionNumber} onChange={handleChange} required style={styles.input} />
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
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={styles.label}>Nội dung câu hỏi <span style={{color: 'red'}}>*</span></label>
        <textarea name="content" value={formData.content} onChange={handleChange} rows={3} style={styles.textarea} required />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
        <div>
          <label style={styles.label}>Đáp án A <span style={{color: 'red'}}>*</span></label>
          <input type="text" name="optionA" value={formData.optionA} onChange={handleChange} style={styles.input} required />
        </div>
        <div>
          <label style={styles.label}>Đáp án B <span style={{color: 'red'}}>*</span></label>
          <input type="text" name="optionB" value={formData.optionB} onChange={handleChange} style={styles.input} required />
        </div>
        <div>
          <label style={styles.label}>Đáp án C <span style={{color: 'red'}}>*</span></label>
          <input type="text" name="optionC" value={formData.optionC} onChange={handleChange} style={styles.input} required />
        </div>
        <div>
          <label style={styles.label}>Đáp án D <span style={{color: 'red'}}>*</span></label>
          <input type="text" name="optionD" value={formData.optionD} onChange={handleChange} style={styles.input} required />
        </div>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={styles.label}>Đáp án Đúng <span style={{color: 'red'}}>*</span></label>
        <select name="correctAnswer" value={formData.correctAnswer} onChange={handleChange} style={styles.select} required>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={styles.label}>Giải thích (Tùy chọn)</label>
        <textarea name="explanation" value={formData.explanation} onChange={handleChange} rows={2} style={styles.textarea} />
      </div>
      <div style={styles.footer}>
        <button type="button" onClick={onCancel} className="btn" style={{ marginRight: '10px' }}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu Câu Hỏi</button>
      </div>
    </form>
  );
};

const styles = {
  label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#34495e' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', outline: 'none', transition: 'border-color 0.3s' },
  textarea: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', outline: 'none', resize: 'vertical' },
  select: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', outline: 'none' },
  footer: { textAlign: 'right', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }
};

export default FlatQuestionForm;
