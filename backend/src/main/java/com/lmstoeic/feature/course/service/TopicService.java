package com.lmstoeic.feature.course.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lmstoeic.common.exception.ResourceNotFoundException;
import com.lmstoeic.feature.course.dto.TopicDto;
import com.lmstoeic.feature.course.dto.request.TopicRequest;
import com.lmstoeic.feature.course.entity.Section;
import com.lmstoeic.feature.course.entity.Topic;
import com.lmstoeic.feature.course.repository.SectionRepository;
import com.lmstoeic.feature.course.repository.TopicRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicRepository topicRepository;
    private final SectionRepository sectionRepository;

    @Transactional
    public TopicDto createTopic(TopicRequest request) {
        Section section = sectionRepository.findById(request.getSectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Section", "id", request.getSectionId().toString()));

        Topic topic = Topic.builder()
                .title(request.getTitle())
                .slug(request.getSlug())
                .description(request.getDescription())
                .orderIndex(request.getOrderIndex())
                .isActive(request.getIsActive())
                .section(section)
                .build();
        
        Topic saved = topicRepository.save(topic);
        return mapToTopicDtoBasic(saved);
    }

    @Transactional
    public TopicDto updateTopic(Long id, TopicRequest request) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", id.toString()));

        if (!topic.getSection().getId().equals(request.getSectionId())) {
            Section section = sectionRepository.findById(request.getSectionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Section", "id", request.getSectionId().toString()));
            topic.setSection(section);
        }

        topic.setTitle(request.getTitle());
        topic.setSlug(request.getSlug());
        topic.setDescription(request.getDescription());
        topic.setOrderIndex(request.getOrderIndex());
        topic.setIsActive(request.getIsActive());
        
        Topic saved = topicRepository.save(topic);
        return mapToTopicDtoBasic(saved);
    }

    @Transactional
    public void deleteTopic(Long id) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", id.toString()));
        topicRepository.delete(topic);
    }

    private TopicDto mapToTopicDtoBasic(Topic topic) {
        return TopicDto.builder()
                .id(topic.getId())
                .title(topic.getTitle())
                .slug(topic.getSlug())
                .description(topic.getDescription())
                .orderIndex(topic.getOrderIndex())
                .isActive(topic.getIsActive())
                .build();
    }
}
