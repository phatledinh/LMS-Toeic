package com.lmstoeic.feature.media.service;

import com.lmstoeic.config.StorageProperties;
import com.lmstoeic.feature.media.dto.AudioJobResponse;
import com.lmstoeic.feature.media.dto.AudioUploadResponse;
import com.lmstoeic.feature.media.entity.AudioProcessingJob;
import com.lmstoeic.feature.media.entity.AudioProcessingStatus;
import com.lmstoeic.feature.media.queue.AudioJobQueue;
import com.lmstoeic.feature.media.repository.AudioProcessingJobRepository;
import com.lmstoeic.storage.ObjectStorageService;
import java.io.IOException;
import java.io.InputStream;
import java.text.Normalizer;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AudioUploadService {
    private static final Pattern DIACRITICS = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");

    private final ObjectStorageService objectStorageService;
    private final StorageProperties storageProperties;
    private final AudioProcessingJobRepository jobRepository;
    private final AudioJobQueue audioJobQueue;

    public AudioUploadService(ObjectStorageService objectStorageService, StorageProperties storageProperties,
            AudioProcessingJobRepository jobRepository, AudioJobQueue audioJobQueue) {
        this.objectStorageService = objectStorageService;
        this.storageProperties = storageProperties;
        this.jobRepository = jobRepository;
        this.audioJobQueue = audioJobQueue;
    }

    public AudioUploadResponse upload(MultipartFile file) {
        validate(file);

        String extension = extensionOf(file.getOriginalFilename());
        String objectKey = buildObjectKey(file.getOriginalFilename(), extension);
        try (InputStream inputStream = file.getInputStream()) {
            objectStorageService.putObject(objectKey, inputStream, file.getSize(), contentType(file));
        } catch (IOException e) {
            throw new IllegalStateException("Không thể đọc file audio", e);
        }

        AudioProcessingJob job = new AudioProcessingJob();
        job.setOriginalObjectKey(objectKey);
        job.setOriginalFilename(file.getOriginalFilename());
        job.setSourceContentType(contentType(file));
        job.setTargetContentType(storageProperties.getAudio().getTargetContentType());
        job.setStatus(AudioProcessingStatus.PENDING);
        job.setAttemptCount(0);
        job.setMaxAttempts(storageProperties.getAudio().getMaxAttempts());
        job.setSizeBytes(file.getSize());
        job = jobRepository.save(job);

        audioJobQueue.enqueue(job.getId());
        return new AudioUploadResponse(job.getId(), job.getStatus(), objectKey, "/api/admin/media/audio/jobs/" + job.getId());
    }

    public AudioJobResponse getJob(Long jobId) {
        AudioProcessingJob job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy job audio"));
        return new AudioJobResponse(
                job.getId(),
                job.getStatus(),
                job.getProcessedObjectKey() == null ? null : "/media/audio/" + job.getProcessedObjectKey(),
                job.getErrorMessage(),
                job.getDurationSeconds(),
                job.getSizeBytes(),
                job.getTargetContentType());
    }

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File audio không được để trống");
        }
        if (file.getSize() > storageProperties.getAudio().getMaxSizeBytes()) {
            throw new IllegalArgumentException("File audio vượt quá dung lượng cho phép");
        }
        String contentType = contentType(file);
        if (!storageProperties.getAudio().getAllowedContentTypes().isEmpty()
                && !storageProperties.getAudio().getAllowedContentTypes().contains(contentType)) {
            throw new IllegalArgumentException("Định dạng audio không được hỗ trợ");
        }
        String extension = extensionOf(file.getOriginalFilename());
        if (!storageProperties.getAudio().getAllowedExtensions().isEmpty()
                && !storageProperties.getAudio().getAllowedExtensions().contains(extension)) {
            throw new IllegalArgumentException("Phần mở rộng file audio không được hỗ trợ");
        }
    }

    private String contentType(MultipartFile file) {
        return file.getContentType() == null || file.getContentType().isBlank()
                ? MediaType.APPLICATION_OCTET_STREAM_VALUE
                : file.getContentType();
    }

    private String buildObjectKey(String fileName, String extension) {
        String normalized = fileName == null || fileName.isBlank() ? "audio" : fileName;
        normalized = normalized.replace('\\', '/');
        String baseName = normalized.substring(normalized.lastIndexOf('/') + 1);
        int dot = baseName.lastIndexOf('.');
        if (dot > 0) {
            baseName = baseName.substring(0, dot);
        }
        String slug = slugify(baseName);
        return storageProperties.getAudio().getOriginalPrefix() + "/" + slug + "-" + UUID.randomUUID() + "." + extension;
    }

    private String extensionOf(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            return "bin";
        }
        int dot = fileName.lastIndexOf('.');
        if (dot < 0 || dot == fileName.length() - 1) {
            return "bin";
        }
        return fileName.substring(dot + 1).toLowerCase(Locale.ROOT);
    }

    private String slugify(String value) {
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD);
        String slug = DIACRITICS.matcher(normalized).replaceAll("")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");
        return slug.isBlank() ? "audio" : slug;
    }
}
