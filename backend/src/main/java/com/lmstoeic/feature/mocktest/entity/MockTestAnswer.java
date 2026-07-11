package com.lmstoeic.feature.mocktest.entity;

import com.lmstoeic.common.entity.BaseEntity;
import com.lmstoeic.feature.exam.entity.Question;
import com.lmstoeic.feature.exam.entity.AnswerOption;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mock_test_answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MockTestAnswer extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id")
    private MockTestAttempt attempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_option_id")
    private AnswerOption selectedOption; // Đáp án người dùng chọn

    private Boolean isCorrect;
}
