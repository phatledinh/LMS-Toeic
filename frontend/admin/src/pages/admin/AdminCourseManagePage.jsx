import React, { useState, useEffect } from 'react';
import { 
  getSections, adminCreateSection, adminUpdateSection, adminDeleteSection,
  getTopicsBySection, adminCreateTopic, adminUpdateTopic, adminDeleteTopic 
} from '../../services/api';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';

const AdminCourseManagePage = () => {
  const [sections, setSections] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);

  // Modal states
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [formData, setFormData] = useState({ title: '', description: '', slug: '', orderIndex: 0 });

  useEffect(() => {
    fetchSections();
  }, []);

  useEffect(() => {
    if (selectedSection) {
      fetchTopics(selectedSection.id);
    } else {
      setTopics([]);
    }
  }, [selectedSection]);

  const fetchSections = async () => {
    try {
      const res = await getSections();
      setSections(res.data || []);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tải danh sách Section');
    }
  };

  const fetchTopics = async (sectionId) => {
    try {
      const res = await getTopicsBySection(sectionId);
      setTopics(res.data || []);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tải danh sách Topic');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ----- SECTION HANDLERS -----
  const openSectionModal = (section = null) => {
    setEditingItem(section);
    if (section) {
      setFormData({ title: section.title, description: section.description || '', slug: section.slug || '', orderIndex: section.orderIndex || 0, isActive: true });
    } else {
      setFormData({ title: '', description: '', slug: '', orderIndex: 0, isActive: true });
    }
    setIsSectionModalOpen(true);
  };

  const saveSection = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await adminUpdateSection(editingItem.id, formData);
        alert('Cập nhật Section thành công');
      } else {
        await adminCreateSection(formData);
        alert('Thêm Section thành công');
      }
      setIsSectionModalOpen(false);
      fetchSections();
    } catch (err) {
      alert(err.message || 'Lỗi khi lưu Section');
    }
  };

  const deleteSection = async (section) => {
    if (!window.confirm(`Bạn có chắc muốn xóa section "${section.title}"?`)) return;
    try {
      await adminDeleteSection(section.id);
      alert('Xóa thành công');
      if (selectedSection?.id === section.id) setSelectedSection(null);
      fetchSections();
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa');
    }
  };

  // ----- TOPIC HANDLERS -----
  const openTopicModal = (topic = null) => {
    setEditingItem(topic);
    if (topic) {
      setFormData({ title: topic.title, description: topic.description || '', slug: topic.slug || '', orderIndex: topic.orderIndex || 0, isActive: true, sectionId: selectedSection.id });
    } else {
      setFormData({ title: '', description: '', slug: '', orderIndex: 0, isActive: true, sectionId: selectedSection.id });
    }
    setIsTopicModalOpen(true);
  };

  const saveTopic = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await adminUpdateTopic(editingItem.id, formData);
        alert('Cập nhật Topic thành công');
      } else {
        await adminCreateTopic(selectedSection.id, formData);
        alert('Thêm Topic thành công');
      }
      setIsTopicModalOpen(false);
      fetchTopics(selectedSection.id);
    } catch (err) {
      alert(err.message || 'Lỗi khi lưu Topic');
    }
  };

  const deleteTopic = async (topic) => {
    if (!window.confirm(`Bạn có chắc muốn xóa topic "${topic.title}"?`)) return;
    try {
      await adminDeleteTopic(topic.id);
      alert('Xóa thành công');
      fetchTopics(selectedSection.id);
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa');
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Quản lý Khóa học</h1>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* LỚP BÊN TRÁI: SECTIONS */}
        <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Danh sách Section</h2>
            <button onClick={() => openSectionModal()} className="btn btn-primary" style={{ padding: '6px 12px' }}>+ Thêm</button>
          </div>
          
          <DataTable 
            columns={[
              { header: 'ID', accessor: 'id' },
              { header: 'Tiêu đề', render: (row) => (
                <div 
                  onClick={() => setSelectedSection(row)}
                  style={{ cursor: 'pointer', color: selectedSection?.id === row.id ? '#3498db' : 'inherit', fontWeight: selectedSection?.id === row.id ? 'bold' : 'normal' }}
                >
                  {row.title}
                </div>
              ) },
              { header: 'Thứ tự', accessor: 'orderIndex' }
            ]}
            data={sections}
            onEdit={openSectionModal}
            onDelete={deleteSection}
          />
        </div>

        {/* LỚP BÊN PHẢI: TOPICS */}
        <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>
              Topics {selectedSection ? `thuộc "${selectedSection.title}"` : ''}
            </h2>
            <button onClick={() => openTopicModal()} disabled={!selectedSection} className="btn btn-primary" style={{ padding: '6px 12px', opacity: selectedSection ? 1 : 0.5 }}>+ Thêm</button>
          </div>

          {selectedSection ? (
            <DataTable 
              columns={[
                { header: 'ID', accessor: 'id' },
                { header: 'Tiêu đề', accessor: 'title' },
                { header: 'Thứ tự', accessor: 'orderIndex' }
              ]}
              data={topics}
              onEdit={openTopicModal}
              onDelete={deleteTopic}
            />
          ) : (
            <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '40px 0' }}>
              Vui lòng chọn một Section bên trái để xem Topics.
            </div>
          )}
        </div>
      </div>

      {/* MODAL SECTION */}
      <Modal isOpen={isSectionModalOpen} onClose={() => setIsSectionModalOpen(false)} title={editingItem ? 'Sửa Section' : 'Thêm Section'}>
        <form onSubmit={saveSection}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Tiêu đề (*)</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Slug</label>
            <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Mô tả</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} rows={3} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Thứ tự hiển thị (Order Index)</label>
            <input type="number" name="orderIndex" value={formData.orderIndex} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <button type="button" onClick={() => setIsSectionModalOpen(false)} style={{ marginRight: '10px', padding: '8px 16px' }} className="btn">Hủy</button>
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>Lưu</button>
          </div>
        </form>
      </Modal>

      {/* MODAL TOPIC */}
      <Modal isOpen={isTopicModalOpen} onClose={() => setIsTopicModalOpen(false)} title={editingItem ? 'Sửa Topic' : 'Thêm Topic'}>
        <form onSubmit={saveTopic}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Tiêu đề (*)</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Slug</label>
            <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Mô tả</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} rows={3} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Thứ tự hiển thị (Order Index)</label>
            <input type="number" name="orderIndex" value={formData.orderIndex} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <button type="button" onClick={() => setIsTopicModalOpen(false)} style={{ marginRight: '10px', padding: '8px 16px' }} className="btn">Hủy</button>
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>Lưu</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCourseManagePage;
