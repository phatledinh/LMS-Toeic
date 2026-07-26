package com.lmstoeic.feature.course.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lmstoeic.common.exception.ResourceNotFoundException;
import com.lmstoeic.feature.course.dto.ExerciseQuestionGroupDto;
import com.lmstoeic.feature.course.dto.request.QuestionGroupRequest;
import com.lmstoeic.feature.course.entity.Exercise;
import com.lmstoeic.feature.course.entity.ExerciseQuestionGroup;
import com.lmstoeic.feature.course.repository.ExerciseQuestionGroupRepository;
import com.lmstoeic.feature.course.repository.ExerciseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExerciseQuestionGroupService {

    private final ExerciseQuestionGroupRepository questionGroupRepository;
    private final ExerciseRepository exerciseRepository;

    @Transactional
    public ExerciseQuestionGroupDto createQuestionGroup(QuestionGroupRequest request) {
        Exercise exercise = exerciseRepository.findById(request.getExerciseId())
                .orElseThrow(() -> new ResourceNotFoundException("Exercise", "id", request.getExerciseId().toString()));

        ExerciseQuestionGroup group = ExerciseQuestionGroup.builder()
                .orderIndex(request.getOrderIndex())
                .audioUrl(request.getAudioUrl())
                .imageUrl(request.getImageUrl())
                .passage(request.getPassage())
                .sourceTopicId(request.getSourceTopicId())
                .exercise(exercise)
                .build();

        return mapToDto(questionGroupRepository.save(group));
    }

    @Transactional
    public ExerciseQuestionGroupDto updateQuestionGroup(Long id, QuestionGroupRequest request) {
        ExerciseQuestionGroup group = questionGroupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ExerciseQuestionGroup", "id", id.toString()));

        if (request.getOrderIndex() != null) group.setOrderIndex(request.getOrderIndex());
        if (request.getAudioUrl() != null) group.setAudioUrl(request.getAudioUrl());
        if (request.getImageUrl() != null) group.setImageUrl(request.getImageUrl());
        if (request.getPassage() != null) group.setPassage(request.getPassage());
        if (request.getSourceTopicId() != null) group.setSourceTopicId(request.getSourceTopicId());

        return mapToDto(questionGroupRepository.save(group));
    }

    @Transactional
    public void deleteQuestionGroup(Long id) {
        if (!questionGroupRepository.existsById(id)) {
            throw new ResourceNotFoundException("ExerciseQuestionGroup", "id", id.toString());
        }
        questionGroupRepository.deleteById(id);
    }

    private ExerciseQuestionGroupDto mapToDto(ExerciseQuestionGroup group) {
        return ExerciseQuestionGroupDto.builder()
                .id(group.getId())
                .orderIndex(group.getOrderIndex())
                .audioUrl(group.getAudioUrl())
                .imageUrl(group.getImageUrl())
                .passage(group.getPassage())
                .sourceTopicId(group.getSourceTopicId())
                .exerciseId(group.getExercise() != null ? group.getExercise().getId() : null)
                .build();
    }
}
