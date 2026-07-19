package com.lmstoeic.feature.vocabulary.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmstoeic.feature.vocabulary.entity.Deck;

@Repository
public interface DeckRepository extends JpaRepository<Deck, Long> {

    // Lấy tất cả deck hệ thống (cho section "Từ vựng TOEIC")
    List<Deck> findByOwnerTypeOrderByIdAsc(Deck.OwnerType ownerType);

    // Lấy tất cả deck của 1 user cụ thể
    List<Deck> findByOwnerTypeAndUserIdOrderByIdAsc(Deck.OwnerType ownerType, Long userId);

    // Kiểm tra tên deck đã tồn tại chưa (cho user)
    boolean existsByListNameAndUserId(String listName, Long userId);
}
