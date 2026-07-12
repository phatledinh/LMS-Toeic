package com.lmstoeic.feature.course.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmstoeic.feature.course.entity.Topic;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findBySectionIdAndIsActiveTrueOrderByOrderIndexAsc(Long sectionId);
}
