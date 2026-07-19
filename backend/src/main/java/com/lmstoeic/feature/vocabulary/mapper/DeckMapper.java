package com.lmstoeic.feature.vocabulary.mapper;

import java.util.Collections;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.lmstoeic.feature.vocabulary.dto.DeckDto;
import com.lmstoeic.feature.vocabulary.entity.Deck;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DeckMapper {

    private final FlashCardMapper flashCardMapper;

    /**
     * Entity → DTO đơn giản (không kèm flashcards – dùng cho danh sách)
     */
    public DeckDto toDto(Deck deck) {
        if (deck == null)
            return null;

        return DeckDto.builder()
                .id(deck.getId())
                .listName(deck.getListName())
                .description(deck.getDescription())
                .ownerType(deck.getOwnerType().name())
                .wordCount(deck.getFlashCards() != null ? deck.getFlashCards().size() : 0)
                .build();
    }

    /**
     * Entity → DTO đầy đủ kèm flashcards (dùng khi GET chi tiết 1 deck)
     */
    public DeckDto toDtoWithFlashCards(Deck deck) {
        if (deck == null)
            return null;

        return DeckDto.builder()
                .id(deck.getId())
                .listName(deck.getListName())
                .description(deck.getDescription())
                .ownerType(deck.getOwnerType().name())
                .wordCount(deck.getFlashCards() != null ? deck.getFlashCards().size() : 0)
                .flashCards(deck.getFlashCards() != null
                        ? deck.getFlashCards().stream()
                                .map(flashCardMapper::toDto)
                                .collect(Collectors.toList())
                        : Collections.emptyList())
                .build();
    }

    /**
     * DTO → Entity (dùng khi tạo mới)
     */
    public Deck toEntity(DeckDto dto) {
        if (dto == null)
            return null;

        return Deck.builder()
                .listName(dto.getListName())
                .description(dto.getDescription())
                .ownerType(Deck.OwnerType.valueOf(dto.getOwnerType() != null ? dto.getOwnerType() : "SYSTEM"))
                .build();
    }

    /**
     * Update Entity từ DTO (dùng khi cập nhật)
     */
    public void updateEntityFromDto(DeckDto dto, Deck deck) {
        if (dto == null || deck == null)
            return;

        deck.setListName(dto.getListName());
        deck.setDescription(dto.getDescription());
    }
}
