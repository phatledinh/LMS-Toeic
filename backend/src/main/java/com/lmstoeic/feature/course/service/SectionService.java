package com.lmstoeic.feature.course.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lmstoeic.common.exception.ResourceNotFoundException;
import com.lmstoeic.feature.course.dto.ExerciseDto;
import com.lmstoeic.feature.course.dto.LessonDto;
import com.lmstoeic.feature.course.dto.SectionDto;
import com.lmstoeic.feature.course.dto.TopicDto;
import com.lmstoeic.feature.course.dto.request.SectionRequest;
import com.lmstoeic.feature.course.entity.Exercise;
import com.lmstoeic.feature.course.entity.Lesson;
import com.lmstoeic.feature.course.entity.Section;
import com.lmstoeic.feature.course.entity.Topic;
import com.lmstoeic.feature.course.repository.SectionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SectionService {

    private final SectionRepository sectionRepository;

    @Transactional(readOnly = true)
    public List<SectionDto> getAllSections() {
        return sectionRepository.findAllByIsActiveTrueOrderByOrderIndexAsc().stream()
                .map(this::mapToSectionDtoBasic)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SectionDto> getAllSectionsFull() {
        return sectionRepository.findAllByIsActiveTrueOrderByOrderIndexAsc().stream()
                .map(this::mapToSectionDtoFull)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SectionDto getSectionBySlug(String slug) {
        Section section = sectionRepository.findBySlugAndIsActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Section", "slug", slug));
        return mapToSectionDtoFull(section);
    }

    @Transactional
    public SectionDto createSection(SectionRequest request) {
        Section section = Section.builder()
                .title(request.getTitle())
                .slug(request.getSlug())
                .description(request.getDescription())
                .orderIndex(request.getOrderIndex())
                .isActive(request.getIsActive())
                .build();
        Section saved = sectionRepository.save(section);
        return mapToSectionDtoBasic(saved);
    }

    @Transactional
    public SectionDto updateSection(Long id, SectionRequest request) {
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Section", "id", id.toString()));
        section.setTitle(request.getTitle());
        section.setSlug(request.getSlug());
        section.setDescription(request.getDescription());
        section.setOrderIndex(request.getOrderIndex());
        section.setIsActive(request.getIsActive());
        Section saved = sectionRepository.save(section);
        return mapToSectionDtoBasic(saved);
    }

    @Transactional
    public void deleteSection(Long id) {
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Section", "id", id.toString()));
        sectionRepository.delete(section);
    }

    private SectionDto mapToSectionDtoBasic(Section section) {
        return SectionDto.builder()
                .id(section.getId())
                .title(section.getTitle())
                .slug(section.getSlug())
                .description(section.getDescription())
                .orderIndex(section.getOrderIndex())
                .build();
    }

    private SectionDto mapToSectionDtoFull(Section section) {
        SectionDto dto = mapToSectionDtoBasic(section);
        if (section.getTopics() != null) {
            List<TopicDto> topicDtos = section.getTopics().stream()
                    .filter(Topic::getIsActive)
                    .map(this::mapToTopicDto)
                    .collect(Collectors.toList());
            dto.setTopics(topicDtos);
        }
        return dto;
    }

    private TopicDto mapToTopicDto(Topic topic) {
        TopicDto dto = TopicDto.builder()
                .id(topic.getId())
                .title(topic.getTitle())
                .slug(topic.getSlug())
                .description(topic.getDescription())
                .orderIndex(topic.getOrderIndex())
                .build();

        if (topic.getLessons() != null) {
            List<LessonDto> lessonDtos = topic.getLessons().stream()
                    .filter(Lesson::getIsActive)
                    .map(this::mapToLessonDto)
                    .collect(Collectors.toList());
            dto.setLessons(lessonDtos);
        }

        if (topic.getExercises() != null) {
            List<ExerciseDto> exerciseDtos = topic.getExercises().stream()
                    .filter(Exercise::getIsActive)
                    .map(this::mapToExerciseDto)
                    .collect(Collectors.toList());
            dto.setExercises(exerciseDtos);
        }

        return dto;
    }

    private LessonDto mapToLessonDto(Lesson lesson) {
        return LessonDto.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .slug(lesson.getSlug())
                .durationMinutes(lesson.getDurationMinutes())
                .orderIndex(lesson.getOrderIndex())
                .build();
    }

    private ExerciseDto mapToExerciseDto(Exercise exercise) {
        return ExerciseDto.builder()
                .id(exercise.getId())
                .exerciseType(exercise.getExerciseType() != null ? exercise.getExerciseType().name() : null)
                .totalQuestions(exercise.getTotalQuestions())
                .orderIndex(exercise.getOrderIndex())
                .build();
    }
}
