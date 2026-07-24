package org.example.nezai.service;

import org.example.nezai.dto.ChatResponse;
import org.example.nezai.service.ollama.OllamaService;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final OllamaService ollamaService;

    public ChatService(OllamaService ollamaService) {
        this.ollamaService = ollamaService;
    }

    public ChatResponse chat(String message) {

        String reply = ollamaService.ask(message);

        return new ChatResponse(reply);

    }
}