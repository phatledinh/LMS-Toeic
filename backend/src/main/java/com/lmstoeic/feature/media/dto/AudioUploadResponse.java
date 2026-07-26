package com.lmstoeic.feature.media.dto;

import com.lmstoeic.feature.media.entity.AudioProcessingStatus;

public record AudioUploadResponse(
        Long jobId,
        AudioProcessingStatus status,
        String originalObjectKey,
        String statusUrl) {
}
