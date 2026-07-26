package com.lmstoeic.feature.media.service;

import com.lmstoeic.config.StorageProperties;
import com.lmstoeic.feature.media.entity.AudioProcessingJob;
import com.lmstoeic.feature.media.entity.AudioProcessingStatus;
import com.lmstoeic.feature.media.queue.AudioJobQueue;
import com.lmstoeic.feature.media.repository.AudioProcessingJobRepository;
import com.lmstoeic.storage.ObjectStorageService;
import com.lmstoeic.storage.StoredObject;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AudioProcessingWorker {
    private static final Logger log = LoggerFactory.getLogger(AudioProcessingWorker.class);

    private final StorageProperties storageProperties;
    private final AudioJobQueue audioJobQueue;
    private final AudioProcessingJobRepository jobRepository;
    private final ObjectStorageService objectStorageService;
    private final AudioProcessor audioProcessor;
    private ExecutorService executorService;
    private volatile boolean running;

    public AudioProcessingWorker(StorageProperties storageProperties, AudioJobQueue audioJobQueue,
            AudioProcessingJobRepository jobRepository, ObjectStorageService objectStorageService,
            AudioProcessor audioProcessor) {
        this.storageProperties = storageProperties;
        this.audioJobQueue = audioJobQueue;
        this.jobRepository = jobRepository;
        this.objectStorageService = objectStorageService;
        this.audioProcessor = audioProcessor;
    }

    @PostConstruct
    public void start() {
        if (!storageProperties.getAudio().isWorkerEnabled()) {
            return;
        }
        running = true;
        int concurrency = Math.max(1, storageProperties.getAudio().getWorkerConcurrency());
        executorService = Executors.newFixedThreadPool(concurrency);
        for (int i = 0; i < concurrency; i++) {
            executorService.submit(this::runLoop);
        }
    }

    @PreDestroy
    public void stop() {
        running = false;
        if (executorService != null) {
            executorService.shutdownNow();
        }
    }

    private void runLoop() {
        Duration timeout = Duration.ofSeconds(storageProperties.getAudio().getPollTimeoutSeconds());
        while (running && !Thread.currentThread().isInterrupted()) {
            try {
                Optional<Long> jobId = audioJobQueue.poll(timeout);
                jobId.ifPresent(this::processJob);
            } catch (Exception e) {
                if (!running || Thread.currentThread().isInterrupted()) {
                    return;
                }
                log.warn("Audio worker loop failed: {}", e.getMessage());
            }
        }
    }

    public void processJob(Long jobId) {
        AudioProcessingJob job = jobRepository.findById(jobId).orElse(null);
        if (job == null || job.getStatus() == AudioProcessingStatus.COMPLETED
                || job.getStatus() == AudioProcessingStatus.CANCELLED) {
            return;
        }

        job.setStatus(AudioProcessingStatus.PROCESSING);
        job.setAttemptCount(job.getAttemptCount() + 1);
        job.setStartedAt(LocalDateTime.now());
        job.setErrorMessage(null);
        job = jobRepository.save(job);

        Path workDir = null;
        try {
            workDir = Files.createDirectories(Path.of(storageProperties.getAudio().getWorkDir()))
                    .resolve("job-" + job.getId() + "-" + UUID.randomUUID());
            Files.createDirectories(workDir);
            Path inputFile = workDir.resolve("input");
            Path outputFile = workDir.resolve("output." + storageProperties.getAudio().getTargetFormat());
            copyObjectToFile(job.getOriginalObjectKey(), inputFile);

            AudioProcessingResult result = audioProcessor.process(inputFile, outputFile);
            String processedKey = buildProcessedKey(job.getId());
            try (InputStream inputStream = Files.newInputStream(Path.of(result.outputPath()))) {
                objectStorageService.putObject(processedKey, inputStream, result.sizeBytes(),
                        storageProperties.getAudio().getTargetContentType());
            }

            job.setProcessedObjectKey(processedKey);
            job.setTargetContentType(storageProperties.getAudio().getTargetContentType());
            job.setDurationSeconds(result.durationSeconds());
            job.setSizeBytes(result.sizeBytes());
            job.setStatus(AudioProcessingStatus.COMPLETED);
            job.setCompletedAt(LocalDateTime.now());
            jobRepository.save(job);
        } catch (Exception e) {
            handleFailure(job, e);
        } finally {
            deleteRecursively(workDir);
        }
    }

    private void handleFailure(AudioProcessingJob job, Exception e) {
        log.warn("Audio job {} failed: {}", job.getId(), e.getMessage());
        job.setErrorMessage(e.getMessage());
        if (job.getAttemptCount() < job.getMaxAttempts()) {
            job.setStatus(AudioProcessingStatus.RETRYING);
            jobRepository.save(job);
            job.setStatus(AudioProcessingStatus.PENDING);
            jobRepository.save(job);
            audioJobQueue.enqueue(job.getId());
            return;
        }
        job.setStatus(AudioProcessingStatus.FAILED);
        job.setCompletedAt(LocalDateTime.now());
        jobRepository.save(job);
    }

    private void copyObjectToFile(String objectKey, Path target) throws IOException {
        StoredObject object = objectStorageService.getObject(objectKey);
        if (object == null) {
            throw new IllegalStateException("Không tìm thấy file audio gốc");
        }
        try (InputStream inputStream = object.content()) {
            Files.copy(inputStream, target);
        }
    }

    private String buildProcessedKey(Long jobId) {
        return storageProperties.getAudio().getProcessedPrefix()
                + "/job-" + jobId + "-" + UUID.randomUUID() + "."
                + storageProperties.getAudio().getTargetFormat();
    }

    private void deleteRecursively(Path path) {
        if (path == null || !Files.exists(path)) {
            return;
        }
        try (var stream = Files.walk(path)) {
            stream.sorted((a, b) -> b.compareTo(a)).forEach(item -> {
                try {
                    Files.deleteIfExists(item);
                } catch (IOException e) {
                    log.warn("Cannot delete temp file {}", item);
                }
            });
        } catch (IOException e) {
            log.warn("Cannot clean audio temp directory {}", path);
        }
    }

    public boolean awaitTermination(long timeout, TimeUnit unit) throws InterruptedException {
        return executorService == null || executorService.awaitTermination(timeout, unit);
    }
}
