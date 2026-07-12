import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { getSections } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    getSections()
      .then((res) => setSections(res.data || []))
      .catch(() => setSections([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-header" onClick={() => navigate('/')}>
        <span>Complete TOEIC</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </div>
      <ul className="sidebar-menu">
        {loading ? (
          <li className="sidebar-loading">Đang tải...</li>
        ) : (
          sections.map((section) => {
            const isFlashcardSection = section.slug === 'tu-vung-toeic';
            const targetUrl = isFlashcardSection ? '/flashcards' : `/sections/${section.slug}`;
            const isActive = (slug === section.slug) || (isFlashcardSection && location.pathname.startsWith('/flashcards'));
            return (
              <li
                key={section.id}
                className={isActive ? 'active' : ''}
              >
                <Link to={targetUrl}>{section.title}</Link>
              </li>
            );
          })
        )}

      </ul>
    </aside>
  );
};

export default Sidebar;
