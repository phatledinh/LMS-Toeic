import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

/**
 * Player HLS (.m3u8) dùng chung cho video xử lý bởi spring-video server.
 * - Safari/iOS: hỗ trợ HLS native, gán thẳng src.
 * - Trình duyệt khác: dùng hls.js để giả lập MediaSource.
 */
const HlsVideoPlayer = ({ src, className, style, ...videoProps }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      className={className}
      style={style}
      {...videoProps}
    />
  );
};

export default HlsVideoPlayer;
