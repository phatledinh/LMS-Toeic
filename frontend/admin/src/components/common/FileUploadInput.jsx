import React, { useState, useRef } from 'react';
import { uploadFile } from '../../services/api';

const FileUploadInput = ({ value, onChange, name, placeholder, accept = "image/*,audio/*", style, fileName, subPath }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');
    
    try {
      const response = await uploadFile(file, subPath, fileName);
      if (response && response.url) {
        // Thêm tham số cache-buster để trình duyệt tải lại file mới thay vì dùng file cũ trong cache
        const separator = response.url.includes('?') ? '&' : '?';
        const cacheBusterUrl = `${response.url}${separator}t=${Date.now()}`;
        
        // Mock a change event to update the parent form
        onChange({ target: { name, value: cacheBusterUrl } });
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi tải file lên');
    } finally {
      setUploading(false);
      // Reset input value so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', ...style }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder || 'URL file hoặc tải lên...'}
          style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            opacity: uploading ? 0.7 : 1,
            whiteSpace: 'nowrap'
          }}
        >
          {uploading ? 'Đang tải...' : 'Chọn File'}
        </button>
        
        {value && (
          <button
            type="button"
            onClick={() => onChange({ target: { name, value: '' } })}
            style={{
              padding: '8px 12px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
            title="Xóa đường dẫn hiện tại"
          >
            Xóa
          </button>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      {error && <span style={{ color: 'red', fontSize: '0.85rem' }}>{error}</span>}
    </div>
  );
};

export default FileUploadInput;
