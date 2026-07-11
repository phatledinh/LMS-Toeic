package com.lmstoeic.feature.mocktest.entity;

import com.lmstoeic.common.entity.BaseEntity;
import com.lmstoeic.feature.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mock_test_attempts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MockTestAttempt extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mock_test_id")
    private MockTest mockTest;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private Integer listeningScore;
    private Integer readingScore;
    private Integer totalScore;

    @Enumerated(EnumType.STRING)
    private AttemptStatus status; // IN_PROGRESS, SUBMITTED, TIMEOUT

    public enum AttemptStatus {
        IN_PROGRESS, SUBMITTED, TIMEOUT
    }
}
