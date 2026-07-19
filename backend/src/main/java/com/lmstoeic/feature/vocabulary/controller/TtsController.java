package com.lmstoeic.feature.vocabulary.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

/**
 * Proxy controller cho TTS (Text-to-Speech).
 * Frontend gọi /api/v1/tts?text=hello để nhận file audio MP3.
 *
 * Sử dụng Google Translate TTS API (miễn phí, không cần API key).
 * Đây là API không chính thức nhưng phù hợp cho mục đích học tập.
 */
@RestController
@RequestMapping("/api/v1")
public class TtsController {

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * GET /api/v1/tts?text=hello&lang=en
     * Trả về file audio MP3 phát âm từ vựng.
     */
    @GetMapping("/tts")
    public ResponseEntity<byte[]> textToSpeech(
            @RequestParam String text,
            @RequestParam(defaultValue = "en") String lang) {

        try {
            String url = String.format(
                    "https://translate.google.com/translate_tts?ie=UTF-8&q=%s&tl=%s&client=tw-ob",
                    java.net.URLEncoder.encode(text, "UTF-8"),
                    lang
            );

            byte[] audioBytes = restTemplate.getForObject(url, byte[].class);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.valueOf("audio/mpeg"));
            headers.set("Cache-Control", "public, max-age=86400"); // Cache 1 ngày

            return new ResponseEntity<>(audioBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
    }
}
