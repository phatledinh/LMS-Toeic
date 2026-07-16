import React, { useState, useEffect } from 'react';
import TopicTagSelector from './TopicTagSelector';

const FlatQuestionForm = ({ initialData, onSave, onCancel, allTopics = [] }) => {
  const [formData, setFormData] = useState({
    questionNumber: 1,
    content: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    explanation: '',
    topicTags: [],
    ...initialData
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTopicTagsChange = (newTags) => {
    setFormData(prev => ({ ...prev, topicTags: newTags }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '15px' }}>
        <label style={styles.label}>Câu số (*)</label>
        <input type="number" name="questionNumber" value={formData.questionNumber} onChange={handleChange} required style={styles.input} />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={styles.label}>Nội dung câu hỏi</label>
        <textarea name="content" value={formData.content} onChange={handleChange} rows={3} style={styles.textarea} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
        <div>
          <label style={styles.label}>Đáp án A</label>
          <input type="text" name="optionA" value={formData.optionA} onChange={handleChange} style={styles.input} required />
        </div>
        <div>
          <label style={styles.label}>Đáp án B</label>
          <input type="text" name="optionB" value={formData.optionB} onChange={handleChange} style={styles.input} required />
        </div>
        <div>
          <label style={styles.label}>Đáp án C</label>
          <input type="text" name="optionC" value={formData.optionC} onChange={handleChange} style={styles.input} required />
        </div>
        <div>
          <label style={styles.label}>Đáp án D</label>
          <input type="text" name="optionD" value={formData.optionD} onChange={handleChange} style={styles.input} required />
        </div>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={styles.label}>Đáp án Đúng (*)</label>
        <select name="correctAnswer" value={formData.correctAnswer} onChange={handleChange} style={styles.select}>
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

      <div style={{ padding: '15px', backgroundColor: '#fdfdfd', border: '1px solid #eaeaea', borderRadius: '6px', marginBottom: '15px' }}>
        <h5 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#34495e' }}>Phân loại chủ đề câu hỏi (Tags)</h5>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
          <TopicTagSelector 
            title="Loại câu hỏi (QUESTION_TYPE)" 
            topics={allTopics.filter(t => t.slug && t.slug.includes('loai-cau-hoi'))} 
            selectedTags={formData.topicTags || []} 
            onChange={handleTopicTagsChange} 
            tagType="QUESTION_TYPE" 
          />
          <TopicTagSelector 
            title="Ngữ pháp (GRAMMAR)" 
            topics={allTopics.filter(t => t.slug && t.slug.includes('ngu-phap'))} 
            selectedTags={formData.topicTags || []} 
            onChange={handleTopicTagsChange} 
            tagType="GRAMMAR" 
          />
          <TopicTagSelector 
            title="Từ vựng (VOCABULARY)" 
            topics={allTopics.filter(t => t.slug && t.slug.includes('tu-vung'))} 
            selectedTags={formData.topicTags || []} 
            onChange={handleTopicTagsChange} 
            tagType="VOCABULARY" 
          />
        </div>
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
