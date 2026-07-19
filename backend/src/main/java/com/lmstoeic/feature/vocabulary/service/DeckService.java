package com.lmstoeic.feature.vocabulary.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lmstoeic.feature.vocabulary.dto.DeckDto;
import com.lmstoeic.feature.vocabulary.dto.FlashCardDto;
import com.lmstoeic.feature.vocabulary.entity.Deck;
import com.lmstoeic.feature.vocabulary.entity.FlashCard;
import com.lmstoeic.feature.vocabulary.mapper.DeckMapper;
import com.lmstoeic.feature.vocabulary.mapper.FlashCardMapper;
import com.lmstoeic.feature.vocabulary.repository.DeckRepository;
import com.lmstoeic.feature.vocabulary.repository.FlashCardRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeckService {

    private final DeckRepository deckRepository;
    private final FlashCardRepository flashCardRepository;
    private final DeckMapper deckMapper;
    private final FlashCardMapper flashCardMapper;

    // ==================== System Decks (Section Từ vựng) ====================

    /**
     * Lấy tất cả deck hệ thống (cho section "Từ vựng TOEIC")
     */
    public List<DeckDto> getSystemDecks() {
        List<Deck> decks = deckRepository.findByOwnerTypeOrderByIdAsc(Deck.OwnerType.SYSTEM);
        return decks.stream().map(deckMapper::toDto).collect(Collectors.toList());
    }

    /**
     * Lấy chi tiết 1 deck kèm flashcards
     */
    public DeckDto getDeckById(Long id) {
        Deck deck = deckRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Deck not found"));
        return deckMapper.toDtoWithFlashCards(deck);
    }

    // ==================== User Decks (Flashcard cá nhân) ====================

    /**
     * Lấy tất cả deck của user
     */
    public List<DeckDto> getUserDecks(Long userId) {
        List<Deck> decks = deckRepository.findByOwnerTypeAndUserIdOrderByIdAsc(Deck.OwnerType.USER, userId);
        return decks.stream().map(deckMapper::toDto).collect(Collectors.toList());
    }

    /**
     * Tạo deck mới cho user
     */
    @Transactional
    public DeckDto createUserDeck(Long userId, DeckDto dto) {
        Deck deck = Deck.builder()
                .listName(dto.getListName())
                .ownerType(Deck.OwnerType.USER)
                .userId(userId)
                .build();

        Deck saved = deckRepository.save(deck);
        return deckMapper.toDto(saved);
    }

    /**
     * Cập nhật deck của user
     */
    @Transactional
    public DeckDto updateUserDeck(Long userId, Long deckId, DeckDto dto) {
        Deck deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new RuntimeException("Deck not found"));

        if (!deck.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        deckMapper.updateEntityFromDto(dto, deck);
        Deck saved = deckRepository.save(deck);
        return deckMapper.toDto(saved);
    }

    /**
     * Xóa deck của user
     */
    @Transactional
    public void deleteUserDeck(Long userId, Long deckId) {
        Deck deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new RuntimeException("Deck not found"));

        if (!deck.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        deckRepository.delete(deck);
    }

    // ==================== FlashCard CRUD (trong 1 deck) ====================

    /**
     * Thêm flashcard vào deck
     */
    @Transactional
    public FlashCardDto addFlashCard(Long userId, Long deckId, FlashCardDto dto) {
        Deck deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new RuntimeException("Deck not found"));

        // Chỉ user sở hữu mới được thêm vào deck USER
        if (deck.getOwnerType() == Deck.OwnerType.USER && !deck.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        FlashCard card = flashCardMapper.toEntity(dto);
        card.setDeck(deck);
        FlashCard saved = flashCardRepository.save(card);
        return flashCardMapper.toDto(saved);
    }

    /**
     * Cập nhật flashcard
     */
    @Transactional
    public FlashCardDto updateFlashCard(Long userId, Long cardId, FlashCardDto dto) {
        FlashCard card = flashCardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("FlashCard not found"));

        Deck deck = card.getDeck();
        if (deck.getOwnerType() == Deck.OwnerType.USER && !deck.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        flashCardMapper.updateEntityFromDto(dto, card);
        FlashCard saved = flashCardRepository.save(card);
        return flashCardMapper.toDto(saved);
    }

    /**
     * Xóa flashcard
     */
    @Transactional
    public void deleteFlashCard(Long userId, Long cardId) {
        FlashCard card = flashCardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("FlashCard not found"));

        Deck deck = card.getDeck();
        if (deck.getOwnerType() == Deck.OwnerType.USER && !deck.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        flashCardRepository.delete(card);
    }

    // ==================== Admin Methods (System Decks) ====================

    @Transactional
    public DeckDto createSystemDeck(DeckDto dto) {
        Deck deck = Deck.builder()
                .listName(dto.getListName())
                .description(dto.getDescription())
                .ownerType(Deck.OwnerType.SYSTEM)
                .build();
        Deck saved = deckRepository.save(deck);
        return deckMapper.toDto(saved);
    }

    @Transactional
    public DeckDto updateSystemDeck(Long deckId, DeckDto dto) {
        Deck deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new RuntimeException("Deck not found"));
        if (deck.getOwnerType() != Deck.OwnerType.SYSTEM) {
            throw new RuntimeException("Not a system deck");
        }
        deckMapper.updateEntityFromDto(dto, deck);
        Deck saved = deckRepository.save(deck);
        return deckMapper.toDto(saved);
    }

    @Transactional
    public void deleteSystemDeck(Long deckId) {
        Deck deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new RuntimeException("Deck not found"));
        if (deck.getOwnerType() != Deck.OwnerType.SYSTEM) {
            throw new RuntimeException("Not a system deck");
        }
        deckRepository.delete(deck);
    }

    @Transactional
    public FlashCardDto addSystemFlashCard(Long deckId, FlashCardDto dto) {
        Deck deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new RuntimeException("Deck not found"));
        if (deck.getOwnerType() != Deck.OwnerType.SYSTEM) {
            throw new RuntimeException("Not a system deck");
        }
        FlashCard card = flashCardMapper.toEntity(dto);
        card.setDeck(deck);
        FlashCard saved = flashCardRepository.save(card);
        return flashCardMapper.toDto(saved);
    }

    @Transactional
    public FlashCardDto updateSystemFlashCard(Long cardId, FlashCardDto dto) {
        FlashCard card = flashCardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("FlashCard not found"));
        if (card.getDeck().getOwnerType() != Deck.OwnerType.SYSTEM) {
            throw new RuntimeException("Not a system flashcard");
        }
        flashCardMapper.updateEntityFromDto(dto, card);
        FlashCard saved = flashCardRepository.save(card);
        return flashCardMapper.toDto(saved);
    }

    @Transactional
    public void deleteSystemFlashCard(Long cardId) {
        FlashCard card = flashCardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("FlashCard not found"));
        if (card.getDeck().getOwnerType() != Deck.OwnerType.SYSTEM) {
            throw new RuntimeException("Not a system flashcard");
        }
        flashCardRepository.delete(card);
    }
}
