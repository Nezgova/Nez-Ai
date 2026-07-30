package org.example.nezai.service;

import org.example.nezai.dto.ChatResponse;
import org.example.nezai.service.ollama.OllamaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);
    private final OllamaService ollamaService;

    public ChatService(OllamaService ollamaService) {
        this.ollamaService = ollamaService;
    }

    public ChatResponse chat(String message, MultipartFile image, MultipartFile pdf) {

        if (image != null && !image.isEmpty()) {
            logger.info("Image received: {}", image.getOriginalFilename());
            String reply = ollamaService.askWithImage(message, image);
            return new ChatResponse(reply);
        }

        if (pdf != null && !pdf.isEmpty()) {
            logger.info("PDF received: {}", pdf.getOriginalFilename());
        }

        String reply = ollamaService.ask(message);

        return new ChatResponse(reply);

    }
}