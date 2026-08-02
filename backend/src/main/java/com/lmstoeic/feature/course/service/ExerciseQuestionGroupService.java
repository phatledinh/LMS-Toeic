package com.lmstoeic.feature.course.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lmstoeic.common.exception.ResourceNotFoundException;
import com.lmstoeic.feature.course.dto.ExerciseQuestionGroupDto;
import com.lmstoeic.feature.course.dto.request.QuestionGroupRequest;
import com.lmstoeic.feature.course.entity.Exercise;
import com.lmstoeic.feature.course.entity.ExerciseQuestion;
import com.lmstoeic.feature.course.entity.ExerciseQuestionGroup;
import com.lmstoeic.feature.course.entity.GroupContentBlock;
import com.lmstoeic.feature.course.entity.BlockType;
import com.lmstoeic.feature.course.repository.ExerciseQuestionGroupRepository;
import com.lmstoeic.feature.course.repository.ExerciseRepository;
import java.util.stream.Collectors;

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
                
        if (request.getQuestions() != null) {
            java.util.List<ExerciseQuestion> questions = request.getQuestions().stream().map(qReq -> {
                ExerciseQuestion q = ExerciseQuestion.builder()
                        .questionNumber(qReq.getQuestionNumber())
                        .content(qReq.getContent())
                        .optionA(qReq.getOptionA())
                        .optionB(qReq.getOptionB())
                        .optionC(qReq.getOptionC())
                        .optionD(qReq.getOptionD())
                        .correctAnswer(qReq.getCorrectAnswer())
                        .explanation(qReq.getExplanation())
                        .sourceTopicId(qReq.getSourceTopicId())
                        .exercise(exercise)
                        .group(group)
                        .build();
                return q;
            }).collect(Collectors.toList());
            group.setQuestions(questions);
        }

        if (request.getContentBlocks() != null) {
            java.util.List<GroupContentBlock> blocks = request.getContentBlocks().stream().map(bReq -> {
                GroupContentBlock b = GroupContentBlock.builder()
                        .blockType(bReq.getBlockType() != null ? BlockType.valueOf(bReq.getBlockType()) : null)
                        .content(bReq.getContent())
                        .imageUrl(bReq.getImageUrl())
                        .orderIndex(bReq.getOrderIndex())
                        .group(group)
                        .build();
                return b;
            }).collect(Collectors.toList());
            group.setContentBlocks(blocks);
        }

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

        if (request.getQuestions() != null) {
            if (group.getQuestions() != null) {
                group.getQuestions().clear();
            } else {
                group.setQuestions(new java.util.ArrayList<>());
            }
            java.util.List<ExerciseQuestion> questions = request.getQuestions().stream().map(qReq -> {
                ExerciseQuestion q = ExerciseQuestion.builder()
                        .questionNumber(qReq.getQuestionNumber())
                        .content(qReq.getContent())
                        .optionA(qReq.getOptionA())
                        .optionB(qReq.getOptionB())
                        .optionC(qReq.getOptionC())
                        .optionD(qReq.getOptionD())
                        .correctAnswer(qReq.getCorrectAnswer())
                        .explanation(qReq.getExplanation())
                        .sourceTopicId(qReq.getSourceTopicId())
                        .exercise(group.getExercise())
                        .group(group)
                        .build();
                return q;
            }).collect(Collectors.toList());
            group.getQuestions().addAll(questions);
        }

        if (request.getContentBlocks() != null) {
            if (group.getContentBlocks() != null) {
                group.getContentBlocks().clear();
            } else {
                group.setContentBlocks(new java.util.ArrayList<>());
            }
            java.util.List<GroupContentBlock> blocks = request.getContentBlocks().stream().map(bReq -> {
                GroupContentBlock b = GroupContentBlock.builder()
                        .blockType(bReq.getBlockType() != null ? BlockType.valueOf(bReq.getBlockType()) : null)
                        .content(bReq.getContent())
                        .imageUrl(bReq.getImageUrl())
                        .orderIndex(bReq.getOrderIndex())
                        .group(group)
                        .build();
                return b;
            }).collect(Collectors.toList());
            group.getContentBlocks().addAll(blocks);
        }

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
