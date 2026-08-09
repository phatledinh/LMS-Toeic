package com.lmstoeic.feature.course.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionRequest {

    private Integer questionNumber;
    private Integer audioStartMs;
    private Integer audioEndMs;

    private String content;
    
    @NotBlank(message = "Option A is required")
    private String optionA;
    
    @NotBlank(message = "Option B is required")
    private String optionB;
    
    @NotBlank(message = "Option C is required")
    private String optionC;
    
    @NotBlank(message = "Option D is required")
    private String optionD;
    
    @NotBlank(message = "Correct answer is required")
    private String correctAnswer;
    
    private String explanation;
    
    private Long sourceTopicId;
    
    // Links to exercise or question group
    private Long exerciseId;
    private Long groupId;
}
