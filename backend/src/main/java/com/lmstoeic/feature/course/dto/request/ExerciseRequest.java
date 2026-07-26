package com.lmstoeic.feature.course.dto.request;

import com.lmstoeic.feature.course.entity.ExerciseType;

import jakarta.validation.constraints.Min;
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

    @Min(value = 0, message = "Total questions must be zero or positive")
    private Integer totalQuestions;

    @Min(value = 0, message = "Order index must be zero or positive")
    private Integer orderIndex;

    private Boolean isActive;
    
    // Used when creating exercise from Admin controllers
    private Long topicId;
}
