package com.lmstoeic.feature.media.queue;

import com.lmstoeic.config.StorageProperties;
import java.time.Duration;
import java.util.Optional;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class RedisAudioJobQueue implements AudioJobQueue {
    private final StringRedisTemplate redisTemplate;
    private final StorageProperties storageProperties;

    public RedisAudioJobQueue(StringRedisTemplate redisTemplate, StorageProperties storageProperties) {
        this.redisTemplate = redisTemplate;
        this.storageProperties = storageProperties;
    }

    @Override
    public void enqueue(Long jobId) {
        redisTemplate.opsForList().leftPush(queueKey(), jobId.toString());
    }

    @Override
    public Optional<Long> poll(Duration timeout) {
        String value = redisTemplate.opsForList().rightPop(queueKey(), timeout);
        if (value == null || value.isBlank()) {
            return Optional.empty();
        }
        return Optional.of(Long.valueOf(value));
    }

    private String queueKey() {
        return storageProperties.getAudio().getQueueKey();
    }
}
