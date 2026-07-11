package com.lmstoeic.feature.course.entity;

import java.util.List;

import com.lmstoeic.common.entity.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "exercise_questions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseQuestion extends BaseEntity {
    private Integer questionNumber;
    private String content;
    @Column(name = "option_a")
    private String optionA;

    @Column(name = "option_b")
    private String optionB;

    @Column(name = "option_c")
    private String optionC;

    @Column(name = "option_d")
    private String optionD;
    @Column(columnDefinition = "CHAR(1)")
    private String correctAnswer; // "A", "B", "C", "D"
    private String explanation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private ExerciseQuestionGroup group;

    @Column(name = "source_topic_id")
    private Long sourceTopicId;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuestionTopicTag> topicTags;
}

