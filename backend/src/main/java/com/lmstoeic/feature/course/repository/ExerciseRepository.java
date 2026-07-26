package com.lmstoeic.feature.course.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmstoeic.feature.course.entity.Exercise;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByTopicIdAndIsActiveTrueOrderByOrderIndexAsc(Long topicId);
}
