package com.lmstoeic.feature.exam.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_group_id")
    private QuestionGroup questionGroup;
    
    private Integer questionNumber; // Số thứ tự câu hỏi (1 -> 200)

    @Column(columnDefinition = "TEXT")
    private String content; // Nội dung câu hỏi
    
    private String imageUrl; // Hình ảnh đính kèm (nếu có, VD Part 1)
    private String audioUrl; // Audio riêng lẻ (nếu có, VD Part 2)
    
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AnswerOption> answerOptions;
    
    // AI Explanation integration placeholder
    @Column(columnDefinition = "TEXT")
    private String aiExplanation;
    
    @Column(columnDefinition = "TEXT")
    private String transcript; // Transcript cho bài nghe
}


