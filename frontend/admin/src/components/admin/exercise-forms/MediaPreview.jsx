import React from 'react';
import { getFullUrl } from '../../../utils/urlUtils';

const MediaPreview = ({ imageUrl, audioUrl }) => {
  return (
    <div style={{ display: 'flex', gap: '20px', marginTop: '10px', marginBottom: '15px' }}>
      {imageUrl && (
        <div style={{ flex: 1, border: '1px dashed #bdc3c7', padding: '10px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#f8f9fa' }}>
          <p style={{ fontSize: '0.85rem', color: '#7f8c8d', margin: '0 0 5px 0' }}>Image Preview</p>
          <img src={getFullUrl(imageUrl)} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
        </div>
      )}
      {audioUrl && (
        <div style={{ flex: 1, border: '1px dashed #bdc3c7', padding: '10px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#f8f9fa', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#7f8c8d', margin: '0 0 10px 0' }}>Audio/Video Preview</p>
          <audio key={audioUrl} controls src={getFullUrl(audioUrl)} style={{ width: '100%' }} onError={(e) => console.log('Audio error')} />
        </div>
      )}
    </div>
  );
};

export default MediaPreview;
