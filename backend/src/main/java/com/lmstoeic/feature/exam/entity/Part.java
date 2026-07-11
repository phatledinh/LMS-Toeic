package com.lmstoeic.feature.exam.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "parts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Part {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id")
    private Exam exam;

    private Integer partNumber; // 1 -> 7
    private String title; // Vd: Part 1: Photographs
    private String description;
    
    private String audioUrl; // Audio chung cho cả part (nếu có)
    
    @OneToMany(mappedBy = "part", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<QuestionGroup> questionGroups;
}


