package com.lmstoeic.feature.upload;

import com.lmstoeic.common.dto.ApiResponse;
import com.lmstoeic.config.StorageProperties;
import com.lmstoeic.feature.upload.dto.UploadResponse;
import com.lmstoeic.media.ImageProcessingService;
import com.lmstoeic.media.ProcessedImage;
import com.lmstoeic.storage.ObjectStorageService;
import java.io.ByteArrayInputStream;
import java.text.Normalizer;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1")
public class UploadController {
    private static final Pattern DIACRITICS = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
    private final ImageProcessingService imageProcessingService;
    private final ObjectStorageService objectStorageService;
    private final StorageProperties storageProperties;

    public UploadController(ImageProcessingService imageProcessingService,
            ObjectStorageService objectStorageService,
            StorageProperties storageProperties) {
        this.imageProcessingService = imageProcessingService;
        this.objectStorageService = objectStorageService;
        this.storageProperties = storageProperties;
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<UploadResponse>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "fileName", required = false) String fileName) {
        ProcessedImage image = imageProcessingService.process(file);
        String objectKey = buildObjectKey(fileName, image.extension());
        objectStorageService.putObject(objectKey, new ByteArrayInputStream(image.content()), image.content().length,
                image.contentType());
        String publicPrefix = storageProperties.getMinio().getPublicPrefix();
        String url = publicPrefix.replaceAll("/+$", "") + "/" + objectKey;
        UploadResponse response = new UploadResponse(url, objectKey, image.content().length, image.contentType());
        return ResponseEntity.ok(ApiResponse.success("Tải ảnh thành công", response));
    }

    private String buildObjectKey(String fileName, String extension) {
        String normalized = fileName == null || fileName.isBlank() ? "flashcard/image" : fileName;
        normalized = normalized.replace('\\', '/');
        String baseName = normalized.substring(normalized.lastIndexOf('/') + 1);
        int dot = baseName.lastIndexOf('.');
        if (dot > 0) {
            baseName = baseName.substring(0, dot);
        }
        String slug = slugify(baseName);
        return "flashcard/" + slug + "-" + UUID.randomUUID() + "." + extension;
    }

    private String slugify(String value) {
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD);
        String slug = DIACRITICS.matcher(normalized).replaceAll("")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");
        return slug.isBlank() ? "image" : slug;
    }
}
