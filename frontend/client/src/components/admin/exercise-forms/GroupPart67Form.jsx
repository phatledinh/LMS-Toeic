import React, { useState, useEffect } from 'react';
import MediaPreview from './MediaPreview';
import NestedQuestionList from './NestedQuestionList';
import FileUploadInput from '../../common/FileUploadInput';

const GroupPart67Form = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: null,
    orderIndex: 1,
    audioUrl: '',
    imageUrl: '', // Optional for reading articles with images
    passage: '',
    questions: []
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '15px', marginBottom: '15px' }}>
        <div>
          <label style={styles.label}>Nhóm số</label>
          <input type="number" name="orderIndex" value={formData.orderIndex} onChange={handleChange} required style={styles.input} />
        </div>
        <div>
          <label style={styles.label}>Image URL / Tải ảnh lên (Tùy chọn - Dành cho bài đọc có hình ảnh)</label>
          <FileUploadInput name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." accept="image/*" />
        </div>
      </div>
      
      <MediaPreview imageUrl={formData.imageUrl} />

      <div style={{ marginBottom: '15px' }}>
        <label style={styles.label}>Đoạn văn (Passage) (*)</label>
        <textarea 
          name="passage" 
          value={formData.passage} 
          onChange={handleChange} 
          rows={8} 
          style={{...styles.input, resize: 'vertical', fontFamily: 'inherit'}} 
          placeholder="Nhập nội dung đoạn văn..."
          required
        />
      </div>

      <NestedQuestionList 
        questions={formData.questions} 
        onChange={handleQuestionChange} 
        onAdd={handleAddQuestion} 
        onRemove={handleRemoveQuestion} 
      />

      <div style={styles.footer}>
        <button type="button" onClick={onCancel} className="btn" style={{ marginRight: '10px' }}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu Nhóm Part 6/7</button>
      </div>
    </form>
  );
};

const styles = {
  label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#34495e', fontSize: '0.9rem' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', outline: 'none', transition: 'border-color 0.3s' },
  footer: { textAlign: 'right', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }
};

export default GroupPart67Form;
