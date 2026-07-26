package com.lmstoeic.feature.media.entity;

import com.lmstoeic.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "audio_processing_jobs")
public class AudioProcessingJob extends BaseEntity {
    @Column(name = "original_object_key", nullable = false, length = 512)
    private String originalObjectKey;

    @Column(name = "processed_object_key", length = 512)
    private String processedObjectKey;

    @Column(name = "original_filename")
    private String originalFilename;

    @Column(name = "source_content_type", length = 100)
    private String sourceContentType;

    @Column(name = "target_content_type", length = 100)
    private String targetContentType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private AudioProcessingStatus status = AudioProcessingStatus.PENDING;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "attempt_count", nullable = false)
    private int attemptCount;

    @Column(name = "max_attempts", nullable = false)
    private int maxAttempts = 3;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "size_bytes")
    private Long sizeBytes;

    @Column(name = "owner_type", length = 64)
    private String ownerType;

    @Column(name = "owner_id")
    private Long ownerId;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}
