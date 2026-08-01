package org.example.nezai.controller;

import org.example.nezai.dto.ChatResponse;
import org.example.nezai.dto.ChatMessage;
import org.example.nezai.service.ChatService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping(value = "/chat", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ChatResponse chat(
            @RequestPart("history") List<ChatMessage> history,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @RequestParam(value = "think", required = false, defaultValue = "false") boolean think,
            @RequestParam(value = "stream", required = false, defaultValue = "false") boolean stream
    ) {
        return chatService.chat(history, images, think, stream);

    }

}
