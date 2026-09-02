import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExerciseDetailById, adminAddQuestion, adminDeleteQuestion, adminAddQuestionGroup, adminDeleteQuestionGroup, adminUpdateQuestionGroup } from '../../services/api';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { getFullUrl } from '../../utils/urlUtils';

import FlatQuestionForm from '../../components/admin/exercise-forms/FlatQuestionForm';
import GroupPart1Form from '../../components/admin/exercise-forms/GroupPart1Form';
import GroupPart2Form from '../../components/admin/exercise-forms/GroupPart2Form';
import GroupPart34Form from '../../components/admin/exercise-forms/GroupPart34Form';
import GroupPart67Form from '../../components/admin/exercise-forms/GroupPart67Form';

const STANDARD_QUESTION_COUNTS = {
  LISTENING_PART1: 6,
  LISTENING_PART2: 25,
  LISTENING_PART3: 39,
  LISTENING_PART4: 30,
  READING_PART5: 30,
  READING_PART6: 16,
  READING_PART7: 54,
};

const countActualQuestions = (exercise) => {
  const flatQuestions = exercise?.questions?.length || 0;
  const groupedQuestions = (exercise?.questionGroups || []).reduce(
    (sum, group) => sum + (group.questions?.length || 0),
    0,
  );
  return flatQuestions + groupedQuestions;
};

const AdminQuestionManagePage = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    fetchData();
  }, [exerciseId]);

  const fetchData = async () => {
    try {
      const res = await getExerciseDetailById(exerciseId);
      setExercise(res.data);
    } catch (err) {
      console.error(err);
      alert('Không thể tải dữ liệu bài tập');
    } finally {
      setLoading(false);
    }
  };

  const isFlatLayout = exercise && (exercise.exerciseType === 'GRAMMAR' || exercise.exerciseType === 'READING_PART5');
  const standardQuestionCount = STANDARD_QUESTION_COUNTS[exercise?.exerciseType] || null;
  const actualQuestionCount = countActualQuestions(exercise);
  const reachedQuestionLimit = standardQuestionCount !== null && actualQuestionCount >= standardQuestionCount;

  // --- Flat Questions Handlers ---
  const handleOpenQuestionModal = () => {
    if (reachedQuestionLimit) {
      alert(`${exercise.exerciseType} chỉ được có đúng ${standardQuestionCount} câu.`);
      return;
    }

    const nextNum = exercise?.questions?.length ? Math.max(...exercise.questions.map(q => q.questionNumber)) + 1 : 1;
    setSelectedQuestion({ questionNumber: nextNum });
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = async (data) => {
    try {
      await adminAddQuestion(exerciseId, data);
      alert('Thêm câu hỏi thành công!');
      setIsQuestionModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteQuestion = async (row) => {
    if (!window.confirm('Xóa câu hỏi này?')) return;
    try {
      await adminDeleteQuestion(row.id);
      alert('Xóa thành công');
      fetchData();
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa');
    }
  };

  // --- Question Group Handlers ---
  const handleOpenGroupModal = (group = null) => {
    if (!group && reachedQuestionLimit) {
      alert(`${exercise.exerciseType} chỉ được có đúng ${standardQuestionCount} câu.`);
      return;
    }

    if (group) {
      setSelectedGroup(group);
    } else {
      const nextIdx = exercise?.questionGroups?.length ? Math.max(...exercise.questionGroups.map(g => g.orderIndex)) + 1 : 1;
      setSelectedGroup({ orderIndex: nextIdx });
    }
    setIsGroupModalOpen(true);
  };

  const handleSaveGroup = async (data) => {
    try {
      if (data.id) {
        // Update existing group
        await adminUpdateQuestionGroup(data.id, data);
        alert('Cập nhật thông tin nhóm thành công');
      } else {
        // Create new group with questions
        await adminAddQuestionGroup(exerciseId, data);
        alert('Tạo nhóm câu hỏi thành công');
      }
      setIsGroupModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Xóa toàn bộ nhóm câu hỏi này?')) return;
    try {
      await adminDeleteQuestionGroup(groupId);
      alert('Xóa thành công');
      fetchData();
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa');
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (!exercise) return <div>Không tìm thấy bài tập</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        <button className="btn" onClick={() => navigate('/admin/courses')}>&larr; Quay lại</button>
        <h1 style={{ margin: 0, color: '#2c3e50' }}>Luyện tập: Trắc nghiệm format TOEIC</h1>
      </div>
      <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#fff', borderLeft: '4px solid #3498db', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}><b>Loại bài tập:</b> <span style={{ color: '#2980b9' }}>{exercise.exerciseType}</span></p>
        <p style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>
          <b>Số câu đã nhập:</b> {actualQuestionCount}{standardQuestionCount ? `/${standardQuestionCount}` : ''}
        </p>
        <p style={{ color: '#e74c3c', fontSize: '0.95rem', margin: 0, marginTop: '10px', padding: '10px', backgroundColor: '#fdf3f2', borderRadius: '4px' }}>
          <i style={{ marginRight: '5px' }}>⚠️</i> <b>Lưu ý:</b> Hệ thống hiện chưa hỗ trợ sửa trực tiếp text câu hỏi/đáp án. Nếu nhập sai, vui lòng Xóa nhóm/câu hỏi đó đi và Tạo lại. Bạn vẫn có thể Sửa thông tin Audio/Image/Passage của nhóm.
        </p>
      </div>

      {isFlatLayout ? (
        // ================= FLAT LAYOUT (GRAMMAR, PART 5) =================
        <>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn btn-primary"
              onClick={handleOpenQuestionModal}
              disabled={reachedQuestionLimit}
              style={{ padding: '10px 20px', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 2px 4px rgba(52,152,219,0.3)', opacity: reachedQuestionLimit ? 0.55 : 1, cursor: reachedQuestionLimit ? 'not-allowed' : 'pointer' }}
            >
              + Thêm Câu Hỏi Đơn
            </button>
          </div>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }}>
            <DataTable 
              columns={[
                { header: 'Câu số', accessor: 'questionNumber' },
                { header: 'Nội dung', accessor: 'content' },
                { header: 'Đáp án đúng', accessor: 'correctAnswer' }
              ]}
              data={exercise.questions || []}
              onDelete={handleDeleteQuestion}
            />
          </div>
        </>
      ) : (
        // ================= GROUP LAYOUT (PART 1-4, 6-7) =================
        <>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn btn-primary"
              onClick={() => handleOpenGroupModal()}
              disabled={reachedQuestionLimit}
              style={{ padding: '10px 20px', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 2px 4px rgba(52,152,219,0.3)', opacity: reachedQuestionLimit ? 0.55 : 1, cursor: reachedQuestionLimit ? 'not-allowed' : 'pointer' }}
            >
              + Thêm Nhóm Câu Hỏi
            </button>
          </div>
          
          {(exercise.questionGroups || []).map((group, idx) => (
            <div key={group.id} style={{ marginBottom: '25px', backgroundColor: 'white', border: '1px solid #e1e8ed', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ backgroundColor: '#f8f9fa', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e1e8ed' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2c3e50' }}>Nhóm {group.orderIndex}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {group.audioUrl && <span style={{ padding: '4px 8px', backgroundColor: '#e1f5fe', color: '#0277bd', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>🎵 Có Audio</span>}
                    {group.imageUrl && <span style={{ padding: '4px 8px', backgroundColor: '#fff3e0', color: '#e65100', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>🖼️ Có Ảnh</span>}
                    {group.passage && <span style={{ padding: '4px 8px', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>📝 Có Đoạn văn</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn" style={{ padding: '6px 12px', border: '1px solid #bdc3c7', backgroundColor: 'white' }} onClick={() => handleOpenGroupModal(group)}>✏️ Sửa TT Nhóm</button>
                  <button className="btn" style={{ backgroundColor: '#e74c3c', color: 'white', padding: '6px 12px', border: 'none' }} onClick={() => handleDeleteGroup(group.id)}>🗑️ Xóa Nhóm</button>
                </div>
              </div>
              
              <div style={{ padding: '20px' }}>
                {/* HIỂN THỊ CONTENT BLOCKS NẾU CÓ */}
                {group.contentBlocks && group.contentBlocks.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e1e8ed' }}>
                    {group.contentBlocks.sort((a,b) => a.orderIndex - b.orderIndex).map(block => {
                      if (block.blockType === 'IMAGE') {
                        return (
                          <div key={block.id} style={{ textAlign: 'center', padding: '10px', backgroundColor: '#fff', border: '1px dashed #ccc', borderRadius: '6px' }}>
                            <img src={getFullUrl(block.imageUrl)} alt="Content Block" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                          </div>
                        );
                      } else {
                        return (
                          <div key={block.id} style={{ padding: '15px', backgroundColor: '#fff', borderLeft: '4px solid #3498db', borderRadius: '4px', lineHeight: '1.6', color: '#34495e', whiteSpace: 'pre-wrap' }}>
                            {block.content}
                          </div>
                        );
                      }
                    })}
                  </div>
                ) : (
                  /* FALLBACK CHO DỮ LIỆU CŨ (PASSAGE / IMAGE) */
                  <>
                    {group.passage && (
                      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fdfbf7', borderLeft: '4px solid #f1c40f', borderRadius: '4px', lineHeight: '1.6', color: '#34495e', whiteSpace: 'pre-wrap' }}>
                        {group.passage}
                      </div>
                    )}
                    {group.imageUrl && (
                      <div style={{ marginBottom: '20px', textAlign: 'center', padding: '10px', border: '1px dashed #ccc', borderRadius: '8px' }}>
                        <img src={getFullUrl(group.imageUrl)} alt="Group" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                      </div>
                    )}
                  </>
                )}

                {/* AUDIO LUÔN HIỂN THỊ NẾU CÓ */}
                {group.audioUrl && (
                  <div style={{ display: 'flex', alignItems: 'center', padding: '10px', border: '1px dashed #ccc', borderRadius: '8px', marginBottom: '20px' }}>
                    <audio key={group.audioUrl} controls src={getFullUrl(group.audioUrl)} style={{ width: '100%' }} />
                  </div>
                )}
                
                <h5 style={{ margin: '0 0 10px 0', color: '#7f8c8d', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Danh sách câu hỏi trong nhóm:</h5>
                <DataTable 
                  columns={[
                    { header: 'Câu số', accessor: 'questionNumber' },
                    { header: 'Nội dung', accessor: 'content' },
                    { header: 'Đáp án đúng', accessor: 'correctAnswer' }
                  ]}
                  data={group.questions || []}
                  onDelete={handleDeleteQuestion}
                />
              </div>
            </div>
          ))}
          {(!exercise.questionGroups || exercise.questionGroups.length === 0) && (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '8px', color: '#7f8c8d' }}>
              Chưa có nhóm câu hỏi nào.
            </div>
          )}
        </>
      )}

      {/* QUESTION MODAL (FLAT) */}
      <Modal isOpen={isQuestionModalOpen} onClose={() => setIsQuestionModalOpen(false)} title="Thêm Câu Hỏi">
        <FlatQuestionForm 
          initialData={selectedQuestion} 
          onSave={handleSaveQuestion} 
          onCancel={() => setIsQuestionModalOpen(false)} 
          isPracticeTopic={exercise.topicSlug && exercise.topicSlug.includes('luyen-tap-tong-hop')}
          sectionId={exercise.sectionId}
          sectionSlug={exercise.sectionSlug}
          topicSlug={exercise.topicSlug}
        />
      </Modal>

      {/* GROUP MODAL */}
      <Modal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} title={selectedGroup?.id ? "Sửa Thông Tin Nhóm" : "Tạo Nhóm Câu Hỏi Mới"}>
        {exercise.exerciseType === 'LISTENING_PART1' && (
          <GroupPart1Form initialData={selectedGroup} onSave={handleSaveGroup} onCancel={() => setIsGroupModalOpen(false)} isPracticeTopic={exercise.topicSlug && exercise.topicSlug.includes('luyen-tap-tong-hop')} sectionId={exercise.sectionId} sectionSlug={exercise.sectionSlug} topicSlug={exercise.topicSlug} />
        )}
        {exercise.exerciseType === 'LISTENING_PART2' && (
          <GroupPart2Form initialData={selectedGroup} onSave={handleSaveGroup} onCancel={() => setIsGroupModalOpen(false)} isPracticeTopic={exercise.topicSlug && exercise.topicSlug.includes('luyen-tap-tong-hop')} sectionId={exercise.sectionId} sectionSlug={exercise.sectionSlug} topicSlug={exercise.topicSlug} />
        )}
        {(exercise.exerciseType === 'LISTENING_PART3' || exercise.exerciseType === 'LISTENING_PART4') && (
          <GroupPart34Form initialData={selectedGroup} onSave={handleSaveGroup} onCancel={() => setIsGroupModalOpen(false)} isPracticeTopic={exercise.topicSlug && exercise.topicSlug.includes('luyen-tap-tong-hop')} sectionId={exercise.sectionId} sectionSlug={exercise.sectionSlug} topicSlug={exercise.topicSlug} />
        )}
        {(exercise.exerciseType === 'READING_PART6' || exercise.exerciseType === 'READING_PART7') && (
          <GroupPart67Form initialData={selectedGroup} onSave={handleSaveGroup} onCancel={() => setIsGroupModalOpen(false)} isPracticeTopic={exercise.topicSlug && exercise.topicSlug.includes('luyen-tap-tong-hop')} sectionId={exercise.sectionId} sectionSlug={exercise.sectionSlug} topicSlug={exercise.topicSlug} />
        )}
      </Modal>
    </div>
  );
};

export default AdminQuestionManagePage;

