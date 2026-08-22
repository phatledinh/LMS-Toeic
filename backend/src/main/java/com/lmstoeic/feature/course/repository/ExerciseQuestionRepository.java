package com.lmstoeic.feature.course.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lmstoeic.feature.course.entity.ExerciseQuestion;

@Repository
public interface ExerciseQuestionRepository extends JpaRepository<ExerciseQuestion, Long> {
    long countByExerciseId(Long exerciseId);

    @Query("select question.exercise.id from ExerciseQuestion question where question.id = :questionId")
    Long findExerciseIdByQuestionId(@Param("questionId") Long questionId);

    @Modifying
    @Query(value = "delete from practice_question_stats where question_id = :questionId", nativeQuery = true)
    void deletePracticeStatsByQuestionId(@Param("questionId") Long questionId);

    @Modifying
    @Query(value = "delete from question_topic_tags where question_id = :questionId", nativeQuery = true)
    void deleteTopicTagsByQuestionId(@Param("questionId") Long questionId);

    @Modifying
    @Query(value = """
            delete from practice_question_stats
            where question_id in (
                select id from exercise_questions where group_id = :groupId
            )
            """, nativeQuery = true)
    void deletePracticeStatsByGroupId(@Param("groupId") Long groupId);

    @Modifying
    @Query(value = """
            delete from question_topic_tags
            where question_id in (
                select id from exercise_questions where group_id = :groupId
            )
            """, nativeQuery = true)
    void deleteTopicTagsByGroupId(@Param("groupId") Long groupId);

    @Modifying
    @Query(value = "delete from exercise_questions where group_id = :groupId", nativeQuery = true)
    void deleteByGroupId(@Param("groupId") Long groupId);

    @Modifying
    @Query(value = "delete from exercise_questions where id = :questionId", nativeQuery = true)
    void deleteQuestionRowById(@Param("questionId") Long questionId);
}
