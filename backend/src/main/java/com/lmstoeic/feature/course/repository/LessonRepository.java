package com.lmstoeic.feature.course.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmstoeic.feature.course.entity.Lesson;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findAllByTopicIdOrderByOrderIndexAsc(Long topicId);

    Optional<Lesson> findByIdAndIsActiveTrue(Long id);
}
