package org.example.nezai.controller;

import org.example.nezai.dto.ChatRequest;
import org.example.nezai.dto.ChatResponse;
import org.example.nezai.service.ChatService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {

        return chatService.chat(request.getContent());

    }

}