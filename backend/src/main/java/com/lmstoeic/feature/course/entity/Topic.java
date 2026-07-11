package com.lmstoeic.feature.course.entity;

import java.util.List;

import com.lmstoeic.common.entity.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
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
@Table(name = "topics")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Topic extends BaseEntity {
    private String title;
    private String slug;
    private String description;
    private Integer orderIndex;
    private Boolean isActive;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id")
    private Section section;

    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL)
    @OrderBy("orderIndex ASC")
    private List<Lesson> lessons;

    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL)
    @OrderBy("orderIndex ASC")
    private List<Exercise> exercises;
}

