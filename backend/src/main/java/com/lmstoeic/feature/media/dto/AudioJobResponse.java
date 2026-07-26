package com.lmstoeic.feature.media.dto;

import com.lmstoeic.feature.media.entity.AudioProcessingStatus;

public record AudioJobResponse(
        Long jobId,
        AudioProcessingStatus status,
        String audioUrl,
        String errorMessage,
        Integer durationSeconds,
        Long sizeBytes,
        String contentType) {
}
