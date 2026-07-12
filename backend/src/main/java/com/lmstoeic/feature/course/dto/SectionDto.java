package com.lmstoeic.feature.course.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SectionDto {
    private Long id;
    private String title;
    private String slug;
    private String description;
    private Integer orderIndex;
    private List<TopicDto> topics;
}
