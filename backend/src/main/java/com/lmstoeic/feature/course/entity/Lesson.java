package com.lmstoeic.feature.course.entity;

import com.lmstoeic.common.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lessons")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lesson extends BaseEntity {
    private String title;
    private String slug;
    private Integer durationMinutes;
    private Integer orderIndex;
    private Boolean isActive;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(length = 1000)
    private String videoUrl;

    @Column(length = 1000)
    private String docUrl;

    private String docFileName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    private Topic topic;
}

