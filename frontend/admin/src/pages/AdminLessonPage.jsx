import React, { useState, useEffect } from 'react';
import { getSections, getTopicsBySection, getLessonsByTopic, adminCreateLesson, adminUpdateLesson, adminDeleteLesson } from '../services/api';
import { processVideoOnServer, isVideoServerUrl, getVideoServerUrl, setVideoServerUrl } from '../services/videoServerApi';
import DataTable from '../components/admin/DataTable';
import Modal from '../components/admin/Modal';
import HlsVideoPlayer from '../components/common/HlsVideoPlayer';

const VIDEO_STATUS_LABEL = {
  uploading: 'Đang tải file lên storage...',
  creating: 'Đang khởi tạo xử lý video...',
  processing: 'Đang convert sang HLS (có thể mất vài chục giây)...',
  ready: 'Xử lý xong!',
};

const AdminLessonPage = () => {
  const [sections, setSections] = useState([]);
  const [topics, setTopics] = useState([]);
  const [lessons, setLessons] = useState([]);
  
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  // Modal & Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    durationMinutes: 0,
    orderIndex: 0,
    isActive: true,
    videoUrl: '',
    docUrl: '',
    docFileName: '',
  });
  const [videoUploadStatus, setVideoUploadStatus] = useState('');
  const [videoUploadError, setVideoUploadError] = useState('');
  const [videoServerUrlInput, setVideoServerUrlInput] = useState(getVideoServerUrl());

  useEffect(() => {
    getSections().then(res => setSections(res.data || [])).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedSection) {
      getTopicsBySection(selectedSection).then(res => setTopics(res.data || [])).catch(err => console.error(err));
      setSelectedTopic('');
      setLessons([]);
    } else {
      setTopics([]);
      setLessons([]);
    }
  }, [selectedSection]);

  useEffect(() => {
    if (selectedTopic) {
      fetchLessons();
    } else {
      setLessons([]);
    }
  }, [selectedTopic]);

  const fetchLessons = async () => {
    try {
      const res = await getLessonsByTopic(selectedTopic);
      setLessons(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const getDriveEmbedUrl = (url) => {
    if (!url) return '';
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return '';
  };

  const openModal = (lesson = null) => {
    setEditingItem(lesson);
    if (lesson) {
      setFormData({
        title: lesson.title,
        durationMinutes: lesson.durationMinutes || 0,
        orderIndex: lesson.orderIndex || 0,
        isActive: lesson.isActive !== false,
        videoUrl: lesson.videoUrl || '',
        docUrl: lesson.docUrl || '',
        docFileName: lesson.docFileName || '',
      });
    } else {
      setFormData({ title: '', durationMinutes: 0, orderIndex: 0, isActive: true, videoUrl: '', docUrl: '', docFileName: '' });
    }
    setVideoUploadStatus('');
    setVideoUploadError('');
    setIsModalOpen(true);
  };

  const handleVideoServerUrlChange = (e) => {
    const val = e.target.value;
    setVideoServerUrlInput(val);
    setVideoServerUrl(val);
  };

  const handleVideoFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoUploadError('');
    try {
      const streamUrl = await processVideoOnServer(file, setVideoUploadStatus);
      setFormData(prev => ({ ...prev, videoUrl: streamUrl }));
    } catch (err) {
      setVideoUploadError(err.message || 'Xử lý video thất bại');
    } finally {
      setVideoUploadStatus('');
      e.target.value = '';
    }
  };

  const saveLesson = async (e) => {
    e.preventDefault();
    if (!selectedTopic) return;
    try {
      if (editingItem) {
        await adminUpdateLesson(editingItem.id, formData);
        alert('Cập nhật bài học thành công!');
      } else {
        await adminCreateLesson(selectedTopic, formData);
        alert('Lưu bài học thành công!');
      }
      setIsModalOpen(false);
      fetchLessons();
    } catch (err) {
      alert(err.message || 'Lỗi khi lưu bài học');
    }
  };

  const deleteLesson = async (lesson) => {
    if (!window.confirm(`Bạn có chắc xóa bài học "${lesson.title}"?`)) return;
    try {
      await adminDeleteLesson(lesson.id);
      alert('Xóa thành công');
      fetchLessons();
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa');
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Quản lý Bài học</h1>

      <div style={{ marginBottom: '20px', backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          🎬 Video Server URL{' '}
          <span style={{ fontWeight: 'normal', color: '#7f8c8d', fontSize: '0.85rem' }}>
            (URL của spring-video — sửa khi host qua Cloudflare Tunnel/ngrok/domain khác)
          </span>
        </label>
        <input
          type="text"
          value={videoServerUrlInput}
          onChange={handleVideoServerUrlChange}
          placeholder="http://localhost:8082"
          style={{ width: '100%', maxWidth: '500px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="form-select" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px' }}>
          <option value="">-- Chọn Section --</option>
          {sections.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
        <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} disabled={!selectedSection} className="form-select" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px' }}>
          <option value="">-- Chọn Topic --</option>
          {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
        <button onClick={() => openModal()} disabled={!selectedTopic} className="btn btn-primary" style={{ padding: '8px 16px', opacity: selectedTopic ? 1 : 0.5 }}>
          + Thêm Bài Học Mới
        </button>
      </div>

      {selectedTopic ? (
        <DataTable 
          columns={[
            { header: 'ID', accessor: 'id' },
            { header: 'Tiêu đề', accessor: 'title' },
            { header: 'Thời lượng', render: row => `${row.durationMinutes || 0} phút` },
            { header: 'Thứ tự', accessor: 'orderIndex' },
            { header: 'Trạng thái', render: row => row.isActive !== false ? <span style={{ color: 'green' }}>Active</span> : <span style={{ color: 'red' }}>Inactive</span> }
          ]}
          data={lessons}
          onEdit={openModal}
          onDelete={deleteLesson}
        />
      ) : (
        <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '40px 0', backgroundColor: 'white', borderRadius: '8px' }}>
          Vui lòng chọn Section và Topic để xem danh sách bài học.
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Sửa bài học' : 'Thêm bài học mới'}>
        <form onSubmit={saveLesson}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tiêu đề (*)</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Thời lượng (phút)</label>
              <input type="number" name="durationMinutes" value={formData.durationMinutes} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Thứ tự hiển thị</label>
              <input type="number" name="orderIndex" value={formData.orderIndex} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Link Google Drive Video</label>
            <input type="text" name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} placeholder="https://drive.google.com/file/d/..." style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hoặc tải video MP4 lên (tự động convert HLS)</label>
            <input
              type="file"
              accept="video/mp4"
              onChange={handleVideoFileChange}
              disabled={!!videoUploadStatus}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            {videoUploadStatus && (
              <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: '#2980b9' }}>
                ⏳ {VIDEO_STATUS_LABEL[videoUploadStatus] || videoUploadStatus}
              </p>
            )}
            {videoUploadError && (
              <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: '#e74c3c' }}>⚠ {videoUploadError}</p>
            )}

            {formData.videoUrl && (
              <div style={{ marginTop: '10px', border: '1px solid #eee', padding: '5px', borderRadius: '4px' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '0.85rem', color: '#7f8c8d' }}>Preview Video:</p>
                {isVideoServerUrl(formData.videoUrl) ? (
                  <HlsVideoPlayer src={formData.videoUrl} style={{ width: '100%', maxHeight: 250 }} />
                ) : getDriveEmbedUrl(formData.videoUrl) ? (
                  <iframe src={getDriveEmbedUrl(formData.videoUrl)} width="100%" height="250" allow="autoplay" style={{ border: 'none' }}></iframe>
                ) : null}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Link Google Drive Tài liệu</label>
            <input type="text" name="docUrl" value={formData.docUrl} onChange={handleInputChange} placeholder="https://drive.google.com/file/d/..." style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
             <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tên Tài Liệu (hiển thị)</label>
              <input type="text" name="docFileName" value={formData.docFileName} onChange={handleInputChange} placeholder="VD: document.pdf" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', paddingBottom: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} />
                <b>Kích hoạt (Active)</b>
              </label>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginTop: '20px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ marginRight: '10px', padding: '8px 16px' }} className="btn">Hủy</button>
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>Lưu Bài Học</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminLessonPage;
