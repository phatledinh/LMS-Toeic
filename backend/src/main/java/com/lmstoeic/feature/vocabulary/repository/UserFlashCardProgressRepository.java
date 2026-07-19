package com.lmstoeic.feature.vocabulary.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmstoeic.feature.vocabulary.entity.UserFlashCardProgress;

@Repository
public interface UserFlashCardProgressRepository extends JpaRepository<UserFlashCardProgress, Long> {

    Optional<UserFlashCardProgress> findByUserIdAndFlashCardId(Long userId, Long flashCardId);

    List<UserFlashCardProgress> findByUserIdAndFlashCardDeckId(Long userId, Long deckId);
}
