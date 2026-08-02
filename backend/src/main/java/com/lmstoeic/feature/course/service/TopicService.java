package com.lmstoeic.feature.course.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lmstoeic.common.exception.ResourceNotFoundException;
import com.lmstoeic.feature.course.dto.TopicDto;
import com.lmstoeic.feature.course.dto.request.TopicRequest;
import com.lmstoeic.feature.course.entity.Section;
import com.lmstoeic.feature.course.entity.Topic;
import com.lmstoeic.feature.course.repository.SectionRepository;
import com.lmstoeic.feature.course.repository.TopicRepository;

import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicRepository topicRepository;
    private final SectionRepository sectionRepository;

    @Transactional
    public TopicDto createTopic(TopicRequest request) {
        Section section = sectionRepository.findById(request.getSectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Section", "id", request.getSectionId().toString()));

        Topic topic = Topic.builder()
                .title(request.getTitle())
                .slug(request.getSlug())
                .description(request.getDescription())
                .orderIndex(request.getOrderIndex())
                .isActive(request.getIsActive())
                .section(section)
                .build();
        
        Topic saved = topicRepository.save(topic);
        return mapToTopicDtoBasic(saved);
    }

    @Transactional
    public TopicDto updateTopic(Long id, TopicRequest request) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", id.toString()));

        if (!topic.getSection().getId().equals(request.getSectionId())) {
            Section section = sectionRepository.findById(request.getSectionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Section", "id", request.getSectionId().toString()));
            topic.setSection(section);
        }

        topic.setTitle(request.getTitle());
        topic.setSlug(request.getSlug());
        topic.setDescription(request.getDescription());
        topic.setOrderIndex(request.getOrderIndex());
        topic.setIsActive(request.getIsActive());
        
        Topic saved = topicRepository.save(topic);
        return mapToTopicDtoBasic(saved);
    }

    @Transactional
    public void deleteTopic(Long id) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", id.toString()));
        topicRepository.delete(topic);
    }

    @Transactional(readOnly = true)
    public List<TopicDto> getTopicsBySection(Long sectionId) {
        return topicRepository.findBySectionIdAndIsActiveTrueOrderByOrderIndexAsc(sectionId).stream()
                .map(this::mapToTopicDtoFull)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TopicDto getTopicById(Long id) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", id.toString()));
        return mapToTopicDtoFull(topic);
    }

    private TopicDto mapToTopicDtoFull(Topic topic) {
        TopicDto dto = mapToTopicDtoBasic(topic);

        if (topic.getLessons() != null) {
            List<com.lmstoeic.feature.course.dto.LessonDto> lessonDtos = topic.getLessons().stream()
                    .filter(com.lmstoeic.feature.course.entity.Lesson::getIsActive)
                    .map(lesson -> com.lmstoeic.feature.course.dto.LessonDto.builder()
                            .id(lesson.getId())
                            .title(lesson.getTitle())
                            .slug(lesson.getSlug())
                            .durationMinutes(lesson.getDurationMinutes())
                            .orderIndex(lesson.getOrderIndex())
                            .build())
                    .collect(Collectors.toList());
            dto.setLessons(lessonDtos);
        }

        if (topic.getExercises() != null) {
            List<com.lmstoeic.feature.course.dto.ExerciseDto> exerciseDtos = topic.getExercises().stream()
                    .filter(com.lmstoeic.feature.course.entity.Exercise::getIsActive)
                    .map(exercise -> com.lmstoeic.feature.course.dto.ExerciseDto.builder()
                            .id(exercise.getId())
                            .exerciseType(exercise.getExerciseType() != null ? exercise.getExerciseType().name() : null)

                            .orderIndex(exercise.getOrderIndex())
                            .build())
                    .collect(Collectors.toList());
            dto.setExercises(exerciseDtos);
        }

        return dto;
    }

    private TopicDto mapToTopicDtoBasic(Topic topic) {
        return TopicDto.builder()
                .id(topic.getId())
                .title(topic.getTitle())
                .slug(topic.getSlug())
                .description(topic.getDescription())
                .orderIndex(topic.getOrderIndex())
                .build();
    }
}
