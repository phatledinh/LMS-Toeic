import React, { useState, useEffect } from 'react';
import { getAllSectionsAdmin, createSection, updateSection, deleteSection, createTopic, updateTopic, deleteTopic } from '../../../services/api';
import SectionModal from './SectionModal';
import TopicModal from './TopicModal';

const CourseManagement = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentSectionId, setCurrentSectionId] = useState(null);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const data = await getAllSectionsAdmin();
      setSections(data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load course data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  // Section Handlers
  const handleCreateSection = () => {
    setSelectedSection(null);
    setSectionModalOpen(true);
  };

  const handleEditSection = (section) => {
    setSelectedSection(section);
    setSectionModalOpen(true);
  };

  const handleDeleteSection = async (id) => {
    if (window.confirm('Are you sure you want to delete this section? All its topics will also be deleted.')) {
      try {
        await deleteSection(id);
        fetchSections();
      } catch (err) {
        alert('Failed to delete section');
      }
    }
  };

  const handleSaveSection = async (data) => {
    try {
      if (selectedSection) {
        await updateSection(selectedSection.id, data);
      } else {
        await createSection(data);
      }
      setSectionModalOpen(false);
      fetchSections();
    } catch (err) {
      alert('Failed to save section');
      console.error(err);
    }
  };

  // Topic Handlers
  const handleCreateTopic = (sectionId) => {
    setSelectedTopic(null);
    setCurrentSectionId(sectionId);
    setTopicModalOpen(true);
  };

  const handleEditTopic = (topic, sectionId) => {
    setSelectedTopic(topic);
    setCurrentSectionId(sectionId);
    setTopicModalOpen(true);
  };

  const handleDeleteTopic = async (id) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      try {
        await deleteTopic(id);
        fetchSections();
      } catch (err) {
        alert('Failed to delete topic');
      }
    }
  };

  const handleSaveTopic = async (data) => {
    try {
      if (selectedTopic) {
        await updateTopic(selectedTopic.id, data);
      } else {
        await createTopic(data);
      }
      setTopicModalOpen(false);
      fetchSections();
    } catch (err) {
      alert('Failed to save topic');
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Course Management</h1>
        <button
          onClick={handleCreateSection}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          + New Section
        </button>
      </div>

      <div className="space-y-6">
        {sections.map(section => (
          <div key={section.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b p-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  <span className="text-gray-500 mr-2">#{section.orderIndex}</span>
                  {section.title}
                </h2>
                <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                  <span className={section.isActive ? 'text-green-600 font-medium' : 'text-red-500'}>
                    {section.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span>•</span>
                  <span>{section.slug}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCreateTopic(section.id)}
                  className="text-sm px-3 py-1 bg-green-50 text-green-600 border border-green-200 rounded hover:bg-green-100 transition"
                >
                  + Topic
                </button>
                <button
                  onClick={() => handleEditSection(section)}
                  className="text-sm px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSection(section.id)}
                  className="text-sm px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition"
                >
                  Delete
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-white">
              {section.topics && section.topics.length > 0 ? (
                <ul className="space-y-3">
                  {section.topics.map(topic => (
                    <li key={topic.id} className="flex justify-between items-center p-3 hover:bg-gray-50 border rounded transition">
                      <div>
                        <span className="font-medium text-gray-700">
                          <span className="text-gray-400 mr-2 text-sm">{topic.orderIndex}.</span>
                          {topic.title}
                        </span>
                        {!topic.isActive && <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Inactive</span>}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 hover-trigger" style={{opacity: 1}}>
                        <button
                          onClick={() => handleEditTopic(topic, section.id)}
                          className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTopic(topic.id)}
                          className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 rounded transition"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400 text-sm italic text-center py-4">No topics in this section yet.</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <SectionModal
        isOpen={sectionModalOpen}
        onClose={() => setSectionModalOpen(false)}
        onSave={handleSaveSection}
        initialData={selectedSection}
      />

      <TopicModal
        isOpen={topicModalOpen}
        onClose={() => setTopicModalOpen(false)}
        onSave={handleSaveTopic}
        initialData={selectedTopic}
        sectionId={currentSectionId}
      />
    </div>
  );
};

export default CourseManagement;
