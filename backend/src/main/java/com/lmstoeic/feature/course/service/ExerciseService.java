package com.lmstoeic.feature.course.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lmstoeic.common.exception.ResourceNotFoundException;
import com.lmstoeic.feature.course.dto.ExerciseDto;
import com.lmstoeic.feature.course.dto.request.ExerciseRequest;
import com.lmstoeic.feature.course.entity.Exercise;
import com.lmstoeic.feature.course.entity.Topic;
import com.lmstoeic.feature.course.repository.ExerciseRepository;
import com.lmstoeic.feature.course.repository.TopicRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final TopicRepository topicRepository;

    @Transactional(readOnly = true)
    public List<ExerciseDto> getExercisesByTopic(Long topicId) {
        return exerciseRepository.findByTopicIdAndIsActiveTrueOrderByOrderIndexAsc(topicId).stream()
                .map(this::mapToExerciseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ExerciseDto getExerciseById(Long id) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise", "id", id.toString()));
        return mapToExerciseDto(exercise);
    }

    @Transactional
    public ExerciseDto createExercise(ExerciseRequest request) {
        Topic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", request.getTopicId().toString()));

        Exercise exercise = Exercise.builder()
                .exerciseType(request.getExerciseType())
                .totalQuestions(request.getTotalQuestions() != null ? request.getTotalQuestions() : 0)
                .orderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : 0)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .topic(topic)
                .build();

        return mapToExerciseDto(exerciseRepository.save(exercise));
    }

    @Transactional
    public ExerciseDto updateExercise(Long id, ExerciseRequest request) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise", "id", id.toString()));

        if (request.getExerciseType() != null) exercise.setExerciseType(request.getExerciseType());
        if (request.getTotalQuestions() != null) exercise.setTotalQuestions(request.getTotalQuestions());
        if (request.getOrderIndex() != null) exercise.setOrderIndex(request.getOrderIndex());
        if (request.getIsActive() != null) exercise.setIsActive(request.getIsActive());

        return mapToExerciseDto(exerciseRepository.save(exercise));
    }

    @Transactional
    public void deleteExercise(Long id) {
        if (!exerciseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Exercise", "id", id.toString());
        }
        exerciseRepository.deleteById(id);
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
