package org.example.nezai.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SpeechService {

    private static final Logger logger = LoggerFactory.getLogger(SpeechService.class);

    @Value("${speech.whisper.executable}")
    private String whisperExecutable;

    @Value("${speech.whisper.model}")
    private String whisperModel;

    @Value("${speech.whisper.language}")
    private String language;

    @Value("${speech.whisper.threads}")
    private int threads;

    @Value("${speech.whisper.timeout-seconds}")
    private long timeoutSeconds;

    public String transcribe(MultipartFile audio) {
        if (audio == null || audio.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please provide a recorded audio file.");
        }

        validateConfiguration();

        Path audioFile = null;
        Path transcriptFile = null;
        Path processLogFile = null;
        try {
            audioFile = Files.createTempFile("nez-ai-recording-", ".wav");
            transcriptFile = audioFile.resolveSibling(audioFile.getFileName() + "-transcript.txt");
            processLogFile = audioFile.resolveSibling(audioFile.getFileName() + "-whisper.log");
            audio.transferTo(audioFile);

            List<String> command = new ArrayList<>(List.of(
                    whisperExecutable,
                    "-m", whisperModel,
                    "-l", language,
                    "-t", String.valueOf(threads),
                    "-nt",
                    "-otxt",
                    "-of", transcriptFile.toString().replaceFirst("\\.txt$", ""),
                    "-f", audioFile.toString()
            ));

            Process process = new ProcessBuilder(command)
                    .redirectErrorStream(true)
                    .redirectOutput(processLogFile.toFile())
                    .start();

            if (!process.waitFor(timeoutSeconds, TimeUnit.SECONDS)) {
                process.destroyForcibly();
                throw new ResponseStatusException(HttpStatus.GATEWAY_TIMEOUT, "Local transcription timed out. Please try a shorter recording.");
            }

            String processOutput = Files.readString(processLogFile, StandardCharsets.UTF_8);

            if (process.exitValue() != 0) {
                logger.error("whisper.cpp exited with code {}: {}", process.exitValue(), processOutput);
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Local transcription failed. Check the whisper.cpp configuration.");
            }

            if (!Files.exists(transcriptFile)) {
                logger.error("whisper.cpp completed without a transcript file: {}", processOutput);
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Local transcription did not return any text.");
            }

            return Files.readString(transcriptFile, StandardCharsets.UTF_8).trim();
        } catch (IOException ex) {
            logger.warn("Unable to run whisper.cpp", ex);
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "whisper.cpp is unavailable. Check the configured executable and model path.", ex);
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Local transcription was interrupted.", ex);
        } finally {
            deleteIfPresent(audioFile);
            deleteIfPresent(transcriptFile);
            deleteIfPresent(processLogFile);
        }
    }

    private void validateConfiguration() {
        if (whisperExecutable == null || whisperExecutable.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "whisper.cpp is not configured. Set speech.whisper.executable.");
        }
        if (whisperModel == null || whisperModel.isBlank() || !Files.isRegularFile(Path.of(whisperModel))) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Whisper model not found. Set speech.whisper.model to a local model file.");
        }

        Path executablePath = Path.of(whisperExecutable);
        if (executablePath.getParent() != null && !Files.isRegularFile(executablePath)) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "whisper.cpp executable not found. Set speech.whisper.executable to its local path.");
        }
    }

    private void deleteIfPresent(Path path) {
        if (path == null) {
            return;
        }
        try {
            Files.deleteIfExists(path);
        } catch (IOException ex) {
            logger.warn("Could not remove temporary speech file: {}", path, ex);
        }
    }
}
