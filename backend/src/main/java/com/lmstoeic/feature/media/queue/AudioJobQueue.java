package com.lmstoeic.feature.media.queue;

import java.time.Duration;
import java.util.Optional;

public interface AudioJobQueue {
    void enqueue(Long jobId);

    Optional<Long> poll(Duration timeout);
}
