package com.lmstoeic.feature.course.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lmstoeic.common.exception.ResourceNotFoundException;
import com.lmstoeic.feature.course.dto.LessonDto;
import com.lmstoeic.feature.course.dto.request.LessonRequest;
import com.lmstoeic.feature.course.entity.Lesson;
import com.lmstoeic.feature.course.entity.Topic;
import com.lmstoeic.feature.course.repository.LessonRepository;
import com.lmstoeic.feature.course.repository.TopicRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;
    private final TopicRepository topicRepository;

    @Transactional(readOnly = true)
    public LessonDto getLessonById(Long id) {
        Lesson lesson = lessonRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", id.toString()));
        return mapToLessonDtoFull(lesson);
    }

    @Transactional(readOnly = true)
    public List<LessonDto> getLessonsByTopicId(Long topicId) {
        return lessonRepository.findAllByTopicIdOrderByOrderIndexAsc(topicId).stream()
                .map(this::mapToLessonDtoFull)
                .collect(Collectors.toList());
    }

    @Transactional
    public LessonDto createLesson(LessonRequest request) {
        Topic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", request.getTopicId().toString()));

        Lesson lesson = Lesson.builder()
                .title(request.getTitle())
                .slug(request.getSlug())
                .durationMinutes(request.getDurationMinutes())
                .orderIndex(request.getOrderIndex())
                .isActive(request.getIsActive())
                .content(request.getContent())
                .videoUrl(request.getVideoUrl())
                .docUrl(request.getDocUrl())
                .docFileName(request.getDocFileName())
                .topic(topic)
                .build();

        Lesson saved = lessonRepository.save(lesson);
        return mapToLessonDtoFull(saved);
    }

    @Transactional
    public LessonDto updateLesson(Long id, LessonRequest request) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", id.toString()));

        if (!lesson.getTopic().getId().equals(request.getTopicId())) {
            Topic topic = topicRepository.findById(request.getTopicId())
                    .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", request.getTopicId().toString()));
            lesson.setTopic(topic);
        }

        lesson.setTitle(request.getTitle());
        lesson.setSlug(request.getSlug());
        lesson.setDurationMinutes(request.getDurationMinutes());
        lesson.setOrderIndex(request.getOrderIndex());
        lesson.setIsActive(request.getIsActive());
        lesson.setContent(request.getContent());
        lesson.setVideoUrl(request.getVideoUrl());
        lesson.setDocUrl(request.getDocUrl());
        lesson.setDocFileName(request.getDocFileName());

        Lesson saved = lessonRepository.save(lesson);
        return mapToLessonDtoFull(saved);
    }

    @Transactional
    public void deleteLesson(Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", id.toString()));
        lessonRepository.delete(lesson);
    }

    private LessonDto mapToLessonDtoFull(Lesson lesson) {
        return LessonDto.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .slug(lesson.getSlug())
                .durationMinutes(lesson.getDurationMinutes())
                .orderIndex(lesson.getOrderIndex())
                .isActive(lesson.getIsActive())
                .content(lesson.getContent())
                .videoUrl(lesson.getVideoUrl())
                .docUrl(lesson.getDocUrl())
                .docFileName(lesson.getDocFileName())
                .topicId(lesson.getTopic() != null ? lesson.getTopic().getId() : null)
                .build();
    }
}
