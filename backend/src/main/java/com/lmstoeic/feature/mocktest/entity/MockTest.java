package com.lmstoeic.feature.mocktest.entity;

import com.lmstoeic.common.entity.BaseEntity;
import com.lmstoeic.feature.exam.entity.Exam;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mock_tests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MockTest extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id")
    private Exam exam; // Liên kết tới bộ đề (Exam) trong Question Bank

    private String title;
    private Integer durationMinutes; // Thời gian thi (vd: 120 phút)
    private Integer totalScore; // Tổng điểm (vd: 990)
    private Integer passingScore;

    private Boolean isActive;
}
