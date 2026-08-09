package com.lmstoeic.feature.course.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lmstoeic.common.exception.ResourceNotFoundException;
import com.lmstoeic.feature.course.dto.ExerciseQuestionDto;
import com.lmstoeic.feature.course.dto.request.QuestionRequest;
import com.lmstoeic.feature.course.entity.Exercise;
import com.lmstoeic.feature.course.entity.ExerciseQuestion;
import com.lmstoeic.feature.course.entity.ExerciseQuestionGroup;
import com.lmstoeic.feature.course.repository.ExerciseQuestionGroupRepository;
import com.lmstoeic.feature.course.repository.ExerciseQuestionRepository;
import com.lmstoeic.feature.course.repository.ExerciseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExerciseQuestionService {

    private final ExerciseQuestionRepository questionRepository;
    private final ExerciseRepository exerciseRepository;
    private final ExerciseQuestionGroupRepository questionGroupRepository;

    @Transactional
    public ExerciseQuestionDto createQuestion(QuestionRequest request) {
        Exercise exercise = null;
        if (request.getExerciseId() != null) {
            exercise = exerciseRepository.findById(request.getExerciseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Exercise", "id", request.getExerciseId().toString()));
        }

        ExerciseQuestionGroup group = null;
        if (request.getGroupId() != null) {
            group = questionGroupRepository.findById(request.getGroupId())
                    .orElseThrow(() -> new ResourceNotFoundException("ExerciseQuestionGroup", "id", request.getGroupId().toString()));
        }

        ExerciseQuestion question = ExerciseQuestion.builder()
                .questionNumber(request.getQuestionNumber())
                .audioStartMs(request.getAudioStartMs())
                .audioEndMs(request.getAudioEndMs())
                .content(request.getContent())
                .optionA(request.getOptionA())
                .optionB(request.getOptionB())
                .optionC(request.getOptionC())
                .optionD(request.getOptionD())
                .correctAnswer(request.getCorrectAnswer())
                .explanation(request.getExplanation())
                .sourceTopicId(request.getSourceTopicId())
                .exercise(exercise)
                .group(group)
                .build();

        return mapToDto(questionRepository.save(question));
    }

    @Transactional
    public void deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new ResourceNotFoundException("ExerciseQuestion", "id", id.toString());
        }
        questionRepository.deleteById(id);
    }

    private ExerciseQuestionDto mapToDto(ExerciseQuestion question) {
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
                .sourceTopicId(question.getSourceTopicId())
                .exerciseId(question.getExercise() != null ? question.getExercise().getId() : null)
                .groupId(question.getGroup() != null ? question.getGroup().getId() : null)
                .build();
    }
}
