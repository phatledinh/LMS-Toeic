package com.lmstoeic.feature.admin.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lmstoeic.common.dto.ApiResponse;
import com.lmstoeic.feature.course.dto.ExerciseDto;
import com.lmstoeic.feature.course.dto.request.ExerciseRequest;
import com.lmstoeic.feature.course.service.ExerciseService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/courses/exercises")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminExerciseController {

    private final ExerciseService exerciseService;

    @PostMapping
    public ResponseEntity<ApiResponse<ExerciseDto>> createExercise(@Valid @RequestBody ExerciseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Exercise created successfully", exerciseService.createExercise(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ExerciseDto>> updateExercise(@PathVariable Long id, @Valid @RequestBody ExerciseRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Exercise updated successfully", exerciseService.updateExercise(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExercise(@PathVariable Long id) {
        exerciseService.deleteExercise(id);
        return ResponseEntity.ok(ApiResponse.success("Exercise deleted successfully", null));
    }
}
