package com.lmstoeic.feature.course.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotBlank(message = "Slug is required")
    private String slug;

    private Integer durationMinutes;

    @NotNull(message = "Order index is required")
    private Integer orderIndex;

    @NotNull(message = "Status is required")
    private Boolean isActive;

    private String content;

    private String videoUrl;

    private String docUrl;

    private String docFileName;

    @NotNull(message = "Topic ID is required")
    private Long topicId;
}
