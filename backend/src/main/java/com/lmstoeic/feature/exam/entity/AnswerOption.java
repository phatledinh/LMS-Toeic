package com.lmstoeic.feature.exam.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "answer_options")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    private String label; // A, B, C, D
    
    @Column(columnDefinition = "TEXT")
    private String content; // Nội dung đáp án (nếu có)
    
    private Boolean isCorrect;
}


