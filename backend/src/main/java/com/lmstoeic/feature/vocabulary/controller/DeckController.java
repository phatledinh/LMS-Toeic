package com.lmstoeic.feature.vocabulary.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class DeckController {

    private final DeckService deckService;

    // ==================== API Hệ thống (Section "Từ vựng TOEIC") ====================

    /**
     * GET /api/v1/decks/system — Lấy tất cả deck hệ thống
     */
    @GetMapping("/decks/system")
    public ResponseEntity<ApiResponse<List<DeckDto>>> getSystemDecks() {
        List<DeckDto> decks = deckService.getSystemDecks();
        return ResponseEntity.ok(ApiResponse.success(decks));
    }

    /**
     * GET /api/v1/decks/{id} — Lấy chi tiết 1 deck kèm flashcards
     */
    @GetMapping("/decks/{id}")
    public ResponseEntity<ApiResponse<DeckDto>> getDeckById(@PathVariable Long id) {
        DeckDto deck = deckService.getDeckById(id);
        return ResponseEntity.ok(ApiResponse.success(deck));
    }

    // ==================== API Flashcard cá nhân (Header) ====================

    /**
     * GET /api/v1/decks/my — Lấy tất cả deck của user hiện tại
     */
    @GetMapping("/decks/my")
    public ResponseEntity<ApiResponse<List<DeckDto>>> getMyDecks() {
        // TODO: Lấy userId từ SecurityContext khi tích hợp JWT
        Long userId = getCurrentUserId();
        List<DeckDto> decks = deckService.getUserDecks(userId);
        return ResponseEntity.ok(ApiResponse.success(decks));
    }

    /**
     * POST /api/v1/decks/my — Tạo deck mới
     */
    @PostMapping("/decks/my")
    public ResponseEntity<ApiResponse<DeckDto>> createMyDeck(@RequestBody DeckDto dto) {
        Long userId = getCurrentUserId();
        DeckDto created = deckService.createUserDeck(userId, dto);
        return ResponseEntity.ok(ApiResponse.success("Tạo bộ từ vựng thành công", created));
    }

    /**
     * PUT /api/v1/decks/my/{id} — Cập nhật deck
     */
    @PutMapping("/decks/my/{id}")
    public ResponseEntity<ApiResponse<DeckDto>> updateMyDeck(
            @PathVariable Long id, @RequestBody DeckDto dto) {
        Long userId = getCurrentUserId();
        DeckDto updated = deckService.updateUserDeck(userId, id, dto);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", updated));
    }

    /**
     * DELETE /api/v1/decks/my/{id} — Xóa deck
     */
    @DeleteMapping("/decks/my/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMyDeck(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        deckService.deleteUserDeck(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Xóa thành công", null));
    }

    // ==================== FlashCard CRUD trong Deck ====================

    /**
     * POST /api/v1/decks/{deckId}/flashcards — Thêm flashcard vào deck
     */
    @PostMapping("/decks/{deckId}/flashcards")
    public ResponseEntity<ApiResponse<FlashCardDto>> addFlashCard(
            @PathVariable Long deckId, @RequestBody FlashCardDto dto) {
        Long userId = getCurrentUserId();
        FlashCardDto created = deckService.addFlashCard(userId, deckId, dto);
        return ResponseEntity.ok(ApiResponse.success("Thêm từ vựng thành công", created));
    }

    /**
     * PUT /api/v1/flashcards/{id} — Cập nhật flashcard
     */
    @PutMapping("/flashcards/{id}")
    public ResponseEntity<ApiResponse<FlashCardDto>> updateFlashCard(
            @PathVariable Long id, @RequestBody FlashCardDto dto) {
        Long userId = getCurrentUserId();
        FlashCardDto updated = deckService.updateFlashCard(userId, id, dto);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật từ vựng thành công", updated));
    }

    /**
     * DELETE /api/v1/flashcards/{id} — Xóa flashcard
     */
    @DeleteMapping("/flashcards/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFlashCard(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        deckService.deleteFlashCard(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Xóa từ vựng thành công", null));
    }

    // ==================== Helper ====================

    /**
     * Lấy userId từ SecurityContext.
     * TODO: Thay bằng logic JWT thực tế khi đã tích hợp.
     */
    private Long getCurrentUserId() {
        try {
            org.springframework.security.core.Authentication auth =
                    org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof com.lmstoeic.feature.user.entity.User user) {
                return user.getId();
            }
        } catch (Exception ignored) {}
        return 1L; // fallback for development
    }
}
