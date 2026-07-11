package com.lmstoeic.feature.permission.entity;

import com.lmstoeic.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "permissions")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Permission extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String apiPath;
    private String method;
    private String module;
    private String description;
}
