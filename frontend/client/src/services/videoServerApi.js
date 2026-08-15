// Client cho spring-video server (HLS video processing/streaming)
// Xem: TTTN/spring-video — server độc lập, không cần JWT.
export const VIDEO_SERVER_URL = 'http://localhost:8082';

/**
 * Nhận diện 1 videoUrl có phải link HLS do spring-video sinh ra không
 * (dạng .../api/video/{id}/index.m3u8), để phân biệt với link Google Drive.
 */
export const isVideoServerUrl = (url) =>
  !!url && url.includes('/api/video/') && url.includes('/index.m3u8');

/** Lấy trạng thái xử lý của video (PROCESSING | READY | ERROR | DELETING). */
export const getVideoProfile = async (videoId) => {
  const res = await fetch(`${VIDEO_SERVER_URL}/api/video/${videoId}/profile`);
  if (!res.ok) throw new Error('Không tìm thấy video');
  return res.json();
};
