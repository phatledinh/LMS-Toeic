package com.lmstoeic.feature.course.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lmstoeic.common.exception.ResourceNotFoundException;
import com.lmstoeic.feature.course.dto.ExerciseDto;
import com.lmstoeic.feature.course.dto.request.ExerciseRequest;
import com.lmstoeic.feature.course.dto.ExerciseQuestionDto;
import com.lmstoeic.feature.course.dto.ExerciseQuestionGroupDto;
import com.lmstoeic.feature.course.dto.GroupContentBlockDto;
import com.lmstoeic.feature.course.entity.Exercise;
import com.lmstoeic.feature.course.entity.ExerciseQuestion;
import com.lmstoeic.feature.course.entity.ExerciseQuestionGroup;
import com.lmstoeic.feature.course.entity.GroupContentBlock;
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
                .orderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : 0)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .fullAudioUrl(request.getFullAudioUrl())
                .audioDurationMs(request.getAudioDurationMs())
                .audioVersion(request.getAudioVersion())
                .readingImageMode(request.getReadingImageMode())
                .readingImageUrl(request.getReadingImageUrl())
                .readingImageUrls(request.getReadingImageUrls())
                .topic(topic)
                .build();

        return mapToExerciseDto(exerciseRepository.save(exercise));
    }

    @Transactional
    public ExerciseDto updateExercise(Long id, ExerciseRequest request) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise", "id", id.toString()));

        if (request.getExerciseType() != null) exercise.setExerciseType(request.getExerciseType());
        if (request.getOrderIndex() != null) exercise.setOrderIndex(request.getOrderIndex());
        if (request.getIsActive() != null) exercise.setIsActive(request.getIsActive());
        if (request.getFullAudioUrl() != null) exercise.setFullAudioUrl(request.getFullAudioUrl());
        if (request.getAudioDurationMs() != null) exercise.setAudioDurationMs(request.getAudioDurationMs());
        if (request.getAudioVersion() != null) exercise.setAudioVersion(request.getAudioVersion());
        if (request.getReadingImageMode() != null) exercise.setReadingImageMode(request.getReadingImageMode());
        if (request.getReadingImageUrl() != null) exercise.setReadingImageUrl(request.getReadingImageUrl());
        if (request.getReadingImageUrls() != null) exercise.setReadingImageUrls(request.getReadingImageUrls());

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
                .orderIndex(exercise.getOrderIndex())
                .fullAudioUrl(exercise.getFullAudioUrl())
                .audioDurationMs(exercise.getAudioDurationMs())
                .audioVersion(exercise.getAudioVersion())
                .readingImageMode(exercise.getReadingImageMode())
                .readingImageUrl(exercise.getReadingImageUrl())
                .readingImageUrls(exercise.getReadingImageUrls())
                .questions(exercise.getQuestions() != null ? exercise.getQuestions().stream().map(this::mapToQuestionDto).collect(Collectors.toList()) : null)
                .questionGroups(exercise.getQuestionGroups() != null ? exercise.getQuestionGroups().stream().map(this::mapToQuestionGroupDto).collect(Collectors.toList()) : null)
                .build();
    }

    private ExerciseQuestionDto mapToQuestionDto(ExerciseQuestion question) {
        return ExerciseQuestionDto.builder()
                .id(question.getId())
                .questionNumber(question.getQuestionNumber())
                .audioStartMs(question.getAudioStartMs())
                .audioEndMs(question.getAudioEndMs())
                .content(question.getContent())
                .optionA(question.getOptionA())
                .optionB(question.getOptionB())
                .optionC(question.getOptionC())
                .optionD(question.getOptionD())
                .correctAnswer(question.getCorrectAnswer())
                .explanation(question.getExplanation())
                .exerciseId(question.getExercise() != null ? question.getExercise().getId() : null)
                .groupId(question.getGroup() != null ? question.getGroup().getId() : null)
                .sourceTopicId(question.getSourceTopicId())
                .build();
    }

    private ExerciseQuestionGroupDto mapToQuestionGroupDto(ExerciseQuestionGroup group) {
        return ExerciseQuestionGroupDto.builder()
                .id(group.getId())
                .orderIndex(group.getOrderIndex())
                .audioUrl(group.getAudioUrl())
                .audioStartMs(group.getAudioStartMs())
                .audioEndMs(group.getAudioEndMs())
                .timelineLabel(group.getTimelineLabel())
                .imageUrl(group.getImageUrl())
                .passage(group.getPassage())
                .exerciseId(group.getExercise() != null ? group.getExercise().getId() : null)
                .sourceTopicId(group.getSourceTopicId())
                .questions(group.getQuestions() != null ? group.getQuestions().stream().map(this::mapToQuestionDto).collect(Collectors.toList()) : null)
                .contentBlocks(group.getContentBlocks() != null ? group.getContentBlocks().stream().map(this::mapToGroupContentBlockDto).collect(Collectors.toList()) : null)
                .build();
    }

    private GroupContentBlockDto mapToGroupContentBlockDto(GroupContentBlock block) {
        return GroupContentBlockDto.builder()
                .id(block.getId())
                .blockType(block.getBlockType() != null ? block.getBlockType().name() : null)
                .content(block.getContent())
                .imageUrl(block.getImageUrl())
                .orderIndex(block.getOrderIndex())
                .build();
    }
}
