package com.lmstoeic.feature.course.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lmstoeic.common.dto.ApiResponse;
import com.lmstoeic.feature.course.dto.ExerciseDto;
import com.lmstoeic.feature.course.service.ExerciseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/courses/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExerciseDto>>> getExercisesByTopic(@RequestParam Long topicId) {
        return ResponseEntity.ok(ApiResponse.success(exerciseService.getExercisesByTopic(topicId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExerciseDto>> getExerciseById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(exerciseService.getExerciseById(id)));
    }
}
