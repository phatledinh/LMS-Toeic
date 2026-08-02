package com.lmstoeic.feature.course.dto;

import lombok.Builder;

@Builder
public record ExerciseQuestionDto(
        Long id,
        Integer questionNumber,
        String content,
        String optionA,
        String optionB,
        String optionC,
        String optionD,
        String correctAnswer,
        String explanation
) {
}
