package com.lmstoeic.feature.course.dto.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseQuestionGroupRequest {
    private Long id;
    private Integer orderIndex;
    private String audioUrl;
    private String imageUrl;
    private String passage;
    private Long sourceTopicId;
    private List<ExerciseQuestionRequest> questions;
}
