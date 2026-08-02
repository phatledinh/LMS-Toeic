package com.lmstoeic.feature.course.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record ExerciseDetailDto(
        Long id,
        String exerciseType,
        Integer totalQuestions,
        Integer orderIndex,
        String topicName,
        String topicSlug,
        String sectionSlug,
        List<ExerciseQuestionDto> questions,
        List<ExerciseQuestionGroupDto> questionGroups
) {
}
