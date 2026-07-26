package com.lmstoeic.feature.media.controller;

import com.lmstoeic.storage.ObjectMetadata;
import com.lmstoeic.storage.ObjectStorageService;
import com.lmstoeic.storage.StoredObject;
import jakarta.servlet.http.HttpServletRequest;
import java.io.InputStream;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

@RestController
@RequestMapping("/media/audio")
public class AudioStreamController {
    private final ObjectStorageService objectStorageService;

    public AudioStreamController(ObjectStorageService objectStorageService) {
        this.objectStorageService = objectStorageService;
    }

    @GetMapping("/**")
    public ResponseEntity<StreamingResponseBody> stream(HttpServletRequest request) {
        String prefix = request.getContextPath() + "/media/audio/";
        String uri = request.getRequestURI();
        String objectKey = uri.startsWith(prefix) ? uri.substring(prefix.length()) : "";
        if (objectKey.isBlank() || objectKey.contains("..")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        ObjectMetadata metadata = objectStorageService.statObject(objectKey);
        if (metadata == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        StreamingResponseBody body = outputStream -> {
            StoredObject object = objectStorageService.getObject(objectKey);
            if (object == null) {
                return;
            }
            try (InputStream inputStream = object.content()) {
                StreamUtils.copy(inputStream, outputStream);
            }
        };

        String contentType = metadata.contentType() == null ? MediaType.APPLICATION_OCTET_STREAM_VALUE : metadata.contentType();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(metadata.size()))
                .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                .cacheControl(CacheControl.noCache())
                .body(body);
    }
}
