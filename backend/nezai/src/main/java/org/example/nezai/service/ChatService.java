package org.example.nezai.service;

import org.example.nezai.dto.ChatResponse;
import org.example.nezai.dto.ChatMessage;
import org.example.nezai.service.ollama.OllamaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Service
public class ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);
    private final OllamaService ollamaService;

    public ChatService(OllamaService ollamaService) {
        this.ollamaService = ollamaService;
    }

    public ChatResponse chat(List<ChatMessage> history, List<MultipartFile> images, boolean think) {
        if (history == null || history.isEmpty()) {
            throw new IllegalArgumentException("Conversation history must contain at least one message.");
        }

        if (images != null) {
            images.stream()
                    .filter(image -> image != null && !image.isEmpty())
                    .forEach(image -> logger.info("Image received: {}", image.getOriginalFilename()));
        }

        String reply = ollamaService.ask(history, images, think);

        return new ChatResponse(reply);

    }
}
