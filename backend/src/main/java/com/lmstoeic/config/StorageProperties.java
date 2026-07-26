package com.lmstoeic.config;

import java.util.ArrayList;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "storage")
public class StorageProperties {
    private final Minio minio = new Minio();
    private final Image image = new Image();
    private final Audio audio = new Audio();

    public Minio getMinio() {
        return minio;
    }

    public Image getImage() {
        return image;
    }

    public Audio getAudio() {
        return audio;
    }

    public static class Minio {
        private String endpoint;
        private String accessKey;
        private String secretKey;
        private String bucket;
        private String publicPrefix;

        public String getEndpoint() {
            return endpoint;
        }

        public void setEndpoint(String endpoint) {
            this.endpoint = endpoint;
        }

        public String getAccessKey() {
            return accessKey;
        }

        public void setAccessKey(String accessKey) {
            this.accessKey = accessKey;
        }

        public String getSecretKey() {
            return secretKey;
        }

        public void setSecretKey(String secretKey) {
            this.secretKey = secretKey;
        }

        public String getBucket() {
            return bucket;
        }

        public void setBucket(String bucket) {
            this.bucket = bucket;
        }

        public String getPublicPrefix() {
            return publicPrefix;
        }

        public void setPublicPrefix(String publicPrefix) {
            this.publicPrefix = publicPrefix;
        }
    }

    public static class Image {
        private long maxSizeBytes;
        private int maxWidth;
        private int maxHeight;
        private String outputFormat;
        private float quality;

        public long getMaxSizeBytes() {
            return maxSizeBytes;
        }

        public void setMaxSizeBytes(long maxSizeBytes) {
            this.maxSizeBytes = maxSizeBytes;
        }

        public int getMaxWidth() {
            return maxWidth;
        }

        public void setMaxWidth(int maxWidth) {
            this.maxWidth = maxWidth;
        }

        public int getMaxHeight() {
            return maxHeight;
        }

        public void setMaxHeight(int maxHeight) {
            this.maxHeight = maxHeight;
        }

        public String getOutputFormat() {
            return outputFormat;
        }

        public void setOutputFormat(String outputFormat) {
            this.outputFormat = outputFormat;
        }

        public float getQuality() {
            return quality;
        }

        public void setQuality(float quality) {
            this.quality = quality;
        }
    }

    public static class Audio {
        private long maxSizeBytes;
        private String originalPrefix;
        private String processedPrefix;
        private String targetFormat;
        private String targetContentType;
        private String bitrate;
        private int sampleRate;
        private String ffmpegPath;
        private String ffprobePath;
        private String workDir;
        private String queueKey;
        private int maxAttempts;
        private boolean workerEnabled;
        private int workerConcurrency;
        private int pollTimeoutSeconds;
        private int processingTimeoutMinutes;
        private List<String> allowedContentTypes = new ArrayList<>();
        private List<String> allowedExtensions = new ArrayList<>();

        public long getMaxSizeBytes() {
            return maxSizeBytes;
        }

        public void setMaxSizeBytes(long maxSizeBytes) {
            this.maxSizeBytes = maxSizeBytes;
        }

        public String getOriginalPrefix() {
            return originalPrefix;
        }

        public void setOriginalPrefix(String originalPrefix) {
            this.originalPrefix = originalPrefix;
        }

        public String getProcessedPrefix() {
            return processedPrefix;
        }

        public void setProcessedPrefix(String processedPrefix) {
            this.processedPrefix = processedPrefix;
        }

        public String getTargetFormat() {
            return targetFormat;
        }

        public void setTargetFormat(String targetFormat) {
            this.targetFormat = targetFormat;
        }

        public String getTargetContentType() {
            return targetContentType;
        }

        public void setTargetContentType(String targetContentType) {
            this.targetContentType = targetContentType;
        }

        public String getBitrate() {
            return bitrate;
        }

        public void setBitrate(String bitrate) {
            this.bitrate = bitrate;
        }

        public int getSampleRate() {
            return sampleRate;
        }

        public void setSampleRate(int sampleRate) {
            this.sampleRate = sampleRate;
        }

        public String getFfmpegPath() {
            return ffmpegPath;
        }

        public void setFfmpegPath(String ffmpegPath) {
            this.ffmpegPath = ffmpegPath;
        }

        public String getFfprobePath() {
            return ffprobePath;
        }

        public void setFfprobePath(String ffprobePath) {
            this.ffprobePath = ffprobePath;
        }

        public String getWorkDir() {
            return workDir;
        }

        public void setWorkDir(String workDir) {
            this.workDir = workDir;
        }

        public String getQueueKey() {
            return queueKey;
        }

        public void setQueueKey(String queueKey) {
            this.queueKey = queueKey;
        }

        public int getMaxAttempts() {
            return maxAttempts;
        }

        public void setMaxAttempts(int maxAttempts) {
            this.maxAttempts = maxAttempts;
        }

        public boolean isWorkerEnabled() {
            return workerEnabled;
        }

        public void setWorkerEnabled(boolean workerEnabled) {
            this.workerEnabled = workerEnabled;
        }

        public int getWorkerConcurrency() {
            return workerConcurrency;
        }

        public void setWorkerConcurrency(int workerConcurrency) {
            this.workerConcurrency = workerConcurrency;
        }

        public int getPollTimeoutSeconds() {
            return pollTimeoutSeconds;
        }

        public void setPollTimeoutSeconds(int pollTimeoutSeconds) {
            this.pollTimeoutSeconds = pollTimeoutSeconds;
        }

        public int getProcessingTimeoutMinutes() {
            return processingTimeoutMinutes;
        }

        public void setProcessingTimeoutMinutes(int processingTimeoutMinutes) {
            this.processingTimeoutMinutes = processingTimeoutMinutes;
        }

        public List<String> getAllowedContentTypes() {
            return allowedContentTypes;
        }

        public void setAllowedContentTypes(List<String> allowedContentTypes) {
            this.allowedContentTypes = allowedContentTypes;
        }

        public List<String> getAllowedExtensions() {
            return allowedExtensions;
        }

        public void setAllowedExtensions(List<String> allowedExtensions) {
            this.allowedExtensions = allowedExtensions;
        }
    }
}
