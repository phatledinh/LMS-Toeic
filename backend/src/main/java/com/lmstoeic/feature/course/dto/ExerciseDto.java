package com.lmstoeic.feature.course.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseDto {
    private Long id;
    private String exerciseType;

    private Integer orderIndex;
    private String fullAudioUrl;
    private Integer audioDurationMs;
    private String audioVersion;
    private String readingImageMode;
    private String readingImageUrl;
    private String readingImageUrls;
    private java.util.List<ExerciseQuestionDto> questions;
    private java.util.List<ExerciseQuestionGroupDto> questionGroups;
}
