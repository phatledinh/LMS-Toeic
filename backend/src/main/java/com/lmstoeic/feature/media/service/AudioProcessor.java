package com.lmstoeic.feature.media.service;

import java.nio.file.Path;

public interface AudioProcessor {
    AudioProcessingResult process(Path inputFile, Path outputFile);
}
