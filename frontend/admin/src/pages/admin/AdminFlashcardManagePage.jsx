import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSystemDecks, adminCreateSystemDeck, adminUpdateSystemDeck, adminDeleteSystemDeck } from '../../services/api';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';

const AdminFlashcardManagePage = () => {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  
  const [formData, setFormData] = useState({
    listName: '',
    description: ''
  });

  useEffect(() => {
    fetchSystemDecks();
  }, []);

  const fetchSystemDecks = async () => {
    try {
      const res = await getSystemDecks();
      setDecks(res.data || []);
    } catch (err) {
      console.error(err);
      alert('Lỗi tải danh sách system decks');
    }
  };

  const handleOpenModal = (deck = null) => {
    if (deck) {
      setEditingDeck(deck);
      setFormData({
        listName: deck.listName || '',
        description: deck.description || ''
      });
    } else {
      setEditingDeck(null);
      setFormData({ listName: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDeck) {
        await adminUpdateSystemDeck(editingDeck.id, formData);
        alert('Cập nhật thành công');
      } else {
        await adminCreateSystemDeck(formData);
        alert('Tạo mới thành công');
      }
      setIsModalOpen(false);
      fetchSystemDecks();
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (deck) => {
    if (window.confirm(`Bạn có chắc muốn xóa bộ từ vựng "${deck.listName}"?`)) {
      try {
        await adminDeleteSystemDeck(deck.id);
        alert('Xóa thành công');
        fetchSystemDecks();
      } catch (err) {
        alert(err.message || 'Có lỗi xảy ra');
      }
    }
  };

  const handleViewFlashcards = (deck) => {
    navigate(`/admin/flashcards/${deck.id}`);
  };

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Quản lý Bộ Từ Vựng Hệ Thống</h1>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Danh sách System Decks</h2>
          <button className="btn btn-primary" style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleOpenModal()}>
            + Thêm Bộ Từ Vựng
          </button>
        </div>

        <DataTable 
          columns={[
            { header: 'ID', accessor: 'id' },
            { header: 'Tên Bộ Từ Vựng', accessor: 'listName' },
            { header: 'Mô tả', accessor: 'description' },
            { header: 'Số lượng từ', accessor: 'wordCount' }
          ]}
          data={decks}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          customActions={[
            { label: 'Từ vựng', color: '#f39c12', onClick: handleViewFlashcards }
          ]}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDeck ? 'Sửa Bộ Từ Vựng' : 'Thêm Bộ Từ Vựng'}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tên Bộ Từ Vựng *</label>
            <input 
              type="text" 
              required
              value={formData.listName}
              onChange={(e) => setFormData({...formData, listName: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mô tả</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 16px', border: '1px solid #ccc', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer' }}>
              Hủy
            </button>
            <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Lưu
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminFlashcardManagePage;
