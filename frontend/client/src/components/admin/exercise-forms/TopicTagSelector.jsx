import React from 'react';

const TopicTagSelector = ({ title, topics = [], selectedTags = [], onChange, tagType }) => {
  const toggleTopicTag = (topicId) => {
    let newTags = [...selectedTags];
    const existing = newTags.find(t => t.topicId === topicId && t.tagType === tagType);
    if (existing) {
      newTags = newTags.filter(t => t !== existing);
    } else {
      newTags.push({ topicId, tagType });
    }
    onChange(newTags);
  };

  return (
    <div>
      <strong style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>{title}</strong>
      <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #eee', padding: '5px', borderRadius: '4px' }}>
        {topics.map(t => (
          <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px', fontSize: '13px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={selectedTags.some(tag => tag.topicId === t.id && tag.tagType === tagType)} 
              onChange={() => toggleTopicTag(t.id)} 
            />
            {t.title}
          </label>
        ))}
        {topics.length === 0 && <span style={{fontSize: '12px', color: '#999'}}>Không có dữ liệu</span>}
      </div>
    </div>
  );
};

export default TopicTagSelector;
