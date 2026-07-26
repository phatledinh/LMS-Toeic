package com.lmstoeic.feature.upload;

import com.lmstoeic.storage.ObjectStorageService;
import com.lmstoeic.storage.StoredObject;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/uploads")
public class MediaController {
    private final ObjectStorageService objectStorageService;

    public MediaController(ObjectStorageService objectStorageService) {
        this.objectStorageService = objectStorageService;
    }

    @GetMapping("/**")
    public ResponseEntity<byte[]> getMedia(HttpServletRequest request) throws IOException {
        String prefix = request.getContextPath() + "/uploads/";
        String uri = request.getRequestURI();
        String objectKey = uri.startsWith(prefix) ? uri.substring(prefix.length()) : "";
        if (objectKey.isBlank() || objectKey.contains("..")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        StoredObject object = objectStorageService.getObject(objectKey);
        if (object == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        byte[] body = StreamUtils.copyToByteArray(object.content());
        String contentType = object.contentType() == null ? MediaType.APPLICATION_OCTET_STREAM_VALUE : object.contentType();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .cacheControl(CacheControl.noCache())
                .body(body);
    }
}
