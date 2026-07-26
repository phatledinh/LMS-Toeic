package com.lmstoeic.feature.course.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String slug;

    @Min(value = 0, message = "Duration must be zero or positive")
    private Integer durationMinutes;

    @Min(value = 0, message = "Order index must be zero or positive")
    private Integer orderIndex;

    private Boolean isActive;
    
    // Used when creating lesson from Admin controllers
    private Long topicId;
}
