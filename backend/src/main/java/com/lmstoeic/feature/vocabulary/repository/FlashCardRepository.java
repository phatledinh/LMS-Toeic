package com.lmstoeic.feature.vocabulary.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmstoeic.feature.vocabulary.entity.FlashCard;

@Repository
public interface FlashCardRepository extends JpaRepository<FlashCard, Long> {

    List<FlashCard> findByDeckIdOrderByIdAsc(Long deckId);
}
