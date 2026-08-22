import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSections,
  adminCreateSection,
  adminUpdateSection,
  adminDeleteSection,
  adminCreateTopic,
  adminUpdateTopic,
  adminCreateExercise,
  adminUpdateExercise,
} from '../../services/api';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';

const PARTS = [
  { label: 'Part 1 - Listening hình ảnh', type: 'LISTENING_PART1', standardQuestions: 6, orderIndex: 1 },
  { label: 'Part 2 - Listening hỏi đáp', type: 'LISTENING_PART2', standardQuestions: 25, orderIndex: 2 },
  { label: 'Part 3 - Conversations', type: 'LISTENING_PART3', standardQuestions: 39, orderIndex: 3 },
  { label: 'Part 4 - Talks', type: 'LISTENING_PART4', standardQuestions: 30, orderIndex: 4 },
  { label: 'Part 5 - Reading grammar', type: 'READING_PART5', standardQuestions: 30, orderIndex: 5 },
  { label: 'Part 6 - Text completion', type: 'READING_PART6', standardQuestions: 16, orderIndex: 6 },
  { label: 'Part 7 - Reading comprehension', type: 'READING_PART7', standardQuestions: 54, orderIndex: 7 },
];

const ONLINE_TEST_MARKER = '[ONLINE_TEST]';

const slugify = (value) => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const isOnlineSection = (section) => {
  const text = `${section.slug || ''} ${section.title || ''} ${section.description || ''}`.toLowerCase();
  return text.includes('online') || text.includes('de-thi') || text.includes('đề thi') || text.includes(ONLINE_TEST_MARKER.toLowerCase());
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

const cardStyle = {
  background: '#fff',
  padding: 16,
  borderRadius: 8,
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
};

const buildOnlineDescription = (description) => {
  const cleanDescription = String(description || '').replace(ONLINE_TEST_MARKER, '').trim();
  return cleanDescription ? `${ONLINE_TEST_MARKER} ${cleanDescription}` : ONLINE_TEST_MARKER;
};

const getPartLabel = (exerciseType) => PARTS.find((part) => part.type === exerciseType)?.label || exerciseType;
const getPartConfig = (exerciseType) => PARTS.find((part) => part.type === exerciseType) || PARTS[0];
const getPartTitle = (sectionTitle, partConfig) => `${sectionTitle} - Part ${partConfig.orderIndex}`;
const getPartSlug = (sectionSlug, partConfig) => `${sectionSlug}-part-${partConfig.orderIndex}`;

const AdminOnlineTestManagePage = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [partModalOpen, setPartModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [editingPart, setEditingPart] = useState(null);
  const [testForm, setTestForm] = useState({
    title: '',
    slug: '',
    description: '',
    orderIndex: 1,
  });
  const [partForm, setPartForm] = useState({
    title: '',
    slug: '',
    description: '',
    exerciseType: 'LISTENING_PART1',
    totalQuestions: 6,
    orderIndex: 1,
  });

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await getSections();
      const data = res.data || [];
      setSections(data);

      const onlineSections = data.filter(isOnlineSection);
      if (!selectedSectionId && onlineSections[0]) {
        setSelectedSectionId(String(onlineSections[0].id));
      }
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

  const partRows = useMemo(() => {
    if (!selectedSection) return [];

    return (selectedSection.topics || []).flatMap((topic) => (
      topic.exercises || []
    ).map((exercise) => {
      const partConfig = getPartConfig(exercise.exerciseType);
      return {
        ...exercise,
        topicId: topic.id,
        topicTitle: topic.title,
        topicSlug: topic.slug,
        topicDescription: topic.description || '',
        sectionId: selectedSection.id,
        sectionTitle: selectedSection.title,
        sectionSlug: selectedSection.slug,
        partLabel: partConfig.label,
        orderIndex: partConfig.orderIndex,
      };
    })).sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  }, [selectedSection]);

  const openCreateTest = () => {
    setEditingTest(null);
    setTestForm({
      title: '',
      slug: '',
      description: '',
      orderIndex: onlineSections.length + 1,
    });
    setTestModalOpen(true);
  };

  const openEditTest = (section) => {
    setEditingTest(section);
    setTestForm({
      title: section.title || '',
      slug: section.slug || '',
      description: String(section.description || '').replace(ONLINE_TEST_MARKER, '').trim(),
      orderIndex: section.orderIndex || 1,
    });
    setTestModalOpen(true);
  };

  const handleTestChange = (e) => {
    const { name, value } = e.target;
    setTestForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'title' && !prev.slug ? { slug: slugify(value) } : {}),
    }));
  };

  const saveTest = async (e) => {
    e.preventDefault();
    const payload = {
      title: testForm.title.trim(),
      slug: testForm.slug.trim() || slugify(testForm.title),
      description: buildOnlineDescription(testForm.description),
      orderIndex: Number(testForm.orderIndex) || 1,
      isActive: true,
    };

    try {
      const res = editingTest
        ? await adminUpdateSection(editingTest.id, payload)
        : await adminCreateSection(payload);

      if (!editingTest) {
        for (const part of PARTS) {
          const topicRes = await adminCreateTopic(res.data.id, {
            title: getPartTitle(payload.title, part),
            slug: getPartSlug(payload.slug, part),
            description: '',
            orderIndex: part.orderIndex,
            isActive: true,
          });
          await adminCreateExercise(topicRes.data.id, {
            exerciseType: part.type,
            totalQuestions: part.standardQuestions,
            orderIndex: part.orderIndex,
            isActive: true,
          });
        }
      }

      setTestModalOpen(false);
      await fetchSections();
      setSelectedSectionId(String(editingTest?.id || res.data.id));
    } catch (err) {
      alert(err.message || 'Không lưu được bộ đề online');
    }
  };

  const deleteTest = async (section) => {
    if (!window.confirm(`Xóa toàn bộ đề "${section.title}" và các part bên trong?`)) return;

    try {
      await adminDeleteSection(section.id);
      setSelectedSectionId('');
      await fetchSections();
    } catch (err) {
      alert(err.message || 'Không xóa được bộ đề online');
    }
  };

  const openCreatePart = () => {
    if (!selectedSection) return;
    if (partRows.length >= PARTS.length) {
      alert('Một bộ đề TOEIC online chỉ được có đúng 7 part.');
      return;
    }

    const nextPart = PARTS.find((part) => !partRows.some((row) => row.exerciseType === part.type)) || PARTS[0];
    const title = getPartTitle(selectedSection.title, nextPart);

    setEditingPart(null);
    setPartForm({
      title,
      slug: getPartSlug(selectedSection.slug, nextPart),
      description: '',
      exerciseType: nextPart.type,
      totalQuestions: nextPart.standardQuestions,
      orderIndex: nextPart.orderIndex,
    });
    setPartModalOpen(true);
  };

  const openEditPart = (part) => {
    setEditingPart(part);
    setPartForm({
      title: part.topicTitle || '',
      slug: part.topicSlug || '',
      description: part.topicDescription || '',
      exerciseType: part.exerciseType || 'LISTENING_PART1',
      totalQuestions: part.totalQuestions || 0,
      orderIndex: part.orderIndex || 1,
    });
    setPartModalOpen(true);
  };

  const handlePartChange = (e) => {
    const { name, value } = e.target;
    setPartForm((prev) => {
      const next = {
        ...prev,
        [name]: value,
        ...(name === 'title' && !prev.slug ? { slug: slugify(value) } : {}),
      };

      if (name === 'exerciseType') {
        const partConfig = PARTS.find((part) => part.type === value);
        if (partConfig) {
          next.totalQuestions = partConfig.standardQuestions;
          next.orderIndex = partConfig.orderIndex;
          next.title = selectedSection ? getPartTitle(selectedSection.title, partConfig) : next.title;
          next.slug = selectedSection ? getPartSlug(selectedSection.slug, partConfig) : next.slug;
        }
      }

      return next;
    });
  };

  const savePart = async (e) => {
    e.preventDefault();
    if (!selectedSection) return;

    try {
      const partConfig = getPartConfig(partForm.exerciseType);
      const duplicatePart = partRows.some((row) => (
        row.exerciseType === partConfig.type && String(row.id) !== String(editingPart?.id)
      ));

      if (duplicatePart) {
        alert(`${partConfig.label} đã tồn tại trong bộ đề này.`);
        return;
      }

      if (!editingPart && partRows.length >= PARTS.length) {
        alert('Một bộ đề TOEIC online chỉ được có đúng 7 part.');
        return;
      }

      if (editingPart) {
        await adminUpdateTopic(editingPart.topicId, {
          title: partForm.title.trim(),
          slug: partForm.slug.trim() || slugify(partForm.title),
          description: partForm.description,
          orderIndex: partConfig.orderIndex,
          isActive: true,
          sectionId: Number(selectedSection.id),
        });
        await adminUpdateExercise(editingPart.id, {
          exerciseType: partConfig.type,
          totalQuestions: partConfig.standardQuestions,
          orderIndex: partConfig.orderIndex,
          topicId: Number(editingPart.topicId),
          isActive: true,
        });
      } else {
        const topicRes = await adminCreateTopic(selectedSection.id, {
          title: partForm.title.trim(),
          slug: partForm.slug.trim() || slugify(partForm.title),
          description: partForm.description,
          orderIndex: partConfig.orderIndex,
          isActive: true,
        });
        await adminCreateExercise(topicRes.data.id, {
          exerciseType: partConfig.type,
          totalQuestions: partConfig.standardQuestions,
          orderIndex: partConfig.orderIndex,
          isActive: true,
        });
      }

      setPartModalOpen(false);
      await fetchSections();
    } catch (err) {
      alert(err.message || 'Không lưu được part của đề thi');
    }
  };

  const questionCount = partRows.reduce((sum, row) => sum + (Number(row.totalQuestions) || 0), 0);
  const canAddPart = Boolean(selectedSection) && partRows.length < PARTS.length;
  const partOptions = PARTS.filter((part) => (
    editingPart?.exerciseType === part.type || !partRows.some((row) => row.exerciseType === part.type)
  ));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0 }}>Quản lý đề thi online</h1>
          <p style={{ margin: '8px 0 0', color: '#6b7280' }}>
            Tạo bộ đề TOEIC online, chia thành từng part và nhập câu hỏi cho từng part.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreateTest} style={{ padding: '10px 16px' }}>
          + Thêm bộ đề
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 0.9fr) minmax(480px, 1.5fr)', gap: 18 }}>
        <section style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontSize: '1.15rem' }}>Bộ đề online</h2>
            <span style={{ color: '#6b7280', fontWeight: 700 }}>{onlineSections.length} đề</span>
          </div>

          {loading ? (
            <div style={{ padding: 24, color: '#6b7280' }}>Đang tải dữ liệu...</div>
          ) : (
            <DataTable
              columns={[
                {
                  header: 'Tên đề',
                  render: (row) => (
                    <button
                      type="button"
                      onClick={() => setSelectedSectionId(String(row.id))}
                      style={{
                        background: 'transparent',
                        border: 0,
                        padding: 0,
                        color: String(selectedSectionId) === String(row.id) ? '#1a73e8' : '#2c3e50',
                        cursor: 'pointer',
                        fontWeight: String(selectedSectionId) === String(row.id) ? 800 : 600,
                        textAlign: 'left',
                      }}
                    >
                      {row.title}
                    </button>
                  ),
                },
                { header: 'Slug', accessor: 'slug' },
                { header: 'Thứ tự', accessor: 'orderIndex' },
              ]}
              data={onlineSections}
              onEdit={openEditTest}
              onDelete={deleteTest}
            />
          )}
        </section>

        <section style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 14 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem' }}>
                {selectedSection ? selectedSection.title : 'Chọn một bộ đề'}
              </h2>
              <p style={{ margin: '6px 0 0', color: '#6b7280' }}>
                {selectedSection
                  ? `${partRows.length} part, ${questionCount} câu hỏi`
                  : 'Chọn bộ đề bên trái để quản lý các part.'}
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={openCreatePart}
              disabled={!canAddPart}
              style={{ padding: '8px 12px', opacity: canAddPart ? 1 : 0.55 }}
            >
              + Thêm part
            </button>
          </div>

          <DataTable
            columns={[
              { header: 'Part', accessor: 'topicTitle' },
              { header: 'Loại', render: (row) => row.partLabel },
              { header: 'Số câu', accessor: 'totalQuestions' },
              { header: 'Thứ tự', accessor: 'orderIndex' },
            ]}
            data={partRows}
            onEdit={openEditPart}
            customActions={[
              { label: 'Câu hỏi', color: '#f39c12', onClick: (row) => navigate(`/admin/exercises/${row.id}/questions`) },
            ]}
          />
        </section>
      </div>

      <Modal isOpen={testModalOpen} onClose={() => setTestModalOpen(false)} title={editingTest ? 'Sửa bộ đề online' : 'Thêm bộ đề online'}>
        <form onSubmit={saveTest}>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Tên bộ đề (*)</label>
            <input name="title" value={testForm.title} onChange={handleTestChange} required style={fieldStyle} placeholder="VD: TOEIC Test 3 - 2026" />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Slug (*)</label>
            <input name="slug" value={testForm.slug} onChange={handleTestChange} required style={fieldStyle} placeholder="toeic-test-3-2026" />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Mô tả</label>
            <textarea name="description" value={testForm.description} onChange={handleTestChange} style={fieldStyle} rows={3} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Thứ tự hiển thị</label>
            <input type="number" name="orderIndex" value={testForm.orderIndex} onChange={handleTestChange} style={fieldStyle} min="1" />
          </div>
          <div style={{ textAlign: 'right' }}>
            <button type="button" className="btn" onClick={() => setTestModalOpen(false)} style={{ marginRight: 10, padding: '8px 16px' }}>Hủy</button>
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>Lưu</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={partModalOpen} onClose={() => setPartModalOpen(false)} title={editingPart ? 'Sửa part trong đề' : 'Thêm part vào đề'}>
        <form onSubmit={savePart}>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Tên part (*)</label>
            <input name="title" value={partForm.title} onChange={handlePartChange} required style={fieldStyle} placeholder="VD: Part 5" />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Slug (*)</label>
            <input name="slug" value={partForm.slug} onChange={handlePartChange} required style={fieldStyle} placeholder="part-5" />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Mô tả</label>
            <textarea name="description" value={partForm.description} onChange={handlePartChange} style={fieldStyle} rows={3} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Loại part</label>
              <select name="exerciseType" value={partForm.exerciseType} onChange={handlePartChange} style={fieldStyle}>
                {partOptions.map((part) => <option key={part.type} value={part.type}>{part.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Số câu dự kiến</label>
              <input type="number" name="totalQuestions" value={partForm.totalQuestions} readOnly disabled style={{ ...fieldStyle, background: '#f3f4f6', cursor: 'not-allowed' }} />
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Thứ tự hiển thị</label>
            <input type="number" name="orderIndex" value={partForm.orderIndex} readOnly disabled style={{ ...fieldStyle, background: '#f3f4f6', cursor: 'not-allowed' }} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <button type="button" className="btn" onClick={() => setPartModalOpen(false)} style={{ marginRight: 10, padding: '8px 16px' }}>Hủy</button>
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>Lưu part</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminOnlineTestManagePage;
