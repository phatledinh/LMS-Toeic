import React, { useState, useEffect } from 'react';
import MediaPreview from './MediaPreview';
import NestedQuestionList from './NestedQuestionList';
import FileUploadInput from '../../common/FileUploadInput';
import { getTopicsBySection } from '../../../services/api';

const emptyQuestion = { questionNumber: 1, content: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', explanation: '' };
const emptyImageBlock = { blockType: 'IMAGE', content: '', imageUrl: '', orderIndex: 1 };

const GroupPart67Form = ({ initialData, onSave, onCancel, isPracticeTopic, sectionId, sectionSlug, topicSlug }) => {
  const [topics, setTopics] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    orderIndex: 1,
    sourceTopicId: '',
    audioUrl: '',
    imageUrl: '', 
    passage: '',
    contentBlocks: [emptyImageBlock],
    questions: [emptyQuestion]
  });

  useEffect(() => {
    if (initialData) {
      const qs = initialData.questions && initialData.questions.length > 0
        ? initialData.questions
        : [emptyQuestion];
      const cb = initialData.contentBlocks && initialData.contentBlocks.length > 0
        ? initialData.contentBlocks.sort((a,b) => a.orderIndex - b.orderIndex)
        : (initialData.imageUrl ? [{ blockType: 'IMAGE', content: '', imageUrl: initialData.imageUrl, orderIndex: 1 }] : [emptyImageBlock]);
      setFormData({ ...formData, ...initialData, questions: qs, contentBlocks: cb, sourceTopicId: initialData.sourceTopicId || '' });
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

  const handleAddQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { ...emptyQuestion, questionNumber: prev.questions.length + 1 }
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
    setFormData(prev => {
      const blocks = prev.contentBlocks || [];
      const newBlock = {
        blockType: type,
        content: '',
        imageUrl: '',
        orderIndex: blocks.length + 1
      };
      return { ...prev, contentBlocks: [...blocks, newBlock] };
    });
  };

  const handleAddImageBlock = () => handleAddContentBlock('IMAGE');

  const handleContentBlockChange = (index, field, value) => {
    setFormData(prev => {
      const blocks = [...(prev.contentBlocks || [])];
      blocks[index][field] = value;
      return { ...prev, contentBlocks: blocks };
    });
  };

  const handleRemoveContentBlock = (index) => {
    setFormData(prev => {
      const blocks = [...(prev.contentBlocks || [])];
      blocks.splice(index, 1);
      // Cập nhật lại orderIndex
      blocks.forEach((b, i) => b.orderIndex = i + 1);
      return { ...prev, contentBlocks: blocks };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasImageBlocks = formData.contentBlocks && formData.contentBlocks.some(b => b.blockType === 'IMAGE' && b.imageUrl);
    if (!hasLegacyContent && !hasImageBlocks) {
      alert("Vui lòng tải ít nhất một ảnh cho Part 6/7.");
      return;
    }
    if (formData.contentBlocks && formData.contentBlocks.some(b => b.blockType === 'TEXT')) {
      alert("Part 6/7 hiện chỉ dùng ảnh, vui lòng xóa các block text.");
      return;
    }
    onSave(formData);
  };

  const fileNamePrefix = (sectionSlug && topicSlug && formData.orderIndex) ? `${sectionSlug}_${topicSlug}_q${formData.orderIndex}` : null;

  const hasLegacyContent = (!formData.contentBlocks || formData.contentBlocks.length === 0) && (formData.passage || formData.imageUrl);

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: isPracticeTopic ? '100px 1fr' : '120px', gap: '15px', marginBottom: '15px' }}>
        <div>
          <label style={styles.label}>Nhóm số <span style={{color: 'red'}}>*</span></label>
          <input type="number" name="orderIndex" value={formData.orderIndex} onChange={handleChange} required style={styles.input} />
        </div>
        {isPracticeTopic && (
          <div>
            <label style={styles.label}>Thuộc chủ đề</label>
            <select name="sourceTopicId" value={formData.sourceTopicId} onChange={handleChange} style={styles.input} required>
              <option value="">-- Chọn chủ đề --</option>
              {topics.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {hasLegacyContent && formData.imageUrl && (
        <div style={{ padding: '15px', backgroundColor: '#fff3e0', border: '1px solid #ffcc80', borderRadius: '8px', marginBottom: '15px' }}>
          <p style={{ color: '#e65100', margin: '0 0 10px 0', fontSize: '0.9rem' }}><i>* Cảnh báo: Nhóm này đang dùng dữ liệu ảnh cũ. Hãy dùng "Thêm Hình Ảnh" ở phần Content Blocks bên dưới để thay thế.</i></p>
          <div>
            <label style={styles.label}>Image URL (Cũ)</label>
            <FileUploadInput name="imageUrl" value={formData.imageUrl} onChange={handleChange} accept="image/*" fileName={fileNamePrefix ? `${fileNamePrefix}_img` : null} subPath="exercises/part67/images" />
            <MediaPreview imageUrl={formData.imageUrl} />
          </div>
        </div>
      )}

      <div style={{ marginBottom: '20px', border: '1px solid #3498db', borderRadius: '8px', padding: '15px', backgroundColor: '#f8f9fa' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <label style={{...styles.label, marginBottom: 0, color: '#2980b9', fontSize: '1.1rem'}}>Nội dung bài đọc (Content Blocks)</label>
          <div style={{ display: 'flex', gap: '10px' }}>
             <button type="button" onClick={handleAddImageBlock} className="btn" style={{ padding: '6px 12px', backgroundColor: '#e1f5fe', color: '#0277bd', border: '1px solid #81d4fa', fontWeight: 'bold' }}>+ Thêm Hình Ảnh</button>
          </div>
        </div>

        {formData.contentBlocks && formData.contentBlocks.map((block, idx) => (
          <div key={idx} style={{ padding: '15px', border: '1px solid #ced4da', borderRadius: '6px', marginBottom: '15px', backgroundColor: '#fff', position: 'relative' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
               <strong style={{ color: '#0277bd', fontSize: '1.05rem' }}>
                 Block {idx + 1}: Hình ảnh (Image)
               </strong>
               <button type="button" onClick={() => handleRemoveContentBlock(idx)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontWeight: 'bold', padding: '5px' }}>✕ Xóa</button>
             </div>
                 <FileUploadInput
                   name={`cb_img_${idx}`}
                   value={block.imageUrl || ''}
                   onChange={(e) => handleContentBlockChange(idx, 'imageUrl', e.target.value)}
                   placeholder="https://..."
                   accept="image/*"
                   fileName={fileNamePrefix ? `${fileNamePrefix}_block${idx}_img` : null}
                   subPath="exercises/part67/images"
                />
                <MediaPreview imageUrl={block.imageUrl} />
          </div>
        ))}
        {(!formData.contentBlocks || formData.contentBlocks.length === 0) && (
           <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fff', border: '1px dashed #bdc3c7', borderRadius: '6px', color: '#7f8c8d' }}>
             Chưa có nội dung nào. Bấm nút <b>+ Thêm Đoạn Text</b> hoặc <b>+ Thêm Hình Ảnh</b> ở trên để tạo nội dung bài đọc.
           </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{...styles.label, color: '#27ae60'}}>Dịch nghĩa toàn bài (Tùy chọn)</label>
        {hasLegacyContent && formData.passage && (
          <p style={{ color: '#e74c3c', margin: '0 0 10px 0', fontSize: '0.9rem' }}>
            <i>⚠️ Lưu ý: Bài cũ đang lưu Tiếng Anh ở ô này. Hãy copy đoạn này lên "Thêm Đoạn Text" (Content Block) ở trên, sau đó điền bản dịch Tiếng Việt vào đây.</i>
          </p>
        )}
        <textarea 
          name="passage" 
          value={formData.passage || ''} 
          onChange={handleChange} 
          rows={6} 
          style={{...styles.input, resize: 'vertical', fontFamily: 'inherit', border: '1px solid #2ecc71'}} 
          placeholder="Nhập bản dịch tiếng Việt cho toàn bộ bài đọc..." 
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
