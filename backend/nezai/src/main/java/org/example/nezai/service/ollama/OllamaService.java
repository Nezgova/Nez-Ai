package org.example.nezai.service.ollama;

import tools.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import java.io.IOException;
import java.util.Base64;
import java.util.List;

import org.example.nezai.dto.ollama.Message;
import org.example.nezai.dto.ollama.OllamaRequest;
import org.example.nezai.dto.ollama.OllamaResponse;

@Service
public class OllamaService {

    private static final Logger logger = LoggerFactory.getLogger(OllamaService.class);
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${ollama.url}")
    private String ollamaUrl;

    @Value("${ollama.model}")
    private String model;

    @Value("${ollama.think}")
    private boolean think;

    public OllamaService(RestClient restClient, ObjectMapper objectMapper) {
        this.restClient = restClient;
        this.objectMapper = objectMapper;
    }

    public String ask(String prompt) {

        OllamaRequest request = new OllamaRequest(
                model,
                think,
                false,
                List.of(
                        new Message("user", prompt)
                )
        );

        OllamaResponse response = restClient.post()
                .uri(ollamaUrl + "/api/chat")
                .body(request)
                .retrieve()
                .body(OllamaResponse.class);

        return response.getMessage().getContent();

    }

    public String askWithImage(String prompt, MultipartFile image) {
        logger.info("Vision request started");
        logger.info("Image filename: {}", image.getOriginalFilename());
        logger.info("Image size: {} bytes", image.getSize());

        try {
            byte[] imageBytes = image.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            String imagePayload = base64Image;

            Message userMessage = new Message("user", prompt);
            userMessage.setImages(List.of(imagePayload));

            OllamaRequest request = new OllamaRequest(
                    model,
                    think,
                    false,
                    List.of(userMessage)
            );

            logRequestPayload(request, base64Image.length());

            OllamaResponse response = restClient.post()
                    .uri(ollamaUrl + "/api/chat")
                    .body(request)
                    .retrieve()
                    .body(OllamaResponse.class);

            logger.info("Vision response received");
            return response.getMessage().getContent();
        } catch (IOException ex) {
            logger.error("Failed to read uploaded image", ex);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to process uploaded image", ex);
        } catch (Exception ex) {
            logger.error("Vision request failed", ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to call Ollama vision model", ex);
        }
    }

    private void logRequestPayload(OllamaRequest request, int imageLength) {
        try {
            List<Message> debugMessages = request.getMessages().stream().map(message -> {
                Message debugMessage = new Message(message.getRole(), message.getContent());
                if (message.getImages() != null && !message.getImages().isEmpty()) {
                    debugMessage.setImages(List.of("[base64 image omitted, length=" + imageLength + "]"));
                }
                return debugMessage;
            }).toList();

            OllamaRequest debugRequest = new OllamaRequest(
                    request.getModel(),
                    request.isThink(),
                    request.isStream(),
                    debugMessages
            );
            String debugJson = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(debugRequest);
            logger.info("Ollama vision request payload: {}", debugJson);
        } catch (Exception ex) {
            logger.warn("Failed to log Ollama request payload", ex);
        }
    }

    private String getImageExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "png";
        }
        String extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        if (extension.equals("jpg")) {
            extension = "jpeg";
        }
        if (extension.equals("jpeg") || extension.equals("png") || extension.equals("webp")) {
            return extension;
        }
        return "png";
    }

}