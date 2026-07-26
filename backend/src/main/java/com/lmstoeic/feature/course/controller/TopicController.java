package com.lmstoeic.feature.course.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lmstoeic.common.dto.ApiResponse;
import com.lmstoeic.feature.course.dto.TopicDto;
import com.lmstoeic.feature.course.service.TopicService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/courses/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TopicDto>>> getTopicsBySection(@RequestParam Long sectionId) {
        return ResponseEntity.ok(ApiResponse.success(topicService.getTopicsBySection(sectionId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TopicDto>> getTopicById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(topicService.getTopicById(id)));
    }
}
