package com.lmstoeic.feature.course.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lmstoeic.common.dto.ApiResponse;
import com.lmstoeic.feature.course.dto.LessonDto;
import com.lmstoeic.feature.course.service.LessonService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/courses/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<LessonDto>>> getLessonsByTopic(@RequestParam Long topicId) {
        return ResponseEntity.ok(ApiResponse.success(lessonService.getLessonsByTopic(topicId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LessonDto>> getLessonById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(lessonService.getLessonById(id)));
    }
}
