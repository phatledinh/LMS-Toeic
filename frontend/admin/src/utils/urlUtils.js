import { SERVER_URL } from '../services/api';

/**
 * Nối đường dẫn tương đối với SERVER_URL để tạo thành đường dẫn tuyệt đối
 * @param {string} path - Đường dẫn tài liệu/ảnh (VD: /uploads/documents/file.pdf)
 * @returns {string|null} Đường dẫn đầy đủ hoặc null nếu không có path
 */
export const getFullUrl = (path) => {
  if (!path) return null;
  
  // Nếu path đã là đường dẫn tuyệt đối (chứa http/https) thì giữ nguyên
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Nối thêm domain (loại bỏ dấu '/' ở đầu path nếu có để tránh dư thừa)
  return `${SERVER_URL}${path.startsWith('/') ? path : `/${path}`}`;
};
