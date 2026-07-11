package com.lmstoeic.feature.course.entity;

import java.util.List;

import com.lmstoeic.common.entity.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sections")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Section extends BaseEntity {
    private String title;
    private String slug;
    private String description;
    private Integer orderIndex;
    private Boolean isActive;

    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL)
    @OrderBy("orderIndex ASC")
    private List<Topic> topics;
}

