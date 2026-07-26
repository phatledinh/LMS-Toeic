package com.lmstoeic.feature.course.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseQuestionGroupDto {
    private Long id;
    private Integer orderIndex;
    private String audioUrl;
    private String imageUrl;
    private String passage;
    private Long exerciseId;
    private Long sourceTopicId;
}
