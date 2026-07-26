package com.lmstoeic.feature.course.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmstoeic.feature.course.entity.ExerciseQuestion;

@Repository
public interface ExerciseQuestionRepository extends JpaRepository<ExerciseQuestion, Long> {
}
