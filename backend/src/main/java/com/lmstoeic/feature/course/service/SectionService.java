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
import com.lmstoeic.feature.course.entity.ExerciseType;
import com.lmstoeic.feature.course.entity.Lesson;
import com.lmstoeic.feature.course.entity.Section;
import com.lmstoeic.feature.course.entity.Topic;
import com.lmstoeic.feature.course.repository.ExerciseQuestionRepository;
import com.lmstoeic.feature.course.repository.SectionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SectionService {

    private static final String ONLINE_TEST_MARKER = "[ONLINE_TEST]";

    private static final java.util.Map<ExerciseType, Integer> STANDARD_QUESTION_COUNTS = java.util.Map.of(
            ExerciseType.LISTENING_PART1, 6,
            ExerciseType.LISTENING_PART2, 25,
            ExerciseType.LISTENING_PART3, 39,
            ExerciseType.LISTENING_PART4, 30,
            ExerciseType.READING_PART5, 30,
            ExerciseType.READING_PART6, 16,
            ExerciseType.READING_PART7, 54);

    private static final java.util.Map<ExerciseType, Integer> STANDARD_ORDER_INDEXES = java.util.Map.of(
            ExerciseType.LISTENING_PART1, 1,
            ExerciseType.LISTENING_PART2, 2,
            ExerciseType.LISTENING_PART3, 3,
            ExerciseType.LISTENING_PART4, 4,
            ExerciseType.READING_PART5, 5,
            ExerciseType.READING_PART6, 6,
            ExerciseType.READING_PART7, 7);

    private final SectionRepository sectionRepository;
    private final ExerciseQuestionRepository exerciseQuestionRepository;

    @Transactional(readOnly = true)
    public List<SectionDto> getAllSections() {
        return sectionRepository.findAllByIsActiveTrueOrderByOrderIndexAsc().stream()
                .filter((section) -> !isOnlineTestSection(section) || isCompleteOnlineTestSection(section))
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
        if (isOnlineTestSection(section) && !isCompleteOnlineTestSection(section)) {
            throw new ResourceNotFoundException("Section", "slug", slug);
        }
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
                .enteredQuestions(Math.toIntExact(exerciseQuestionRepository.countByExerciseId(exercise.getId())))
                .orderIndex(STANDARD_ORDER_INDEXES.getOrDefault(exercise.getExerciseType(), exercise.getOrderIndex()))
                .build();
    }

    private boolean isOnlineTestSection(Section section) {
        String text = String.format("%s %s %s",
                section.getSlug() == null ? "" : section.getSlug(),
                section.getTitle() == null ? "" : section.getTitle(),
                section.getDescription() == null ? "" : section.getDescription()).toLowerCase();

        return text.contains("online")
                || text.contains("de-thi")
                || text.contains("đề thi")
                || text.contains("test-")
                || text.contains(ONLINE_TEST_MARKER.toLowerCase());
    }

    private boolean isCompleteOnlineTestSection(Section section) {
        java.util.Map<ExerciseType, Long> enteredByType = new java.util.EnumMap<>(ExerciseType.class);

        if (section.getTopics() == null) {
            return false;
        }

        for (Topic topic : section.getTopics()) {
            if (!Boolean.TRUE.equals(topic.getIsActive()) || topic.getExercises() == null) {
                continue;
            }

            for (Exercise exercise : topic.getExercises()) {
                if (!Boolean.TRUE.equals(exercise.getIsActive())
                        || exercise.getExerciseType() == null
                        || !STANDARD_QUESTION_COUNTS.containsKey(exercise.getExerciseType())) {
                    continue;
                }

                long enteredQuestions = exerciseQuestionRepository.countByExerciseId(exercise.getId());
                enteredByType.merge(exercise.getExerciseType(), enteredQuestions, Long::sum);
            }
        }

        return STANDARD_QUESTION_COUNTS.entrySet().stream()
                .allMatch((entry) -> enteredByType.getOrDefault(entry.getKey(), 0L) >= entry.getValue());
    }
}
