package com.lmstoeic.feature.media.repository;

import com.lmstoeic.feature.media.entity.AudioProcessingJob;
import com.lmstoeic.feature.media.entity.AudioProcessingStatus;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AudioProcessingJobRepository extends JpaRepository<AudioProcessingJob, Long> {
    List<AudioProcessingJob> findByStatusInAndUpdatedAtBefore(Collection<AudioProcessingStatus> statuses, LocalDateTime updatedAt);
}
