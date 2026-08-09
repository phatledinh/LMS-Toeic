package com.lmstoeic.feature.course.entity;

import java.util.List;

import com.lmstoeic.common.entity.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "exercises")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Exercise extends BaseEntity {
    @Enumerated(EnumType.STRING)
    @Column(name = "exercise_type")
    private ExerciseType exerciseType;


    private Integer orderIndex;
    private Boolean isActive;
    private String fullAudioUrl;
    private Integer audioDurationMs;
    private String audioVersion;
    private String readingImageMode;
    private String readingImageUrl;
    private String readingImageUrls;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    private Topic topic;

    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL)
    @OrderBy("questionNumber ASC")
    private List<ExerciseQuestion> questions;

    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL)
    @OrderBy("orderIndex ASC")
    private List<ExerciseQuestionGroup> questionGroups;
}

