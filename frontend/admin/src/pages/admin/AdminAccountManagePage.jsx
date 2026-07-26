import React, { useEffect, useMemo, useState } from 'react';
import {
  adminCreateUser,
  adminDeleteUser,
  adminGetUsers,
  adminSetUserActive,
  adminUpdateUser,
} from '../../services/api';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';

const emptyFormData = {
  fullName: '',
  email: '',
  password: '',
  targetScore: 500,
  isActive: true,
  roles: ['USER'],
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  backgroundColor: '#fff',
  color: '#2c3e50',
  fontSize: '14px',
  outline: 'none',
  pointerEvents: 'auto',
};

const AdminAccountManagePage = () => {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ ...emptyFormData });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) return users;

    return users.filter((user) =>
      [user.fullName, user.email, ...(user.roles || [])]
        .join(' ')
        .toLowerCase()
        .includes(normalizedKeyword)
    );
  }, [keyword, users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminGetUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Lỗi khi tải danh sách tài khoản');
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (user = null) => {
    setEditingUser(user);
    setFormData(user ? {
      fullName: user.fullName || '',
      email: user.email || '',
      password: '',
      targetScore: user.targetScore || 500,
      isActive: user.isActive ?? true,
      roles: user.roles?.length ? user.roles : ['USER'],
    } : { ...emptyFormData });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({ ...prev, roles: [role] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...formData,
      targetScore: Number(formData.targetScore) || 500,
    };

    if (editingUser && !payload.password) {
      delete payload.password;
    }

    try {
      if (editingUser) {
        await adminUpdateUser(editingUser.id, payload);
        alert('Cập nhật tài khoản thành công');
      } else {
        await adminCreateUser(payload);
        alert('Tạo tài khoản thành công');
      }
      closeModal();
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra khi lưu tài khoản');
    }
  };

  const handleToggleActive = async (user) => {
    const nextActive = !user.isActive;
    const actionText = nextActive ? 'mở khóa' : 'khóa';
    if (!window.confirm(`Bạn có chắc muốn ${actionText} tài khoản "${user.email}"?`)) return;

    try {
      await adminSetUserActive(user.id, nextActive);
      alert(`${nextActive ? 'Mở khóa' : 'Khóa'} tài khoản thành công`);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tài khoản "${user.email}"?`)) return;

    try {
      await adminDeleteUser(user.id);
      alert('Xóa tài khoản thành công');
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra khi xóa tài khoản');
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Quản lý tài khoản</h1>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Danh sách tài khoản</h2>
            <p style={{ margin: '6px 0 0', color: '#7f8c8d' }}>
              {isLoading ? 'Đang tải dữ liệu...' : `${filteredUsers.length} tài khoản`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="search"
              placeholder="Tìm theo tên, email, vai trò"
              value={keyword}
              onChange={(event) => setKeyword(event.currentTarget.value)}
              style={{ ...inputStyle, width: '260px' }}
            />
            <button className="btn btn-primary" style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => openModal()}>
              + Thêm tài khoản
            </button>
          </div>
        </div>

        <DataTable
          columns={[
            { header: 'ID', accessor: 'id' },
            { header: 'Họ tên', accessor: 'fullName' },
            { header: 'Email', accessor: 'email' },
            { header: 'Target', accessor: 'targetScore' },
            { header: 'Vai trò', render: (row) => (row.roles || []).join(', ') || 'USER' },
            {
              header: 'Trạng thái',
              render: (row) => (
                <span style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  color: row.isActive ? '#1e8449' : '#922b21',
                  backgroundColor: row.isActive ? '#eafaf1' : '#fdecea',
                  fontWeight: 'bold',
                }}>
                  {row.isActive ? 'Hoạt động' : 'Đã khóa'}
                </span>
              ),
            },
          ]}
          data={filteredUsers}
          onEdit={openModal}
          onDelete={handleDelete}
          customActions={[
            {
              label: (row) => row.isActive ? 'Khóa' : 'Mở khóa',
              color: '#f39c12',
              onClick: handleToggleActive,
            },
          ]}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingUser ? 'Sửa tài khoản' : 'Thêm tài khoản'}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Họ tên *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              onInput={handleInputChange}
              autoComplete="name"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onInput={handleInputChange}
              autoComplete="email"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              {editingUser ? 'Mật khẩu mới' : 'Mật khẩu *'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onInput={handleInputChange}
              required={!editingUser}
              minLength={6}
              autoComplete="new-password"
              placeholder={editingUser ? 'Bỏ trống nếu không đổi mật khẩu' : ''}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Target score</label>
            <input
              type="number"
              name="targetScore"
              min="10"
              max="990"
              value={formData.targetScore}
              onChange={handleInputChange}
              onInput={handleInputChange}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Vai trò</label>
            <div style={{ display: 'flex', gap: '15px' }}>
              {['USER', 'ADMIN'].map((role) => (
                <label key={role} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input type="radio" name="role" checked={formData.roles.includes(role)} onChange={() => handleRoleChange(role)} />
                  {role}
                </label>
              ))}
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} />
            Tài khoản đang hoạt động
          </label>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={closeModal} style={{ padding: '8px 16px', border: '1px solid #ccc', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer' }}>
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

export default AdminAccountManagePage;
