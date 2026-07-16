import React, { useState, useEffect } from 'react';
import NestedQuestionList from './NestedQuestionList';
import FileUploadInput from '../../common/FileUploadInput';

const GroupPart7Form = ({ initialData, onSave, onCancel, allTopics = [] }) => {
  const [formData, setFormData] = useState({
    id: null,
    orderIndex: 1,
    audioUrl: '',
    imageUrl: '', // Optional
    passage: '',  // Fallback
    questions: [],
    topicTags: [], // List of { topicId, tagType }
    contentBlocks: [] // List of { id?, blockType: 'TEXT'|'IMAGE', content: '', imageUrl: '', orderIndex: number }
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

  const handleAddContentBlock = (type) => {
    setFormData(prev => ({
      ...prev,
      contentBlocks: [
        ...prev.contentBlocks,
        { blockType: type, content: '', imageUrl: '', orderIndex: prev.contentBlocks.length + 1 }
      ]
    }));
  };

  const handleContentBlockChange = (index, field, value) => {
    const updated = [...formData.contentBlocks];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, contentBlocks: updated }));
  };

  const handleRemoveContentBlock = (index) => {
    const updated = [...formData.contentBlocks];
    updated.splice(index, 1);
    // Reorder
    updated.forEach((b, i) => b.orderIndex = i + 1);
    setFormData(prev => ({ ...prev, contentBlocks: updated }));
  };

  const handleMoveContentBlock = (index, direction) => {
    const updated = [...formData.contentBlocks];
    if (direction === -1 && index > 0) {
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
    } else if (direction === 1 && index < updated.length - 1) {
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
    }
    updated.forEach((b, i) => b.orderIndex = i + 1);
    setFormData(prev => ({ ...prev, contentBlocks: updated }));
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
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '15px', marginBottom: '15px' }}>
        <div>
          <label style={styles.label}>Nhóm số</label>
          <input type="number" name="orderIndex" value={formData.orderIndex} onChange={handleChange} required style={styles.input} />
        </div>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '6px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Phân loại chủ đề nhóm (Topic Tags)</h4>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <strong style={{ display: 'block', marginBottom: '8px' }}>Hình thức văn bản (FORMAT)</strong>
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {allTopics.filter(t => t.slug && t.slug.includes('hinh-thuc')).map(t => (
                <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                  <input type="checkbox" checked={formData.topicTags.some(tag => tag.topicId === t.id && tag.tagType === 'FORMAT')} onChange={() => toggleTopicTag(t.id, 'FORMAT')} />
                  {t.title}
                </label>
              ))}
            </div>
          </div>
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

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '6px', backgroundColor: '#f9f9f9' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Nội dung bài đọc (Content Blocks)</h4>
        {formData.contentBlocks.map((block, idx) => (
          <div key={idx} style={{ padding: '10px', marginBottom: '10px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', display: 'flex', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', justifyContent: 'center' }}>
              <button type="button" onClick={() => handleMoveContentBlock(idx, -1)} disabled={idx === 0} style={{ padding: '2px 5px', cursor: 'pointer' }}>↑</button>
              <button type="button" onClick={() => handleMoveContentBlock(idx, 1)} disabled={idx === formData.contentBlocks.length - 1} style={{ padding: '2px 5px', cursor: 'pointer' }}>↓</button>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <strong style={{ fontSize: '13px' }}>Block {idx + 1} ({block.blockType})</strong>
                <button type="button" onClick={() => handleRemoveContentBlock(idx)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Xóa</button>
              </div>
              {block.blockType === 'TEXT' ? (
                <textarea 
                  value={block.content} 
                  onChange={(e) => handleContentBlockChange(idx, 'content', e.target.value)} 
                  rows={4} style={{...styles.input, resize: 'vertical'}} placeholder="Nội dung văn bản..."
                />
              ) : (
                <FileUploadInput name={`blockImage_${idx}`} value={block.imageUrl} onChange={(e) => handleContentBlockChange(idx, 'imageUrl', e.target.value)} placeholder="Tải ảnh lên" accept="image/*" />
              )}
            </div>
          </div>
        ))}
        <div style={{ marginTop: '10px' }}>
          <button type="button" onClick={() => handleAddContentBlock('TEXT')} className="btn btn-outline" style={{ marginRight: '10px' }}>+ Thêm đoạn văn bản</button>
          <button type="button" onClick={() => handleAddContentBlock('IMAGE')} className="btn btn-outline">+ Thêm hình ảnh</button>
        </div>
      </div>

      <div style={{ marginBottom: '15px', display: 'none' }}>
        {/* Giữ passage fallback ẩn cho tương thích */}
        <label style={styles.label}>Đoạn văn (Passage) (*)</label>
        <textarea 
          name="passage" 
          value={formData.passage} 
          onChange={handleChange} 
          rows={8} 
          style={{...styles.input, resize: 'vertical', fontFamily: 'inherit'}} 
          placeholder="Nhập nội dung đoạn văn..."
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
        <button type="submit" className="btn btn-primary">Lưu Nhóm Part 7</button>
      </div>
    </form>
  );
};

const styles = {
  label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#34495e', fontSize: '0.9rem' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', outline: 'none', transition: 'border-color 0.3s' },
  footer: { textAlign: 'right', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }
};

export default GroupPart7Form;
