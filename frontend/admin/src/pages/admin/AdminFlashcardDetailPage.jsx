import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeckById, adminAddSystemFlashcard, adminUpdateSystemFlashcard, adminDeleteSystemFlashcard, uploadFile, SERVER_URL } from '../../services/api';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';

const AdminFlashcardDetailPage = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    word: '',
    phonetic: '',
    partOfSpeech: '',
    meaningVi: '',
    meaningEn: '',
    examples: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchDeckDetails();
  }, [deckId]);

  const fetchDeckDetails = async () => {
    try {
      const res = await getDeckById(deckId);
      if (res.data) {
        setDeck(res.data);
        setFlashcards(res.data.flashCards || []);
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi tải chi tiết bộ từ vựng');
    }
  };

  const handleOpenModal = (card = null) => {
    if (card) {
      setEditingCard(card);
      setFormData({
        word: card.word || '',
        phonetic: card.phonetic || '',
        partOfSpeech: card.partOfSpeech || '',
        meaningVi: card.meaningVi || '',
        meaningEn: card.meaningEn || '',
        examples: card.examples || '',
        imageUrl: card.imageUrl || ''
      });
    } else {
      setEditingCard(null);
      setFormData({ word: '', phonetic: '', partOfSpeech: '', meaningVi: '', meaningEn: '', examples: '', imageUrl: '' });
    }
    setIsUploading(false);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      let fileName = null;
      if (formData.word) {
        const safeWord = formData.word.trim().replace(/[\\/*?:"<>|]/g, '');
        const extension = file.name.substring(file.name.lastIndexOf('.'));
        fileName = `flashcard/${safeWord}${extension}`;
      } else {
        const extension = file.name.substring(file.name.lastIndexOf('.'));
        fileName = `flashcard/temp_${Date.now()}${extension}`;
      }

      const res = await uploadFile(file, fileName);
      if (res.url) {
        setFormData({ ...formData, imageUrl: res.url });
      } else {
        alert('Tải ảnh thất bại: Không nhận được URL từ server');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tải ảnh lên: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCard) {
        await adminUpdateSystemFlashcard(editingCard.id, formData);
        alert('Cập nhật thành công');
      } else {
        await adminAddSystemFlashcard(deckId, formData);
        alert('Thêm từ vựng thành công');
      }
      setIsModalOpen(false);
      fetchDeckDetails();
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (card) => {
    if (window.confirm(`Bạn có chắc muốn xóa từ "${card.word}"?`)) {
      try {
        await adminDeleteSystemFlashcard(card.id);
        alert('Xóa thành công');
        fetchDeckDetails();
      } catch (err) {
        alert(err.message || 'Có lỗi xảy ra');
      }
    }
  };

  if (!deck) return <div>Đang tải...</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
        <button onClick={() => navigate('/admin/flashcards')} style={{ padding: '6px 12px', background: '#ecf0f1', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          &larr; Quay lại
        </button>
        <h1 style={{ margin: 0 }}>Từ vựng: {deck.listName}</h1>
      </div>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Danh sách Flashcards ({flashcards.length})</h2>
          <button className="btn btn-primary" style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleOpenModal()}>
            + Thêm Từ Vựng
          </button>
        </div>

        <DataTable 
          columns={[
            { 
              header: 'Ảnh', 
              accessor: 'imageUrl',
              render: (row) => row.imageUrl ? (
                <img 
                  src={row.imageUrl.startsWith('/uploads') ? `${SERVER_URL}${row.imageUrl}` : row.imageUrl} 
                  alt={row.word} 
                  style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee'}} 
                  onError={(e) => e.target.style.display = 'none'}
                />
              ) : <span style={{color: '#bdc3c7'}}>Không có</span>
            },
            { header: 'Từ', accessor: 'word' },
            { header: 'Loại từ', accessor: 'partOfSpeech' },
            { header: 'Phiên âm', accessor: 'phonetic' },
            { header: 'Nghĩa (VI)', accessor: 'meaningVi' }
          ]}
          data={flashcards}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCard ? 'Sửa Từ Vựng' : 'Thêm Từ Vựng'}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Từ (Word) *</label>
            <input type="text" required value={formData.word} onChange={(e) => setFormData({...formData, word: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phiên âm</label>
            <input type="text" value={formData.phonetic} onChange={(e) => setFormData({...formData, phonetic: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Loại từ (vd: (n), (v))</label>
            <input type="text" value={formData.partOfSpeech} onChange={(e) => setFormData({...formData, partOfSpeech: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nghĩa Tiếng Việt *</label>
            <textarea required value={formData.meaningVi} onChange={(e) => setFormData({...formData, meaningVi: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px' }} />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nghĩa Tiếng Anh (Tùy chọn)</label>
            <textarea value={formData.meaningEn} onChange={(e) => setFormData({...formData, meaningEn: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px' }} />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ví dụ (JSON string or text)</label>
            <textarea value={formData.examples} onChange={(e) => setFormData({...formData, examples: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px' }} placeholder='["Example 1", "Example 2"]' />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hình ảnh (Tùy chọn)</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '10px' }} placeholder="Nhập URL hoặc tải ảnh lên" />
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'block' }} disabled={isUploading} />
                {isUploading && <span style={{ fontSize: '12px', color: '#3498db', marginTop: '5px', display: 'inline-block' }}>Đang tải ảnh lên...</span>}
              </div>
              {formData.imageUrl && (
                <div style={{ width: '100px', height: '100px', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
                  <img src={formData.imageUrl.startsWith('/uploads') ? `${SERVER_URL}${formData.imageUrl}` : formData.imageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
            </div>
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 16px', border: '1px solid #ccc', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer' }}>Hủy</button>
            <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Lưu</button>
          </div>

        </form>
      </Modal>
    </div>
  );
};

export default AdminFlashcardDetailPage;
