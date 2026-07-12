package com.lmstoeic.feature.course.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lmstoeic.common.dto.ApiResponse;
import com.lmstoeic.feature.course.dto.SectionDto;
import com.lmstoeic.feature.course.service.SectionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/courses/sections")
@RequiredArgsConstructor
public class SectionController {

    private final SectionService sectionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SectionDto>>> getAllSections() {
        return ResponseEntity.ok(ApiResponse.success(sectionService.getAllSections()));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<SectionDto>> getSectionBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(sectionService.getSectionBySlug(slug)));
    }
}
