package com.lmstoeic.feature.course.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lmstoeic.common.exception.ResourceNotFoundException;
import com.lmstoeic.feature.course.dto.ExerciseDto;
import com.lmstoeic.feature.course.dto.ExerciseDetailDto;
import com.lmstoeic.feature.course.dto.ExerciseQuestionDto;
import com.lmstoeic.feature.course.dto.ExerciseQuestionGroupDto;
import com.lmstoeic.feature.course.dto.request.ExerciseRequest;
import com.lmstoeic.feature.course.dto.request.ExerciseQuestionGroupRequest;
import com.lmstoeic.feature.course.dto.request.ExerciseQuestionRequest;
import com.lmstoeic.feature.course.entity.Exercise;
import com.lmstoeic.feature.course.entity.ExerciseQuestion;
import com.lmstoeic.feature.course.entity.ExerciseQuestionGroup;
import com.lmstoeic.feature.course.entity.Topic;
import com.lmstoeic.feature.course.repository.ExerciseQuestionGroupRepository;
import com.lmstoeic.feature.course.repository.ExerciseQuestionRepository;
import com.lmstoeic.feature.course.repository.ExerciseRepository;
import com.lmstoeic.feature.course.repository.TopicRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final TopicRepository topicRepository;
    private final ExerciseQuestionRepository exerciseQuestionRepository;
    private final ExerciseQuestionGroupRepository exerciseQuestionGroupRepository;

    @Transactional(readOnly = true)
    public ExerciseDetailDto getExerciseDetail(Long id) {
        Exercise exercise = exerciseRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise", "id", id.toString()));

        List<ExerciseQuestionDto> questions = exercise.getQuestions() == null
                ? List.of()
                : exercise.getQuestions().stream()
                        .filter(question -> question.getGroup() == null)
                        .sorted(Comparator.comparing(ExerciseQuestion::getQuestionNumber,
                                Comparator.nullsLast(Integer::compareTo)))
                        .map(this::mapQuestion)
                        .toList();

        List<ExerciseQuestionGroupDto> groups = exercise.getQuestionGroups() == null
                ? List.of()
                : exercise.getQuestionGroups().stream()
                        .sorted(Comparator.comparing(ExerciseQuestionGroup::getOrderIndex,
                                Comparator.nullsLast(Integer::compareTo)))
                        .map(this::mapGroup)
                        .toList();

        return ExerciseDetailDto.builder()
                .id(exercise.getId())
                .exerciseType(exercise.getExerciseType() != null ? exercise.getExerciseType().name() : null)
                .totalQuestions(exercise.getTotalQuestions())
                .orderIndex(exercise.getOrderIndex())
                .topicName(exercise.getTopic() != null ? exercise.getTopic().getTitle() : null)
                .topicSlug(exercise.getTopic() != null ? exercise.getTopic().getSlug() : null)
                .sectionSlug(exercise.getTopic() != null && exercise.getTopic().getSection() != null
                        ? exercise.getTopic().getSection().getSlug()
                        : null)
                .questions(questions)
                .questionGroups(groups)
                .build();
    }

    @Transactional
    public ExerciseDto createExercise(ExerciseRequest request) {
        Topic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", request.getTopicId().toString()));

        Exercise exercise = Exercise.builder()
                .topic(topic)
                .exerciseType(request.getExerciseType())
                .totalQuestions(request.getTotalQuestions() != null ? request.getTotalQuestions() : 0)
                .orderIndex(request.getOrderIndex())
                .isActive(request.getIsActive())
                .build();

        return mapToExerciseDto(exerciseRepository.save(exercise));
    }

    @Transactional
    public ExerciseDto updateExercise(Long id, ExerciseRequest request) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise", "id", id.toString()));
        Topic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", request.getTopicId().toString()));

        exercise.setTopic(topic);
        exercise.setExerciseType(request.getExerciseType());
        exercise.setTotalQuestions(request.getTotalQuestions() != null ? request.getTotalQuestions() : 0);
        exercise.setOrderIndex(request.getOrderIndex());
        exercise.setIsActive(request.getIsActive());

        return mapToExerciseDto(exerciseRepository.save(exercise));
    }

    @Transactional
    public void deleteExercise(Long id) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise", "id", id.toString()));
        exerciseRepository.delete(exercise);
    }

    @Transactional
    public ExerciseQuestionDto addQuestion(Long exerciseId, ExerciseQuestionRequest request) {
        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise", "id", exerciseId.toString()));

        ExerciseQuestion question = buildQuestion(request);
        question.setExercise(exercise);
        ExerciseQuestion saved = exerciseQuestionRepository.save(question);
        refreshTotalQuestions(exercise);
        return mapQuestion(saved);
    }

    @Transactional
    public void deleteQuestion(Long questionId) {
        ExerciseQuestion question = exerciseQuestionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("ExerciseQuestion", "id", questionId.toString()));
        Exercise exercise = question.getExercise();
        exerciseQuestionRepository.delete(question);
        if (exercise != null) {
            refreshTotalQuestions(exercise);
        }
    }

    @Transactional
    public ExerciseQuestionGroupDto addQuestionGroup(Long exerciseId, ExerciseQuestionGroupRequest request) {
        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise", "id", exerciseId.toString()));

        ExerciseQuestionGroup group = ExerciseQuestionGroup.builder()
                .exercise(exercise)
                .orderIndex(request.getOrderIndex())
                .audioUrl(request.getAudioUrl())
                .imageUrl(request.getImageUrl())
                .passage(request.getPassage())
                .sourceTopicId(request.getSourceTopicId())
                .build();
        ExerciseQuestionGroup savedGroup = exerciseQuestionGroupRepository.save(group);

        if (request.getQuestions() != null) {
            for (ExerciseQuestionRequest questionRequest : request.getQuestions()) {
                ExerciseQuestion question = buildQuestion(questionRequest);
                question.setExercise(exercise);
                question.setGroup(savedGroup);
                exerciseQuestionRepository.save(question);
            }
        }

        refreshTotalQuestions(exercise);
        return mapGroup(savedGroup);
    }

    @Transactional
    public ExerciseQuestionGroupDto updateQuestionGroup(Long groupId, ExerciseQuestionGroupRequest request) {
        ExerciseQuestionGroup group = exerciseQuestionGroupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("ExerciseQuestionGroup", "id", groupId.toString()));
        group.setOrderIndex(request.getOrderIndex());
        group.setAudioUrl(request.getAudioUrl());
        group.setImageUrl(request.getImageUrl());
        group.setPassage(request.getPassage());
        group.setSourceTopicId(request.getSourceTopicId());
        return mapGroup(exerciseQuestionGroupRepository.save(group));
    }

    @Transactional
    public void deleteQuestionGroup(Long groupId) {
        ExerciseQuestionGroup group = exerciseQuestionGroupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("ExerciseQuestionGroup", "id", groupId.toString()));
        Exercise exercise = group.getExercise();
        exerciseQuestionGroupRepository.delete(group);
        if (exercise != null) {
            refreshTotalQuestions(exercise);
        }
    }

    private ExerciseQuestionGroupDto mapGroup(ExerciseQuestionGroup group) {
        List<ExerciseQuestionDto> questions = group.getQuestions() == null
                ? List.of()
                : group.getQuestions().stream()
                        .sorted(Comparator.comparing(ExerciseQuestion::getQuestionNumber,
                                Comparator.nullsLast(Integer::compareTo)))
                        .map(this::mapQuestion)
                        .toList();

        return ExerciseQuestionGroupDto.builder()
                .id(group.getId())
                .orderIndex(group.getOrderIndex())
                .audioUrl(group.getAudioUrl())
                .imageUrl(group.getImageUrl())
                .passage(group.getPassage())
                .questions(questions)
                .build();
    }

    private ExerciseQuestionDto mapQuestion(ExerciseQuestion question) {
        return ExerciseQuestionDto.builder()
                .id(question.getId())
                .questionNumber(question.getQuestionNumber())
                .content(question.getContent())
                .optionA(question.getOptionA())
                .optionB(question.getOptionB())
                .optionC(question.getOptionC())
                .optionD(question.getOptionD())
                .correctAnswer(question.getCorrectAnswer())
                .explanation(question.getExplanation())
                .build();
    }

    private ExerciseQuestion buildQuestion(ExerciseQuestionRequest request) {
        return ExerciseQuestion.builder()
                .questionNumber(request.getQuestionNumber())
                .content(request.getContent())
                .optionA(request.getOptionA())
                .optionB(request.getOptionB())
                .optionC(request.getOptionC())
                .optionD(request.getOptionD())
                .correctAnswer(request.getCorrectAnswer())
                .explanation(request.getExplanation())
                .sourceTopicId(request.getSourceTopicId())
                .build();
    }

    private void refreshTotalQuestions(Exercise exercise) {
        Exercise managed = exerciseRepository.findById(exercise.getId()).orElse(exercise);
        int total = managed.getQuestions() == null ? 0 : managed.getQuestions().size();
        managed.setTotalQuestions(total);
        exerciseRepository.save(managed);
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
