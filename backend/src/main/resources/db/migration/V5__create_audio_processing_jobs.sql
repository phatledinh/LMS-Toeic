CREATE TABLE audio_processing_jobs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    original_object_key VARCHAR(512) NOT NULL,
    processed_object_key VARCHAR(512),
    original_filename VARCHAR(255),
    source_content_type VARCHAR(100),
    target_content_type VARCHAR(100),
    status VARCHAR(32) NOT NULL,
    error_message TEXT,
    attempt_count INT NOT NULL DEFAULT 0,
    max_attempts INT NOT NULL DEFAULT 3,
    duration_seconds INT,
    size_bytes BIGINT,
    owner_type VARCHAR(64),
    owner_id BIGINT,
    started_at DATETIME(6),
    completed_at DATETIME(6),
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
);

CREATE INDEX idx_audio_jobs_status_created_at
    ON audio_processing_jobs(status, created_at);

CREATE INDEX idx_audio_jobs_owner
    ON audio_processing_jobs(owner_type, owner_id);
