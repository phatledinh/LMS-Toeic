package com.lmstoeic.feature.course.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmstoeic.feature.course.entity.Section;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findAllByIsActiveTrueOrderByOrderIndexAsc();
    Optional<Section> findBySlugAndIsActiveTrue(String slug);
}
