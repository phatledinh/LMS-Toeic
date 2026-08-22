package com.lmstoeic.feature.course.service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;

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
import com.lmstoeic.feature.course.entity.ExerciseType;
import com.lmstoeic.feature.course.entity.Topic;
import com.lmstoeic.feature.course.repository.ExerciseQuestionGroupRepository;
import com.lmstoeic.feature.course.repository.ExerciseQuestionRepository;
import com.lmstoeic.feature.course.repository.ExerciseRepository;
import com.lmstoeic.feature.course.repository.TopicRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private static final String ONLINE_TEST_MARKER = "[ONLINE_TEST]";

    private static final Map<ExerciseType, Integer> STANDARD_QUESTION_COUNTS = Map.of(
            ExerciseType.LISTENING_PART1, 6,
            ExerciseType.LISTENING_PART2, 25,
            ExerciseType.LISTENING_PART3, 39,
            ExerciseType.LISTENING_PART4, 30,
            ExerciseType.READING_PART5, 30,
            ExerciseType.READING_PART6, 16,
            ExerciseType.READING_PART7, 54);

    private static final Map<ExerciseType, Integer> STANDARD_ORDER_INDEXES = Map.of(
            ExerciseType.LISTENING_PART1, 1,
            ExerciseType.LISTENING_PART2, 2,
            ExerciseType.LISTENING_PART3, 3,
            ExerciseType.LISTENING_PART4, 4,
            ExerciseType.READING_PART5, 5,
            ExerciseType.READING_PART6, 6,
            ExerciseType.READING_PART7, 7);

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
        validateOnlineTestPart(topic, request.getExerciseType(), null);

        Exercise exercise = Exercise.builder()
                .topic(topic)
                .exerciseType(request.getExerciseType())
                .totalQuestions(resolveTotalQuestions(request))
                .orderIndex(resolveOrderIndex(request))
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
        validateOnlineTestPart(topic, request.getExerciseType(), id);

        exercise.setTopic(topic);
        exercise.setExerciseType(request.getExerciseType());
        exercise.setTotalQuestions(resolveTotalQuestions(request));
        exercise.setOrderIndex(resolveOrderIndex(request));
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
        validateQuestionLimit(exercise, 1);

        ExerciseQuestion question = buildQuestion(request);
        question.setExercise(exercise);
        ExerciseQuestion saved = exerciseQuestionRepository.save(question);
        refreshTotalQuestions(exercise);
        return mapQuestion(saved);
    }

    @Transactional
    public void deleteQuestion(Long questionId) {
        Long exerciseId = exerciseQuestionRepository.findExerciseIdByQuestionId(questionId);
        if (exerciseId == null) {
            throw new ResourceNotFoundException("ExerciseQuestion", "id", questionId.toString());
        }

        exerciseQuestionRepository.deletePracticeStatsByQuestionId(questionId);
        exerciseQuestionRepository.deleteTopicTagsByQuestionId(questionId);
        exerciseQuestionRepository.deleteQuestionRowById(questionId);
        exerciseRepository.findById(exerciseId).ifPresent(this::refreshTotalQuestions);
    }

    @Transactional
    public ExerciseQuestionGroupDto addQuestionGroup(Long exerciseId, ExerciseQuestionGroupRequest request) {
        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise", "id", exerciseId.toString()));
        int addedQuestions = request.getQuestions() == null ? 0 : request.getQuestions().size();
        validateQuestionLimit(exercise, addedQuestions);

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
        Long exerciseId = exerciseQuestionGroupRepository.findExerciseIdByGroupId(groupId);
        if (exerciseId == null) {
            throw new ResourceNotFoundException("ExerciseQuestionGroup", "id", groupId.toString());
        }

        exerciseQuestionRepository.deletePracticeStatsByGroupId(groupId);
        exerciseQuestionRepository.deleteTopicTagsByGroupId(groupId);
        exerciseQuestionRepository.deleteByGroupId(groupId);
        exerciseQuestionGroupRepository.deleteTopicTagsByGroupId(groupId);
        exerciseQuestionGroupRepository.deleteContentBlocksByGroupId(groupId);
        exerciseQuestionGroupRepository.deleteGroupRowById(groupId);
        exerciseRepository.findById(exerciseId).ifPresent(this::refreshTotalQuestions);
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
        Integer standardTotal = STANDARD_QUESTION_COUNTS.get(managed.getExerciseType());
        if (standardTotal != null) {
            managed.setTotalQuestions(standardTotal);
            exerciseRepository.save(managed);
            return;
        }

        int total = Math.toIntExact(exerciseQuestionRepository.countByExerciseId(managed.getId()));
        managed.setTotalQuestions(total);
        exerciseRepository.save(managed);
    }

    private void validateQuestionLimit(Exercise exercise, int addedQuestions) {
        Integer standardTotal = STANDARD_QUESTION_COUNTS.get(exercise.getExerciseType());
        if (standardTotal == null || addedQuestions <= 0) {
            return;
        }

        long currentQuestions = exerciseQuestionRepository.countByExerciseId(exercise.getId());
        if (currentQuestions + addedQuestions > standardTotal) {
            throw new IllegalArgumentException(String.format(
                    "%s chỉ được có đúng %d câu. Hiện đã có %d câu, không thể thêm %d câu nữa.",
                    exercise.getExerciseType().name(),
                    standardTotal,
                    currentQuestions,
                    addedQuestions));
        }
    }

    private Integer resolveTotalQuestions(ExerciseRequest request) {
        Integer standardTotal = STANDARD_QUESTION_COUNTS.get(request.getExerciseType());
        return standardTotal != null
                ? standardTotal
                : request.getTotalQuestions() != null ? request.getTotalQuestions() : 0;
    }

    private Integer resolveOrderIndex(ExerciseRequest request) {
        return STANDARD_ORDER_INDEXES.getOrDefault(request.getExerciseType(), request.getOrderIndex());
    }

    private void validateOnlineTestPart(Topic topic, ExerciseType exerciseType, Long currentExerciseId) {
        if (!isOnlineTestTopic(topic) || !STANDARD_QUESTION_COUNTS.containsKey(exerciseType)) {
            return;
        }

        List<Exercise> existingExercises = topic.getSection().getTopics().stream()
                .filter(existingTopic -> Boolean.TRUE.equals(existingTopic.getIsActive()))
                .flatMap(existingTopic -> existingTopic.getExercises() == null
                        ? java.util.stream.Stream.<Exercise>empty()
                        : existingTopic.getExercises().stream())
                .filter(existingExercise -> Boolean.TRUE.equals(existingExercise.getIsActive()))
                .filter(existingExercise -> !Objects.equals(existingExercise.getId(), currentExerciseId))
                .filter(existingExercise -> STANDARD_QUESTION_COUNTS.containsKey(existingExercise.getExerciseType()))
                .toList();

        boolean duplicatePart = existingExercises.stream()
                .anyMatch(existingExercise -> existingExercise.getExerciseType() == exerciseType);
        if (duplicatePart) {
            throw new IllegalArgumentException("Part này đã tồn tại trong bộ đề online.");
        }

        if (currentExerciseId == null && existingExercises.size() >= STANDARD_QUESTION_COUNTS.size()) {
            throw new IllegalArgumentException("Một bộ đề TOEIC online chỉ được có đúng 7 part.");
        }
    }

    private boolean isOnlineTestTopic(Topic topic) {
        if (topic == null || topic.getSection() == null) {
            return false;
        }

        String text = String.join(" ",
                safeLower(topic.getSection().getSlug()),
                safeLower(topic.getSection().getTitle()),
                safeLower(topic.getSection().getDescription()));
        return text.contains("online")
                || text.contains("de-thi")
                || text.contains("đề thi")
                || text.contains(ONLINE_TEST_MARKER.toLowerCase());
    }

    private String safeLower(String value) {
        return value == null ? "" : value.toLowerCase();
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
