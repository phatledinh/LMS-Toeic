// Client cho spring-video server (HLS video upload/processing/streaming)
// Xem: TTTN/spring-video — server độc lập, không cần JWT.
const STORAGE_KEY = 'video_server_url';
const DEFAULT_VIDEO_SERVER_URL = 'http://localhost:8082';

/** Lấy URL video server hiện tại (đã lưu trong localStorage, hoặc mặc định localhost). */
export const getVideoServerUrl = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return (saved || DEFAULT_VIDEO_SERVER_URL).replace(/\/+$/, ''); // bỏ dấu / thừa ở cuối
};

/** Đổi URL video server (VD: khi host qua Cloudflare Tunnel, URL đổi mỗi lần restart). */
export const setVideoServerUrl = (url) => {
  const trimmed = (url || '').trim().replace(/\/+$/, '');
  if (trimmed) {
    localStorage.setItem(STORAGE_KEY, trimmed);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

/**
 * Nhận diện 1 videoUrl có phải link HLS do spring-video sinh ra không
 * (dạng .../api/video/{id}/index.m3u8), để phân biệt với link Google Drive.
 */
export const isVideoServerUrl = (url) =>
  !!url && url.includes('/api/video/') && url.includes('/index.m3u8');

/** 1. Upload file mp4 gốc lên storage của video server. */
const uploadToStorage = async (file, fileName) => {
  const formData = new FormData();
  formData.append('fileName', fileName);
  formData.append('file', file);
  const res = await fetch(`${getVideoServerUrl()}/api/storage/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Tải video lên storage thất bại');
};

/** 2. Tạo video từ file đã upload — trả về VideoProfile (status=PROCESSING). */
const createVideo = async (fileName, title) => {
  const res = await fetch(`${getVideoServerUrl()}/api/video/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName, title }),
  });
  if (!res.ok) throw new Error('Tạo video thất bại');
  return res.json();
};

/** Lấy trạng thái xử lý hiện tại của video. */
export const getVideoProfile = async (videoId) => {
  const res = await fetch(`${getVideoServerUrl()}/api/video/${videoId}/profile`);
  if (!res.ok) throw new Error('Không tìm thấy video');
  return res.json();
};

export const getVideoStreamUrl = (videoId) =>
  `${getVideoServerUrl()}/api/video/${videoId}/index.m3u8`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Upload + tạo video + poll tới khi convert xong (READY) trên video server.
 * @param {File} file - file .mp4 người dùng chọn
 * @param {(status: 'uploading'|'creating'|'processing'|'ready') => void} [onProgress]
 * @returns {Promise<string>} URL index.m3u8 khi đã READY
 */
export const processVideoOnServer = async (file, onProgress) => {
  // fileName duy nhất để tránh đè file cũ trong bucket
  const fileName = `${Date.now()}-${file.name}`;

  onProgress?.('uploading');
  await uploadToStorage(file, fileName);

  onProgress?.('creating');
  const profile = await createVideo(fileName, file.name);

  onProgress?.('processing');
  const timeoutAt = Date.now() + 5 * 60 * 1000; // chờ tối đa 5 phút
  while (Date.now() < timeoutAt) {
    await sleep(2000);
    const p = await getVideoProfile(profile.id);
    if (p.status === 'READY') {
      onProgress?.('ready');
      return getVideoStreamUrl(profile.id);
    }
    if (p.status === 'ERROR') {
      throw new Error(`Xử lý video thất bại: ${p.eventResult || 'lỗi không xác định'}`);
    }
  }
  throw new Error('Quá thời gian chờ xử lý video (5 phút)');
};
