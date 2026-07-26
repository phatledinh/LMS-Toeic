package com.lmstoeic.feature.media.service;

import com.lmstoeic.config.StorageProperties;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.List;
import java.util.concurrent.TimeUnit;
import org.springframework.stereotype.Service;

@Service
public class FfmpegAudioProcessor implements AudioProcessor {
    private final StorageProperties storageProperties;

    public FfmpegAudioProcessor(StorageProperties storageProperties) {
        this.storageProperties = storageProperties;
    }

    @Override
    public AudioProcessingResult process(Path inputFile, Path outputFile) {
        int durationSeconds = probeDuration(inputFile);
        runFfmpeg(inputFile, outputFile);
        try {
            return new AudioProcessingResult(outputFile.toString(), durationSeconds, Files.size(outputFile));
        } catch (IOException e) {
            throw new IllegalStateException("Không thể đọc file audio đã xử lý", e);
        }
    }

    private int probeDuration(Path inputFile) {
        List<String> command = List.of(
                storageProperties.getAudio().getFfprobePath(),
                "-v", "error",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1",
                inputFile.toString());
        String output = run(command, Duration.ofMinutes(1));
        try {
            return (int) Math.ceil(Double.parseDouble(output.trim()));
        } catch (NumberFormatException e) {
            throw new IllegalStateException("Không thể xác định thời lượng audio", e);
        }
    }

    private void runFfmpeg(Path inputFile, Path outputFile) {
        List<String> command = List.of(
                storageProperties.getAudio().getFfmpegPath(),
                "-y",
                "-i", inputFile.toString(),
                "-vn",
                "-codec:a", "libmp3lame",
                "-b:a", storageProperties.getAudio().getBitrate(),
                "-ar", String.valueOf(storageProperties.getAudio().getSampleRate()),
                outputFile.toString());
        run(command, Duration.ofMinutes(storageProperties.getAudio().getProcessingTimeoutMinutes()));
    }

    private String run(List<String> command, Duration timeout) {
        Path outputLog;
        try {
            outputLog = Files.createTempFile("audio-process-", ".log");
        } catch (IOException e) {
            throw new IllegalStateException("Không thể tạo file log xử lý audio", e);
        }

        Process process;
        try {
            process = new ProcessBuilder(command)
                    .redirectErrorStream(true)
                    .redirectOutput(outputLog.toFile())
                    .start();
        } catch (IOException e) {
            deleteLog(outputLog);
            throw new IllegalStateException("Không thể chạy công cụ xử lý audio: " + command.get(0), e);
        }

        try {
            boolean finished = process.waitFor(timeout.toSeconds(), TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                throw new IllegalStateException("Xử lý audio quá thời gian cho phép");
            }
            String output = Files.readString(outputLog, StandardCharsets.UTF_8);
            if (process.exitValue() != 0) {
                throw new IllegalStateException("Xử lý audio thất bại: " + output);
            }
            return output;
        } catch (IOException e) {
            throw new IllegalStateException("Không thể đọc output xử lý audio", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            process.destroyForcibly();
            throw new IllegalStateException("Xử lý audio bị gián đoạn", e);
        } finally {
            deleteLog(outputLog);
        }
    }

    private void deleteLog(Path outputLog) {
        try {
            Files.deleteIfExists(outputLog);
        } catch (IOException ignored) {
        }
    }
}
