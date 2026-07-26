import React, { useState, useEffect } from 'react';
import MediaPreview from './MediaPreview';
import NestedQuestionList from './NestedQuestionList';
import FileUploadInput from '../../common/FileUploadInput';
import AudioUploadField from '../../common/AudioUploadField';
import { getTopicsBySection } from '../../../services/api';

const GroupPart34Form = ({ initialData, onSave, onCancel, isPracticeTopic, sectionId, sectionSlug, topicSlug }) => {
  const [topics, setTopics] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    orderIndex: 1,
    sourceTopicId: '',
    audioUrl: '',
    imageUrl: '', // Optional for graphic questions
    passage: '',
    questions: []
  });

  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('');

  useEffect(() => {
    if (initialData) {
      const qs = initialData.questions && initialData.questions.length > 0 
        ? initialData.questions 
        : [
            { questionNumber: 1, content: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', explanation: '' },
            { questionNumber: 2, content: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', explanation: '' },
            { questionNumber: 3, content: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', explanation: '' }
          ];
      setFormData({ ...formData, ...initialData, questions: qs, sourceTopicId: initialData.sourceTopicId || '' });
      
      if (initialData.passage) {
        const parts = initialData.passage.split('---');
        let t1 = parts[0] ? parts[0].trim() : '';
        let t2 = parts[1] ? parts[1].trim() : '';
        if (t1.toLowerCase().startsWith('transcript')) {
          t1 = t1.substring(10).trim();
        }
        if (t2.toLowerCase().startsWith('dịch nghĩa')) {
          t2 = t2.substring(10).trim();
        }
        setTranscript(t1);
        setTranslation(t2);
      }
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
    
    let builtPassage = '';
    if (transcript || translation) {
      builtPassage = `Transcript\n\n${transcript}\n\n---\n\nDịch nghĩa\n\n${translation}`;
    }
    
    onSave({ ...formData, passage: builtPassage });
  };

  const fileNamePrefix = (sectionSlug && topicSlug && formData.orderIndex) ? `${sectionSlug}_${topicSlug}_q${formData.orderIndex}` : null;

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: isPracticeTopic ? '100px 1fr' : '100px', gap: '15px', marginBottom: '15px' }}>
        <div>
          <label style={styles.label}>Nhóm số</label>
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
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '5px' }}>
        <div>
          <label style={styles.label}>Audio URL / Tải audio lên (*)</label>
          <AudioUploadField name="audioUrl" value={formData.audioUrl} onChange={handleChange} placeholder="https://..." />
        </div>
        <div>
          <label style={styles.label}>Image URL / Tải ảnh lên (Tùy chọn - Dành cho câu Graphic)</label>
          <FileUploadInput name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." accept="image/*" fileName={fileNamePrefix ? `${fileNamePrefix}_img` : null} subPath="exercises/part34/images" />
        </div>
      </div>
      
      <MediaPreview imageUrl={formData.imageUrl} audioUrl={formData.audioUrl} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
        <div>
          <label style={{ ...styles.label, color: '#2980b9' }}>Transcript (Tiếng Anh)</label>
          <textarea 
            value={transcript} 
            onChange={(e) => setTranscript(e.target.value)} 
            style={{...styles.input, height: '200px', resize: 'vertical', border: '1px solid #3498db'}} 
            placeholder="Nhập nội dung bài nghe tiếng Anh..." 
          />
        </div>
        <div>
          <label style={{ ...styles.label, color: '#27ae60' }}>Dịch nghĩa (Tiếng Việt)</label>
          <textarea 
            value={translation} 
            onChange={(e) => setTranslation(e.target.value)} 
            style={{...styles.input, height: '200px', resize: 'vertical', border: '1px solid #2ecc71'}} 
            placeholder="Nhập nội dung dịch tiếng Việt..." 
          />
        </div>
      </div>

      <NestedQuestionList 
        questions={formData.questions} 
        onChange={handleQuestionChange} 
        onAdd={handleAddQuestion} 
        onRemove={handleRemoveQuestion} 
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
