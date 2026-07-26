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
    public List<LessonDto> getLessonsByTopic(Long topicId) {
        return lessonRepository.findByTopicIdAndIsActiveTrueOrderByOrderIndexAsc(topicId).stream()
                .map(this::mapToLessonDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LessonDto getLessonById(Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", id.toString()));
        return mapToLessonDto(lesson);
    }

    @Transactional
    public LessonDto createLesson(LessonRequest request) {
        Topic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", request.getTopicId().toString()));

        Lesson lesson = Lesson.builder()
                .title(request.getTitle())
                .slug(request.getSlug())
                .durationMinutes(request.getDurationMinutes() != null ? request.getDurationMinutes() : 0)
                .orderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : 0)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .topic(topic)
                .build();

        return mapToLessonDto(lessonRepository.save(lesson));
    }

    @Transactional
    public LessonDto updateLesson(Long id, LessonRequest request) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", id.toString()));

        if (request.getTitle() != null) lesson.setTitle(request.getTitle());
        if (request.getSlug() != null) lesson.setSlug(request.getSlug());
        if (request.getDurationMinutes() != null) lesson.setDurationMinutes(request.getDurationMinutes());
        if (request.getOrderIndex() != null) lesson.setOrderIndex(request.getOrderIndex());
        if (request.getIsActive() != null) lesson.setIsActive(request.getIsActive());

        return mapToLessonDto(lessonRepository.save(lesson));
    }

    @Transactional
    public void deleteLesson(Long id) {
        if (!lessonRepository.existsById(id)) {
            throw new ResourceNotFoundException("Lesson", "id", id.toString());
        }
        lessonRepository.deleteById(id);
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
}
