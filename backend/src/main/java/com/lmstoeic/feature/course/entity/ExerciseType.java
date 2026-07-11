package com.lmstoeic.feature.course.entity;

/**
 * Loại bài tập — mỗi Part TOEIC cần layout frontend khác nhau
 */
public enum ExerciseType {
    GRAMMAR,            // Ngữ pháp — MCQ thuần
    LISTENING_PART1,    // Photographs — audio + image + MCQ
    LISTENING_PART2,    // Question-Response — audio + MCQ (3 đáp án)
    LISTENING_PART3,    // Conversations — audio + N câu hỏi
    LISTENING_PART4,    // Talks — audio + N câu hỏi
    READING_PART5,      // Incomplete Sentences — MCQ thuần
    READING_PART6,      // Text Completion — passage + N câu hỏi
    READING_PART7       // Reading Comprehension — passage + N câu hỏi
}


