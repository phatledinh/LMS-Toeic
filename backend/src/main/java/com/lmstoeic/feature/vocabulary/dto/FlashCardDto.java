package com.lmstoeic.feature.vocabulary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlashCardDto {

    private Long id;
    private String word;
    private String phonetic;
    private String partOfSpeech;
    private String meaningVi;
    private String meaningEn;
    private String examples;
    private String imageUrl;
}
