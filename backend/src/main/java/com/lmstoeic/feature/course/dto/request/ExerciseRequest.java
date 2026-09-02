package com.lmstoeic.feature.course.dto.request;

import com.lmstoeic.feature.course.entity.ExerciseType;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseRequest {
    @NotNull(message = "Exercise type is required")
    private ExerciseType exerciseType;

    private Integer totalQuestions;

    @NotNull(message = "Order index is required")
    private Integer orderIndex;

    @NotNull(message = "Status is required")
    private Boolean isActive;

    @NotNull(message = "Topic ID is required")
    private Long topicId;
}
