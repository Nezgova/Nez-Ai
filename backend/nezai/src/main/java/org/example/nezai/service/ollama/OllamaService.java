package org.example.nezai.service.ollama;

import tools.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import java.io.IOException;
import java.util.Base64;
import java.util.List;

import org.example.nezai.dto.ollama.Message;
import org.example.nezai.dto.ollama.OllamaRequest;
import org.example.nezai.dto.ollama.OllamaResponse;
import org.example.nezai.dto.ChatMessage;

@Service
public class OllamaService {

    private static final Logger logger = LoggerFactory.getLogger(OllamaService.class);
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${ollama.url}")
    private String ollamaUrl;

    @Value("${ollama.model}")
    private String model;


    public OllamaService(RestClient restClient, ObjectMapper objectMapper) {
        this.restClient = restClient;
        this.objectMapper = objectMapper;
    }

    public String ask(List<ChatMessage> history, List<MultipartFile> images, boolean think) {
        try {
            OllamaRequest request = buildRequest(history, images, think);

            logRequestPayload(request);

            OllamaResponse response = restClient.post()
                    .uri(ollamaUrl + "/api/chat")
                    .body(request)
                    .retrieve()
                    .body(OllamaResponse.class);

            return getResponseContent(response);
        } catch (IOException ex) {
            logger.error("Failed to read uploaded image", ex);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to process uploaded image", ex);
        } catch (ResourceAccessException ex) {
            throw ollamaUnavailable(ex);
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception ex) {
            logger.error("Ollama chat request failed", ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to call Ollama", ex);
        }
    }

    OllamaRequest buildRequest(List<ChatMessage> history, List<MultipartFile> images, boolean think) throws IOException {
        List<Message> messages = new java.util.ArrayList<>();
        int imageIndex = 0;
        for (ChatMessage historyMessage : history) {
            Message message = new Message(historyMessage.getRole(), historyMessage.getContent());
            if (historyMessage.isHasImage()) {
                if (images == null || imageIndex >= images.size() || images.get(imageIndex).isEmpty()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Conversation history references a missing image");
                }
                message.setImages(List.of(Base64.getEncoder().encodeToString(images.get(imageIndex++).getBytes())));
            }
            messages.add(message);
        }
        return new OllamaRequest(model, think, false, messages);
    }

    private String getResponseContent(OllamaResponse response) {
        if (response == null || response.getMessage() == null || response.getMessage().getContent() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Ollama returned an invalid chat response");
        }
        return response.getMessage().getContent();
    }

    private ResponseStatusException ollamaUnavailable(ResourceAccessException ex) {
        logger.warn("Ollama is unavailable at {}. Start Ollama and verify that it is listening on port 11434.", ollamaUrl);
        return new ResponseStatusException(
                HttpStatus.SERVICE_UNAVAILABLE,
                "Ollama is unavailable. Start Ollama and make sure it is listening at " + ollamaUrl,
                ex
        );
    }

    private void logRequestPayload(OllamaRequest request) {
        try {
            List<Message> debugMessages = request.getMessages().stream().map(message -> {
                Message debugMessage = new Message(message.getRole(), message.getContent());
                if (message.getImages() != null && !message.getImages().isEmpty()) {
                    debugMessage.setImages(List.of("[base64 image omitted]"));
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
            logger.info("Ollama request payload (images omitted): {}", debugJson);
        } catch (Exception ex) {
            logger.warn("Failed to log Ollama request payload", ex);
        }
    }

}
