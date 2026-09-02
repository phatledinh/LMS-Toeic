package com.lmstoeic.feature.course.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lmstoeic.feature.course.entity.ExerciseQuestionGroup;

@Repository
public interface ExerciseQuestionGroupRepository extends JpaRepository<ExerciseQuestionGroup, Long> {
    @Query("select questionGroup.exercise.id from ExerciseQuestionGroup questionGroup where questionGroup.id = :groupId")
    Long findExerciseIdByGroupId(@Param("groupId") Long groupId);

    @Modifying
    @Query(value = "delete from group_topic_tags where group_id = :groupId", nativeQuery = true)
    void deleteTopicTagsByGroupId(@Param("groupId") Long groupId);

    @Modifying
    @Query(value = "delete from group_content_blocks where group_id = :groupId", nativeQuery = true)
    void deleteContentBlocksByGroupId(@Param("groupId") Long groupId);

    @Modifying
    @Query(value = "delete from exercise_question_groups where id = :groupId", nativeQuery = true)
    void deleteGroupRowById(@Param("groupId") Long groupId);
}
