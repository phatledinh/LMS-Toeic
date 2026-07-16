import React, { useState, useEffect } from 'react';
import MediaPreview from './MediaPreview';
import NestedQuestionList from './NestedQuestionList';
import FileUploadInput from '../../common/FileUploadInput';

const GroupPart34Form = ({ initialData, onSave, onCancel, allTopics = [] }) => {
  const [formData, setFormData] = useState({
    id: null,
    orderIndex: 1,
    audioUrl: '',
    imageUrl: '', // Optional for graphic questions
    passage: '',
    questions: [],
    topicTags: []
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

  const handleAddQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { questionNumber: prev.questions.length + 1, content: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', explanation: '' }
      ]
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...formData.questions];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, questions: updated }));
  };

  const handleRemoveQuestion = (index) => {
    const updated = [...formData.questions];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, questions: updated }));
  };

  const toggleTopicTag = (topicId, tagType) => {
    setFormData(prev => {
      const existing = prev.topicTags.find(t => t.topicId === topicId && t.tagType === tagType);
      if (existing) {
        return { ...prev, topicTags: prev.topicTags.filter(t => t !== existing) };
      } else {
        return { ...prev, topicTags: [...prev.topicTags, { topicId, tagType }] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '15px' }}>
        <label style={styles.label}>Nhóm số (Order Index)</label>
        <input type="number" name="orderIndex" value={formData.orderIndex} onChange={handleChange} required style={styles.input} />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '5px' }}>
        <div>
          <label style={styles.label}>Audio URL / Tải audio lên (*)</label>
          <FileUploadInput name="audioUrl" value={formData.audioUrl} onChange={handleChange} placeholder="https://..." accept="audio/*,video/*" />
        </div>
        <div>
          <label style={styles.label}>Image URL / Tải ảnh lên (Tùy chọn - Dành cho câu Graphic)</label>
          <FileUploadInput name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." accept="image/*" />
        </div>
      </div>
      
      <MediaPreview imageUrl={formData.imageUrl} audioUrl={formData.audioUrl} />

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '6px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Phân loại chủ đề nhóm (Topic Tags)</h4>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <strong style={{ display: 'block', marginBottom: '8px' }}>Chủ đề hội thoại/đoạn văn (THEME)</strong>
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {allTopics.filter(t => t.slug && t.slug.includes('chu-de')).map(t => (
                <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                  <input type="checkbox" checked={formData.topicTags.some(tag => tag.topicId === t.id && tag.tagType === 'CONVERSATION_THEME')} onChange={() => toggleTopicTag(t.id, 'CONVERSATION_THEME')} />
                  {t.title}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <NestedQuestionList 
        questions={formData.questions} 
        onChange={handleQuestionChange} 
        onAdd={handleAddQuestion} 
        onRemove={handleRemoveQuestion} 
        allTopics={allTopics}
      />

      <div style={styles.footer}>
        <button type="button" onClick={onCancel} className="btn" style={{ marginRight: '10px' }}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu Nhóm Part 3/4</button>
      </div>
    </form>
  );
};

const styles = {
  label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#34495e', fontSize: '0.9rem' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', outline: 'none', transition: 'border-color 0.3s' },
  footer: { textAlign: 'right', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }
};

export default GroupPart34Form;
