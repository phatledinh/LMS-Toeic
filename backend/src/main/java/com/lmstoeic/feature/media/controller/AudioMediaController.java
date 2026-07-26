package com.lmstoeic.feature.media.controller;

import com.lmstoeic.common.dto.ApiResponse;
import com.lmstoeic.feature.media.dto.AudioJobResponse;
import com.lmstoeic.feature.media.dto.AudioUploadResponse;
import com.lmstoeic.feature.media.service.AudioUploadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/media/audio")
public class AudioMediaController {
    private final AudioUploadService audioUploadService;

    public AudioMediaController(AudioUploadService audioUploadService) {
        this.audioUploadService = audioUploadService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AudioUploadResponse>> upload(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.success("Tải audio lên thành công", audioUploadService.upload(file)));
    }

    @GetMapping("/jobs/{jobId}")
    public ResponseEntity<ApiResponse<AudioJobResponse>> getJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(ApiResponse.success(audioUploadService.getJob(jobId)));
    }
}
