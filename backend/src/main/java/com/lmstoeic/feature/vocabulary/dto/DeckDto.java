package com.lmstoeic.feature.vocabulary.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeckDto {

    private Long id;
    private String listName;
    private String description;
    private String ownerType;
    private Integer wordCount;
    private List<FlashCardDto> flashCards;
}
