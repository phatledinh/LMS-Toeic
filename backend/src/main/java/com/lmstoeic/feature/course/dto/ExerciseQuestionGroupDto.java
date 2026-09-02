package com.lmstoeic.feature.course.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record ExerciseQuestionGroupDto(
        Long id,
        Integer orderIndex,
        String audioUrl,
        String imageUrl,
        String passage,
        List<ExerciseQuestionDto> questions
) {
}
