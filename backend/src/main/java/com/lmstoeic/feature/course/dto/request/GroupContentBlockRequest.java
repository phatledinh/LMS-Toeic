package com.lmstoeic.feature.course.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupContentBlockRequest {
    private String blockType;
    private String content;
    private String imageUrl;
    private Integer orderIndex;
}
