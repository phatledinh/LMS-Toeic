package com.lmstoeic.feature.course.entity;

import com.lmstoeic.common.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "group_content_blocks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupContentBlock extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private ExerciseQuestionGroup group;

    @Enumerated(EnumType.STRING)
    private BlockType blockType; // TEXT or IMAGE

    @Column(columnDefinition = "TEXT")
    private String content; // Text content if type is TEXT

    @Column(name = "image_url")
    private String imageUrl; // Image url if type is IMAGE

    @Column(name = "order_index")
    private Integer orderIndex;
}


