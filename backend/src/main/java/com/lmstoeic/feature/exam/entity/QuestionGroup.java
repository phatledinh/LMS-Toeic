package com.lmstoeic.feature.exam.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "question_groups")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "part_id")
    private Part part;

    // Cho Part 6, 7 (Đoạn văn)
    @Column(columnDefinition = "TEXT")
    private String passageText;
    
    // Cho Part 3, 4 (Audio đoạn hội thoại)
    private String audioUrl;
    
    // Cho các bài đọc có đính kèm hình ảnh
    private String imageUrl;

    @OneToMany(mappedBy = "questionGroup", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Question> questions;
}


