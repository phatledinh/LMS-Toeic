package com.lmstoeic.feature.vocabulary.entity;

import java.time.LocalDateTime;

import com.lmstoeic.common.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_flashcard_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "flashcard_id"})
})
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserFlashCardProgress extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flashcard_id", nullable = false)
    private FlashCard flashCard;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    @Builder.Default
    @Column(name = "review_count")
    private Integer reviewCount = 0;

    @Column(name = "next_review_at")
    private LocalDateTime nextReviewAt;

    @Builder.Default
    @Column(name = "quiz_correct")
    private Integer quizCorrect = 0;

    @Builder.Default
    @Column(name = "quiz_wrong")
    private Integer quizWrong = 0;

    @Column(name = "last_practiced_at")
    private LocalDateTime lastPracticedAt;

    public enum Difficulty {
        EASY, MEDIUM, HARD, SKIP
    }
}
