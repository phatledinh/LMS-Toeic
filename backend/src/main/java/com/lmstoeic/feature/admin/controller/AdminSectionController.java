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
import com.lmstoeic.feature.course.dto.SectionDto;
import com.lmstoeic.feature.course.dto.request.SectionRequest;
import com.lmstoeic.feature.course.service.SectionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/courses/sections")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminSectionController {

    private final SectionService sectionService;

    @org.springframework.web.bind.annotation.GetMapping
    public ResponseEntity<ApiResponse<java.util.List<SectionDto>>> getAllSectionsAdmin() {
        return ResponseEntity.ok(ApiResponse.success(sectionService.getAllSectionsFull()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SectionDto>> createSection(@Valid @RequestBody SectionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Section created successfully", sectionService.createSection(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SectionDto>> updateSection(@PathVariable Long id, @Valid @RequestBody SectionRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Section updated successfully", sectionService.updateSection(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSection(@PathVariable Long id) {
        sectionService.deleteSection(id);
        return ResponseEntity.ok(ApiResponse.success("Section deleted successfully", null));
    }
}
