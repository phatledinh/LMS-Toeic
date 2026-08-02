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
import com.lmstoeic.feature.course.dto.ExerciseQuestionDto;
import com.lmstoeic.feature.course.dto.ExerciseQuestionGroupDto;
import com.lmstoeic.feature.course.dto.request.ExerciseRequest;
import com.lmstoeic.feature.course.dto.request.ExerciseQuestionGroupRequest;
import com.lmstoeic.feature.course.dto.request.ExerciseQuestionRequest;
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
                .body(ApiResponse.created("Exercise created successfully", exerciseService.createExercise(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ExerciseDto>> updateExercise(
            @PathVariable Long id,
            @Valid @RequestBody ExerciseRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Exercise updated successfully", exerciseService.updateExercise(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExercise(@PathVariable Long id) {
        exerciseService.deleteExercise(id);
        return ResponseEntity.ok(ApiResponse.success("Exercise deleted successfully", null));
    }

    @PostMapping("/{exerciseId}/questions")
    public ResponseEntity<ApiResponse<ExerciseQuestionDto>> addQuestion(
            @PathVariable Long exerciseId,
            @RequestBody ExerciseQuestionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Question created successfully", exerciseService.addQuestion(exerciseId, request)));
    }

    @DeleteMapping("/questions/{questionId}")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(@PathVariable Long questionId) {
        exerciseService.deleteQuestion(questionId);
        return ResponseEntity.ok(ApiResponse.success("Question deleted successfully", null));
    }

    @PostMapping("/{exerciseId}/question-groups")
    public ResponseEntity<ApiResponse<ExerciseQuestionGroupDto>> addQuestionGroup(
            @PathVariable Long exerciseId,
            @RequestBody ExerciseQuestionGroupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Question group created successfully", exerciseService.addQuestionGroup(exerciseId, request)));
    }

    @PutMapping("/question-groups/{groupId}")
    public ResponseEntity<ApiResponse<ExerciseQuestionGroupDto>> updateQuestionGroup(
            @PathVariable Long groupId,
            @RequestBody ExerciseQuestionGroupRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Question group updated successfully", exerciseService.updateQuestionGroup(groupId, request)));
    }

    @DeleteMapping("/question-groups/{groupId}")
    public ResponseEntity<ApiResponse<Void>> deleteQuestionGroup(@PathVariable Long groupId) {
        exerciseService.deleteQuestionGroup(groupId);
        return ResponseEntity.ok(ApiResponse.success("Question group deleted successfully", null));
    }
}
