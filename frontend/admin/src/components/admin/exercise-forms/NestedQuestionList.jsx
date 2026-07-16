import React from 'react';

const NestedQuestionList = ({ questions, onChange, onAdd, onRemove }) => {
  return (
    <div style={{ marginTop: '20px', borderTop: '2px dashed #ecf0f1', paddingTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#2c3e50', fontWeight: 'bold' }}>📋 Danh sách Câu hỏi</h3>
        <button type="button" className="btn btn-primary" onClick={onAdd} style={{ padding: '8px 16px', fontSize: '0.9rem', borderRadius: '6px', backgroundColor: '#27ae60', border: 'none', fontWeight: 'bold' }}>
          + Thêm câu hỏi
        </button>
      </div>
      
      {questions.map((q, idx) => (
        <div key={idx} style={{ 
          backgroundColor: '#ffffff', 
          padding: '20px', 
          borderRadius: '10px', 
          marginBottom: '20px', 
          position: 'relative', 
          border: '1px solid #e0e0e0',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <button 
            type="button" 
            onClick={() => onRemove(idx)} 
            style={{ 
              position: 'absolute', top: '15px', right: '15px', background: '#e74c3c', color: 'white', border: 'none', 
              borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem',
              transition: 'background-color 0.2s'
            }}
            title="Xóa câu hỏi này"
          >
            &times;
          </button>
          
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={styles.label}>Câu số</label>
              <input type="number" placeholder="VD: 1" value={q.questionNumber} onChange={e => onChange(idx, 'questionNumber', e.target.value)} style={styles.input} required />
            </div>
            <div>
              <label style={styles.label}>Nội dung câu hỏi</label>
              <input type="text" placeholder="Nhập câu hỏi..." value={q.content} onChange={e => onChange(idx, 'content', e.target.value)} style={styles.input} required />
            </div>
            <div>
              <label style={styles.label}>Đáp án đúng</label>
              <select value={q.correctAnswer} onChange={e => onChange(idx, 'correctAnswer', e.target.value)} style={styles.select}>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={styles.optionLabel}>A.</label>
              <input type="text" placeholder="Option A" value={q.optionA} onChange={e => onChange(idx, 'optionA', e.target.value)} style={styles.input} required />
            </div>
            <div>
              <label style={styles.optionLabel}>B.</label>
              <input type="text" placeholder="Option B" value={q.optionB} onChange={e => onChange(idx, 'optionB', e.target.value)} style={styles.input} required />
            </div>
            <div>
              <label style={styles.optionLabel}>C.</label>
              <input type="text" placeholder="Option C" value={q.optionC} onChange={e => onChange(idx, 'optionC', e.target.value)} style={styles.input} required />
            </div>
            <div>
              <label style={styles.optionLabel}>D.</label>
              <input type="text" placeholder="Option D" value={q.optionD} onChange={e => onChange(idx, 'optionD', e.target.value)} style={styles.input} required />
            </div>
          </div>

          <div>
            <label style={styles.label}>💡 Giải thích đáp án (Tùy chọn)</label>
            <textarea 
              placeholder="Giải thích vì sao chọn đáp án này..." 
              value={q.explanation || ''} 
              onChange={e => onChange(idx, 'explanation', e.target.value)} 
              style={{ ...styles.input, resize: 'vertical', minHeight: '60px' }} 
            />
          </div>
        </div>
      ))}
      
      {questions.length === 0 && (
        <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '30px 0', border: '1px dashed #bdc3c7', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
          Chưa có câu hỏi nào. Hãy bấm <strong>+ Thêm câu hỏi</strong> để bắt đầu.
        </div>
      )}
    </div>
  );
};

const styles = {
  label: { display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#34495e', fontSize: '0.85rem' },
  optionLabel: { display: 'inline-block', marginBottom: '6px', fontWeight: 'bold', color: '#2980b9', fontSize: '0.9rem' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem' },
  select: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', outline: 'none', backgroundColor: '#fff', fontSize: '0.95rem', fontWeight: 'bold', color: '#27ae60' }
};

export default NestedQuestionList;
