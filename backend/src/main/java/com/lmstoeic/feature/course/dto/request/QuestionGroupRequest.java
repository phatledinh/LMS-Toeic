package com.lmstoeic.feature.course.dto.request;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionGroupRequest {

    @Min(value = 0, message = "Order index must be zero or positive")
    private Integer orderIndex;
    
    private String audioUrl;
    private String imageUrl;
    private String passage;
    private Long sourceTopicId;
    
    // For when creating through the admin endpoints:
    private Long exerciseId;
    
    private java.util.List<QuestionRequest> questions;
    private java.util.List<GroupContentBlockRequest> contentBlocks;
}
