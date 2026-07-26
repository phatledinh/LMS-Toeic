package com.lmstoeic.feature.media.service;

import com.lmstoeic.config.StorageProperties;
import com.lmstoeic.feature.media.entity.AudioProcessingJob;
import com.lmstoeic.feature.media.entity.AudioProcessingStatus;
import com.lmstoeic.feature.media.queue.AudioJobQueue;
import com.lmstoeic.feature.media.repository.AudioProcessingJobRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class AudioJobRecoveryScheduler {
    private final StorageProperties storageProperties;
    private final AudioProcessingJobRepository jobRepository;
    private final AudioJobQueue audioJobQueue;

    public AudioJobRecoveryScheduler(StorageProperties storageProperties, AudioProcessingJobRepository jobRepository,
            AudioJobQueue audioJobQueue) {
        this.storageProperties = storageProperties;
        this.jobRepository = jobRepository;
        this.audioJobQueue = audioJobQueue;
    }

    @Scheduled(fixedDelay = 300000)
    public void recoverStuckJobs() {
        if (!storageProperties.getAudio().isWorkerEnabled()) {
            return;
        }
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(storageProperties.getAudio().getProcessingTimeoutMinutes());
        List<AudioProcessingJob> stuckJobs = jobRepository.findByStatusInAndUpdatedAtBefore(
                List.of(AudioProcessingStatus.PENDING, AudioProcessingStatus.PROCESSING, AudioProcessingStatus.RETRYING),
                cutoff);
        for (AudioProcessingJob job : stuckJobs) {
            if (job.getAttemptCount() >= job.getMaxAttempts()) {
                job.setStatus(AudioProcessingStatus.FAILED);
                job.setErrorMessage("Audio job quá số lần thử lại");
                job.setCompletedAt(LocalDateTime.now());
                jobRepository.save(job);
                continue;
            }
            job.setStatus(AudioProcessingStatus.PENDING);
            jobRepository.save(job);
            audioJobQueue.enqueue(job.getId());
        }
    }
}
