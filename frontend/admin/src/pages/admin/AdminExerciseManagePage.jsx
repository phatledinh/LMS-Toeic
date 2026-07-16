import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSections, getTopicsBySection, getExercisesByTopic, adminCreateExercise, adminUpdateExercise, adminDeleteExercise } from '../../services/api';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';

const AdminExerciseManagePage = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [topics, setTopics] = useState([]);
  const [exercises, setExercises] = useState([]);

  const [selectedSection, setSelectedSection] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    exerciseType: 'GRAMMAR',
    isActive: true,
  });

  useEffect(() => {
    getSections().then(res => setSections(res.data || [])).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedSection) {
      getTopicsBySection(selectedSection).then(res => setTopics(res.data || [])).catch(console.error);
      setSelectedTopic('');
      setExercises([]);
    } else {
      setTopics([]);
      setExercises([]);
    }
  }, [selectedSection]);

  useEffect(() => {
    if (selectedTopic) {
      fetchExercises();
    } else {
      setExercises([]);
    }
  }, [selectedTopic]);

  const fetchExercises = async () => {
    try {
      const res = await getExercisesByTopic(selectedTopic);
      setExercises(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const getExerciseTypeFromSection = (sectionTitle) => {
    if (!sectionTitle) return 'GRAMMAR';
    const title = sectionTitle.toLowerCase();
    if (title.includes('part 1')) return 'LISTENING_PART1';
    if (title.includes('part 2')) return 'LISTENING_PART2';
    if (title.includes('part 3')) return 'LISTENING_PART3';
    if (title.includes('part 4')) return 'LISTENING_PART4';
    if (title.includes('part 5')) return 'READING_PART5';
    if (title.includes('part 6')) return 'READING_PART6';
    if (title.includes('part 7')) return 'READING_PART7';
    return 'GRAMMAR';
  };

  const handleAutoCreateExercise = async () => {
    if (!selectedSection || !selectedTopic) return;
    
    const currentSection = sections.find(s => s.id === parseInt(selectedSection));
    const exerciseType = getExerciseTypeFromSection(currentSection?.title);
    
    try {
      const payload = {
        exerciseType: exerciseType,
        isActive: true,
      };
      
      const res = await adminCreateExercise(selectedTopic, payload);
      // Chuyển thẳng sang trang quản lý câu hỏi
      if (res && res.data && res.data.id) {
        navigate(`/admin/exercises/${res.data.id}/questions`);
      } else {
        fetchExercises();
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi tạo bài tập');
    }
  };

  const deleteExercise = async (exercise) => {
    if (!window.confirm(`Xóa bài tập có ID "${exercise.id}"?`)) return;
    try {
      await adminDeleteExercise(exercise.id);
      alert('Xóa thành công');
      fetchExercises();
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa');
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Quản lý Bài tập</h1>
      
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="form-select" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px' }}>
          <option value="">-- Chọn Section --</option>
          {sections.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
        <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} disabled={!selectedSection} className="form-select" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px' }}>
          <option value="">-- Chọn Topic --</option>
          {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
        <button onClick={handleAutoCreateExercise} disabled={!selectedTopic} className="btn btn-primary" style={{ padding: '8px 16px', opacity: selectedTopic ? 1 : 0.5 }}>
          + Thêm Bài Tập Mới
        </button>
      </div>

      {selectedTopic ? (
        <DataTable 
          columns={[
            { header: 'ID', accessor: 'id' },
            { header: 'Tên Bài Tập', render: () => 'Luyện tập: Trắc nghiệm format TOEIC' },
            { header: 'Loại', accessor: 'exerciseType' }
          ]}
          data={exercises}
          onDelete={deleteExercise}
          customActions={[
            { label: 'Quản lý Câu hỏi', color: '#f39c12', onClick: (row) => navigate(`/admin/exercises/${row.id}/questions`) }
          ]}
        />
      ) : (
        <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '40px 0', backgroundColor: 'white', borderRadius: '8px' }}>
          Vui lòng chọn Section và Topic để xem danh sách bài tập.
        </div>
      )}


    </div>
  );
};

export default AdminExerciseManagePage;
