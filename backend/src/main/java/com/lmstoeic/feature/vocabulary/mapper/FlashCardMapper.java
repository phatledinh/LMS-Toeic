package com.lmstoeic.feature.vocabulary.mapper;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.lmstoeic.feature.vocabulary.dto.FlashCardDto;
import com.lmstoeic.feature.vocabulary.entity.FlashCard;

@Component
public class FlashCardMapper {

    public FlashCardDto toDto(FlashCard entity) {
        if (entity == null) return null;

        return FlashCardDto.builder()
                .id(entity.getId())
                .word(entity.getWord())
                .phonetic(entity.getPhonetic())
                .partOfSpeech(entity.getPartOfSpeech())
                .meaningVi(entity.getMeaningVi())
                .meaningEn(entity.getMeaningEn())
                .examples(entity.getExamples())
                .imageUrl(entity.getImageUrl())
                .build();
    }

    public FlashCard toEntity(FlashCardDto dto) {
        if (dto == null) return null;

        return FlashCard.builder()
                .word(dto.getWord())
                .phonetic(dto.getPhonetic())
                .partOfSpeech(dto.getPartOfSpeech())
                .meaningVi(dto.getMeaningVi())
                .meaningEn(dto.getMeaningEn())
                .examples(dto.getExamples())
                .imageUrl(dto.getImageUrl())
                .build();
    }

    public void updateEntityFromDto(FlashCardDto dto, FlashCard entity) {
        if (dto == null || entity == null) return;

        entity.setWord(dto.getWord());
        entity.setPhonetic(dto.getPhonetic());
        entity.setPartOfSpeech(dto.getPartOfSpeech());
        entity.setMeaningVi(dto.getMeaningVi());
        entity.setMeaningEn(dto.getMeaningEn());
        entity.setExamples(dto.getExamples());
        entity.setImageUrl(dto.getImageUrl());
    }

    public List<FlashCardDto> toDtoList(List<FlashCard> entities) {
        if (entities == null) return Collections.emptyList();
        return entities.stream().map(this::toDto).collect(Collectors.toList());
    }
}
