import React, { useRef, useState } from 'react';
import { getAudioJob, uploadAudio } from '../../services/api';

const POLL_INTERVAL_MS = 2500;
const MAX_POLLS = 120;

const AudioUploadField = ({ value, onChange, name, placeholder, style }) => {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setStatus('Đang tải audio lên...');
    setError('');

    try {
      const uploadResponse = await uploadAudio(file);
      setStatus('Đang xử lý audio...');
      const completedJob = await waitForJob(uploadResponse.jobId);
      onChange({ target: { name, value: completedJob.audioUrl } });
      setStatus('Xử lý audio hoàn tất');
    } catch (err) {
      setError(err.message || 'Lỗi khi tải audio lên');
      setStatus('');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const waitForJob = async (jobId) => {
    for (let attempt = 0; attempt < MAX_POLLS; attempt += 1) {
      const job = await getAudioJob(jobId);
      if (job.status === 'COMPLETED') {
        return job;
      }
      if (job.status === 'FAILED' || job.status === 'CANCELLED') {
        throw new Error(job.errorMessage || 'Xử lý audio thất bại');
      }
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
    }
    throw new Error('Xử lý audio quá thời gian chờ');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', ...style }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder || 'URL audio hoặc tải lên...'}
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
          {uploading ? 'Đang xử lý...' : 'Chọn Audio'}
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
        accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.webm"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {status && <span style={{ color: '#2980b9', fontSize: '0.85rem' }}>{status}</span>}
      {error && <span style={{ color: 'red', fontSize: '0.85rem' }}>{error}</span>}
    </div>
  );
};

export default AudioUploadField;
