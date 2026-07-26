package com.lmstoeic.feature.upload.dto;

public record UploadResponse(String url, String objectKey, long size, String contentType) {
}
