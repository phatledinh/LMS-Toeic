package com.lmstoeic.feature.media.service;

public record AudioProcessingResult(String outputPath, int durationSeconds, long sizeBytes) {
}
