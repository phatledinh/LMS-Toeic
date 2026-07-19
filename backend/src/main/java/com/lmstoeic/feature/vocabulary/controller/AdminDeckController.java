package com.lmstoeic.feature.vocabulary.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lmstoeic.common.dto.ApiResponse;
import com.lmstoeic.feature.vocabulary.dto.DeckDto;
import com.lmstoeic.feature.vocabulary.dto.FlashCardDto;
import com.lmstoeic.feature.vocabulary.service.DeckService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminDeckController {

    private final DeckService deckService;

    // ==================== SYSTEM DECKS ====================

    @PostMapping("/decks")
    public ResponseEntity<ApiResponse<DeckDto>> createSystemDeck(@RequestBody DeckDto dto) {
        DeckDto created = deckService.createSystemDeck(dto);
        return ResponseEntity.ok(ApiResponse.success("Tạo bộ từ vựng hệ thống thành công", created));
    }

    @PutMapping("/decks/{id}")
    public ResponseEntity<ApiResponse<DeckDto>> updateSystemDeck(@PathVariable Long id, @RequestBody DeckDto dto) {
        DeckDto updated = deckService.updateSystemDeck(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật bộ từ vựng hệ thống thành công", updated));
    }

    @DeleteMapping("/decks/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSystemDeck(@PathVariable Long id) {
        deckService.deleteSystemDeck(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa bộ từ vựng hệ thống thành công", null));
    }

    // ==================== SYSTEM FLASHCARDS ====================

    @PostMapping("/decks/{deckId}/flashcards")
    public ResponseEntity<ApiResponse<FlashCardDto>> addSystemFlashCard(@PathVariable Long deckId, @RequestBody FlashCardDto dto) {
        FlashCardDto created = deckService.addSystemFlashCard(deckId, dto);
        return ResponseEntity.ok(ApiResponse.success("Thêm từ vựng hệ thống thành công", created));
    }

    @PutMapping("/flashcards/{id}")
    public ResponseEntity<ApiResponse<FlashCardDto>> updateSystemFlashCard(@PathVariable Long id, @RequestBody FlashCardDto dto) {
        FlashCardDto updated = deckService.updateSystemFlashCard(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật từ vựng hệ thống thành công", updated));
    }

    @DeleteMapping("/flashcards/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSystemFlashCard(@PathVariable Long id) {
        deckService.deleteSystemFlashCard(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa từ vựng hệ thống thành công", null));
    }
}
