import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSections,
  adminCreateSection,
  adminCreateTopic,
  adminCreateExercise,
  adminUpdateExercise,
  adminDeleteExercise,
} from '../../services/api';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';

const EXERCISE_TYPES = [
  'READING_PART5',
  'READING_PART6',
  'READING_PART7',
  'LISTENING_PART1',
  'LISTENING_PART2',
  'LISTENING_PART3',
  'LISTENING_PART4',
  'GRAMMAR',
];

const ONLINE_SECTION_SLUG = 'de-thi-online-toeic-demo';

const slugify = (value) => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const isOnlineSection = (section) => {
  const text = `${section.slug || ''} ${section.title || ''}`.toLowerCase();
  return text.includes('online') || text.includes('de-thi') || text.includes('đề thi');
};

const fieldStyle = {
  width: '100%',
  padding: '9px 10px',
  borderRadius: '5px',
  border: '1px solid #ccd6e0',
};

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontWeight: 700,
  color: '#2c3e50',
};

const AdminOnlineTestManagePage = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [createForm, setCreateForm] = useState({
    title: '',
    slug: '',
    description: '',
    exerciseType: 'READING_PART5',
    totalQuestions: 0,
    orderIndex: 1,
  });
  const [exerciseForm, setExerciseForm] = useState({
    exerciseType: 'READING_PART5',
    totalQuestions: 0,
    orderIndex: 1,
    topicId: '',
  });

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await getSections();
      const data = res.data || [];
      setSections(data);
      const onlineSections = data.filter(isOnlineSection);
      const firstOnline = onlineSections[0];
      if (!selectedSectionId && firstOnline) setSelectedSectionId(String(firstOnline.id));
    } catch (err) {
      alert(err.message || 'Không tải được dữ liệu đề thi online');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const onlineSections = useMemo(() => sections.filter(isOnlineSection), [sections]);

  const selectedSection = useMemo(
    () => onlineSections.find((section) => String(section.id) === String(selectedSectionId)),
    [onlineSections, selectedSectionId],
  );

  const topics = selectedSection?.topics || [];

  const rows = useMemo(() => {
    return onlineSections.flatMap((section) => (section.topics || []).flatMap((topic) => (
      topic.exercises || []
    ).map((exercise) => ({
      ...exercise,
      sectionId: section.id,
      sectionTitle: section.title,
      topicId: topic.id,
      topicTitle: topic.title,
      topicSlug: topic.slug,
    }))));
  }, [onlineSections]);

  const filteredRows = rows.filter((row) => {
    if (selectedSectionId && String(row.sectionId) !== String(selectedSectionId)) return false;
    if (selectedTopicId && String(row.topicId) !== String(selectedTopicId)) return false;
    return true;
  });

  const openCreateModal = () => {
    setCreateForm({
      title: '',
      slug: '',
      description: '',
      exerciseType: 'READING_PART5',
      totalQuestions: 0,
      orderIndex: filteredRows.length + 1,
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'title' && !prev.slug ? { slug: slugify(value) } : {}),
    }));
  };

  const handleExerciseChange = (e) => {
    const { name, value } = e.target;
    setExerciseForm((prev) => ({ ...prev, [name]: value }));
  };

  const ensureOnlineSection = async () => {
    if (selectedSectionId) return Number(selectedSectionId);
    const existing = onlineSections[0];
    if (existing) return existing.id;

    const res = await adminCreateSection({
      title: 'De thi online TOEIC Demo',
      slug: ONLINE_SECTION_SLUG,
      description: 'Danh sách đề thi online TOEIC dùng cho phòng thi.',
      orderIndex: 90,
    });
    return res.data.id;
  };

  const createOnlineTest = async (e) => {
    e.preventDefault();
    try {
      const sectionId = await ensureOnlineSection();
      const topicRes = await adminCreateTopic(sectionId, {
        title: createForm.title,
        slug: createForm.slug || slugify(createForm.title),
        description: createForm.description,
        orderIndex: Number(createForm.orderIndex) || 1,
      });
      const exerciseRes = await adminCreateExercise(topicRes.data.id, {
        exerciseType: createForm.exerciseType,
        totalQuestions: Number(createForm.totalQuestions) || 0,
        orderIndex: 1,
      });

      setIsCreateModalOpen(false);
      await fetchSections();
      navigate(`/admin/exercises/${exerciseRes.data.id}/questions`);
    } catch (err) {
      alert(err.message || 'Không tạo được đề thi online');
    }
  };

  const openEditExercise = (exercise) => {
    setEditingExercise(exercise);
    setExerciseForm({
      exerciseType: exercise.exerciseType || 'READING_PART5',
      totalQuestions: exercise.totalQuestions || 0,
      orderIndex: exercise.orderIndex || 1,
      topicId: exercise.topicId,
    });
  };

  const saveExercise = async (e) => {
    e.preventDefault();
    try {
      await adminUpdateExercise(editingExercise.id, {
        exerciseType: exerciseForm.exerciseType,
        totalQuestions: Number(exerciseForm.totalQuestions) || 0,
        orderIndex: Number(exerciseForm.orderIndex) || 1,
        topicId: Number(exerciseForm.topicId),
      });
      setEditingExercise(null);
      fetchSections();
    } catch (err) {
      alert(err.message || 'Không lưu được đề thi');
    }
  };

  const deleteExercise = async (exercise) => {
    if (!window.confirm(`Xóa đề "${exercise.topicTitle}"?`)) return;
    try {
      await adminDeleteExercise(exercise.id);
      fetchSections();
    } catch (err) {
      alert(err.message || 'Không xóa được đề thi');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0 }}>Quản lý đề thi online</h1>
          <p style={{ margin: '8px 0 0', color: '#6b7280' }}>
            Quản lý các đề xuất hiện ở trang học viên mục "Đề thi online".
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal} style={{ padding: '10px 16px' }}>
          + Thêm đề online
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 18, background: '#fff', padding: 16, borderRadius: 8 }}>
        <select value={selectedSectionId} onChange={(e) => { setSelectedSectionId(e.target.value); setSelectedTopicId(''); }} style={{ ...fieldStyle, maxWidth: 280 }}>
          <option value="">Tất cả section đề thi</option>
          {onlineSections.map((section) => (
            <option key={section.id} value={section.id}>{section.title}</option>
          ))}
        </select>
        <select value={selectedTopicId} onChange={(e) => setSelectedTopicId(e.target.value)} style={{ ...fieldStyle, maxWidth: 280 }} disabled={!selectedSection}>
          <option value="">Tất cả topic</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>{topic.title}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ padding: 30, background: '#fff', borderRadius: 8 }}>Đang tải dữ liệu...</div>
      ) : (
        <DataTable
          columns={[
            { header: 'ID', accessor: 'id' },
            { header: 'Tên đề', accessor: 'topicTitle' },
            { header: 'Section', accessor: 'sectionTitle' },
            { header: 'Loại', accessor: 'exerciseType' },
            { header: 'Số câu', accessor: 'totalQuestions' },
            { header: 'Thứ tự', accessor: 'orderIndex' },
          ]}
          data={filteredRows}
          onEdit={openEditExercise}
          onDelete={deleteExercise}
          customActions={[
            { label: 'Câu hỏi', color: '#f39c12', onClick: (row) => navigate(`/admin/exercises/${row.id}/questions`) },
            { label: 'Xem thử', color: '#2ecc71', onClick: (row) => window.open(`http://localhost:5173/exercises/${row.id}`, '_blank') },
          ]}
        />
      )}

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Thêm đề thi online">
        <form onSubmit={createOnlineTest}>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Tên đề (*)</label>
            <input name="title" value={createForm.title} onChange={handleCreateChange} required style={fieldStyle} placeholder="VD: Mini Test 2 - Part 5" />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Slug (*)</label>
            <input name="slug" value={createForm.slug} onChange={handleCreateChange} required style={fieldStyle} placeholder="mini-test-2-part-5" />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Mô tả</label>
            <textarea name="description" value={createForm.description} onChange={handleCreateChange} style={fieldStyle} rows={3} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Loại đề</label>
              <select name="exerciseType" value={createForm.exerciseType} onChange={handleCreateChange} style={fieldStyle}>
                {EXERCISE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Số câu dự kiến</label>
              <input type="number" name="totalQuestions" value={createForm.totalQuestions} onChange={handleCreateChange} style={fieldStyle} min="0" />
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Thứ tự hiển thị</label>
            <input type="number" name="orderIndex" value={createForm.orderIndex} onChange={handleCreateChange} style={fieldStyle} min="1" />
          </div>
          <div style={{ textAlign: 'right' }}>
            <button type="button" className="btn" onClick={() => setIsCreateModalOpen(false)} style={{ marginRight: 10, padding: '8px 16px' }}>Hủy</button>
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>Tạo và nhập câu hỏi</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={Boolean(editingExercise)} onClose={() => setEditingExercise(null)} title="Sửa cấu hình đề">
        <form onSubmit={saveExercise}>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Topic</label>
            <select name="topicId" value={exerciseForm.topicId} onChange={handleExerciseChange} style={fieldStyle}>
              {onlineSections.flatMap((section) => section.topics || []).map((topic) => (
                <option key={topic.id} value={topic.id}>{topic.title}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Loại đề</label>
              <select name="exerciseType" value={exerciseForm.exerciseType} onChange={handleExerciseChange} style={fieldStyle}>
                {EXERCISE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Số câu</label>
              <input type="number" name="totalQuestions" value={exerciseForm.totalQuestions} onChange={handleExerciseChange} style={fieldStyle} min="0" />
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Thứ tự</label>
            <input type="number" name="orderIndex" value={exerciseForm.orderIndex} onChange={handleExerciseChange} style={fieldStyle} min="1" />
          </div>
          <div style={{ textAlign: 'right' }}>
            <button type="button" className="btn" onClick={() => setEditingExercise(null)} style={{ marginRight: 10, padding: '8px 16px' }}>Hủy</button>
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>Lưu</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminOnlineTestManagePage;
