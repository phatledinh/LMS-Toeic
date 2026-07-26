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
import com.lmstoeic.feature.course.dto.ExerciseQuestionGroupDto;
import com.lmstoeic.feature.course.dto.request.QuestionGroupRequest;
import com.lmstoeic.feature.course.service.ExerciseQuestionGroupService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/courses/question-groups")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminQuestionGroupController {

    private final ExerciseQuestionGroupService questionGroupService;

    @PostMapping
    public ResponseEntity<ApiResponse<ExerciseQuestionGroupDto>> createQuestionGroup(@Valid @RequestBody QuestionGroupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Question Group created successfully", questionGroupService.createQuestionGroup(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ExerciseQuestionGroupDto>> updateQuestionGroup(@PathVariable Long id, @Valid @RequestBody QuestionGroupRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Question Group updated successfully", questionGroupService.updateQuestionGroup(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteQuestionGroup(@PathVariable Long id) {
        questionGroupService.deleteQuestionGroup(id);
        return ResponseEntity.ok(ApiResponse.success("Question Group deleted successfully", null));
    }
}
