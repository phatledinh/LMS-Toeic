import { useState, useEffect, useRef } from 'react';

/**
 * Hook phân tích audio file bằng Web Audio API,
 * tìm khoảng lặng và chia thành các segments (mỗi segment = 1 câu nói).
 *
 * @param {string} audioUrl - URL file audio cần phân tích
 * @param {Object} options - Tùy chọn
 * @param {number} options.silenceThreshold - Ngưỡng RMS để coi là im lặng (mặc định: 0.015)
 * @param {number} options.minSilenceDuration - Khoảng lặng tối thiểu (giây) để tách segment (mặc định: 0.35)
 * @param {number} options.minSegmentDuration - Segment ngắn nhất (giây), tránh tách vụn (mặc định: 0.5)
 * @returns {{ segments: Array<{start: number, end: number}>, loading: boolean, error: string|null }}
 */
export function useSilenceDetection(audioUrl, options = {}) {
  const {
    silenceThreshold = 0.015,
    minSilenceDuration = 0.35,
    minSegmentDuration = 0.5,
  } = options;

  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const prevUrlRef = useRef(null);

  useEffect(() => {
    if (!audioUrl || audioUrl === prevUrlRef.current) return;
    prevUrlRef.current = audioUrl;

    let cancelled = false;

    const analyzeAudio = async () => {
      setLoading(true);
      setError(null);
      setSegments([]);

      try {
        // 1. Fetch audio file
        const response = await fetch(audioUrl);
        if (!response.ok) throw new Error('Không thể tải file audio');
        const arrayBuffer = await response.arrayBuffer();

        // 2. Decode audio data
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        audioCtx.close();

        if (cancelled) return;

        // 3. Lấy channel data (mono — trộn nếu stereo)
        const channelData = getMonoChannelData(audioBuffer);
        const sampleRate = audioBuffer.sampleRate;
        const duration = audioBuffer.duration;

        // 4. Tính RMS theo frames (~50ms mỗi frame)
        const frameSize = Math.floor(sampleRate * 0.05); // 50ms
        const rmsValues = calculateRMS(channelData, frameSize);
        const frameDuration = frameSize / sampleRate;

        // 5. Tìm khoảng lặng
        const silenceRegions = findSilenceRegions(
          rmsValues,
          frameDuration,
          silenceThreshold,
          minSilenceDuration
        );

        // 6. Chia thành segments
        const rawSegments = createSegments(silenceRegions, duration);

        // 7. Lọc bỏ segment quá ngắn (merge vào segment liền kề)
        const filteredSegments = mergeShortSegments(rawSegments, minSegmentDuration);

        if (!cancelled) {
          setSegments(filteredSegments);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Silence detection error:', err);
          setError(err.message || 'Lỗi phân tích audio');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    analyzeAudio();

    return () => {
      cancelled = true;
    };
  }, [audioUrl, silenceThreshold, minSilenceDuration, minSegmentDuration]);

  return { segments, loading, error };
}

/**
 * Trộn tất cả channels thành mono
 */
function getMonoChannelData(audioBuffer) {
  if (audioBuffer.numberOfChannels === 1) {
    return audioBuffer.getChannelData(0);
  }

  const length = audioBuffer.length;
  const mono = new Float32Array(length);
  const numChannels = audioBuffer.numberOfChannels;

  for (let ch = 0; ch < numChannels; ch++) {
    const channel = audioBuffer.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      mono[i] += channel[i];
    }
  }

  for (let i = 0; i < length; i++) {
    mono[i] /= numChannels;
  }

  return mono;
}

/**
 * Tính RMS (Root Mean Square) cho mỗi frame
 */
function calculateRMS(channelData, frameSize) {
  const numFrames = Math.floor(channelData.length / frameSize);
  const rmsValues = new Float32Array(numFrames);

  for (let i = 0; i < numFrames; i++) {
    let sumSquares = 0;
    const offset = i * frameSize;
    for (let j = 0; j < frameSize; j++) {
      const sample = channelData[offset + j];
      sumSquares += sample * sample;
    }
    rmsValues[i] = Math.sqrt(sumSquares / frameSize);
  }

  return rmsValues;
}

/**
 * Tìm các vùng im lặng liên tục
 * @returns {Array<{start: number, end: number}>} danh sách vùng lặng (giây)
 */
function findSilenceRegions(rmsValues, frameDuration, threshold, minDuration) {
  const regions = [];
  let silenceStart = null;

  for (let i = 0; i < rmsValues.length; i++) {
    const time = i * frameDuration;
    const isSilent = rmsValues[i] < threshold;

    if (isSilent && silenceStart === null) {
      silenceStart = time;
    } else if (!isSilent && silenceStart !== null) {
      const silenceDuration = time - silenceStart;
      if (silenceDuration >= minDuration) {
        regions.push({
          start: silenceStart,
          end: time,
        });
      }
      silenceStart = null;
    }
  }

  // Xử lý trường hợp audio kết thúc bằng silence
  if (silenceStart !== null) {
    const endTime = rmsValues.length * frameDuration;
    const silenceDuration = endTime - silenceStart;
    if (silenceDuration >= minDuration) {
      regions.push({ start: silenceStart, end: endTime });
    }
  }

  return regions;
}

/**
 * Tạo segments từ các vùng lặng
 * Mỗi segment = khoảng giữa 2 vùng lặng liên tiếp (= 1 câu nói)
 */
function createSegments(silenceRegions, totalDuration) {
  if (silenceRegions.length === 0) {
    return [{ start: 0, end: totalDuration }];
  }

  const segments = [];
  let currentStart = 0;

  for (const silence of silenceRegions) {
    // Segment = từ cuối vùng lặng trước đến đầu vùng lặng hiện tại
    if (silence.start > currentStart) {
      segments.push({
        start: currentStart,
        end: silence.start,
      });
    }
    // Vùng lặng giữa 2 câu → lấy điểm giữa làm ranh giới
    currentStart = silence.end;
  }

  // Segment cuối cùng
  if (currentStart < totalDuration - 0.1) {
    segments.push({
      start: currentStart,
      end: totalDuration,
    });
  }

  return segments;
}

/**
 * Merge các segment quá ngắn vào segment liền kề
 */
function mergeShortSegments(segments, minDuration) {
  if (segments.length <= 1) return segments;

  const merged = [segments[0]];

  for (let i = 1; i < segments.length; i++) {
    const current = segments[i];
    const last = merged[merged.length - 1];
    const currentDuration = current.end - current.start;

    if (currentDuration < minDuration) {
      // Merge vào segment trước
      last.end = current.end;
    } else {
      merged.push({ ...current });
    }
  }

  return merged;
}

export default useSilenceDetection;
