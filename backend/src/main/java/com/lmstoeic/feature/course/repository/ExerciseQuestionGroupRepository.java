package com.lmstoeic.feature.course.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmstoeic.feature.course.entity.ExerciseQuestionGroup;

@Repository
public interface ExerciseQuestionGroupRepository extends JpaRepository<ExerciseQuestionGroup, Long> {
}
