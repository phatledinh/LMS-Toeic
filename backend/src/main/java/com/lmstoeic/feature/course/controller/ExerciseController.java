package com.lmstoeic.feature.course.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lmstoeic.common.dto.ApiResponse;
import com.lmstoeic.feature.course.dto.ExerciseDetailDto;
import com.lmstoeic.feature.course.service.ExerciseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExerciseDetailDto>> getExerciseDetail(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(exerciseService.getExerciseDetail(id)));
    }
}
