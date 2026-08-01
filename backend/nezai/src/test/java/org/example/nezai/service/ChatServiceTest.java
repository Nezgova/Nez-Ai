package org.example.nezai.service;

import org.example.nezai.dto.ChatResponse;
import org.example.nezai.dto.ChatMessage;
import org.example.nezai.service.ollama.OllamaService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import java.util.List;

@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Mock
    private OllamaService ollamaService;

    @InjectMocks
    private ChatService chatService;

    @Test
    void shouldPassThinkPreferenceToOllamaForTextChats() {
        List<ChatMessage> history = List.of(
                new ChatMessage("user", "The secret word is pineapple.", false),
                new ChatMessage("assistant", "Got it.", false),
                new ChatMessage("user", "What is the secret word?", false)
        );
        when(ollamaService.ask(history, null, true, false)).thenReturn("reply");

        ChatResponse response = chatService.chat(history, null, true, false);

        assertEquals("reply", response.getReply());
        verify(ollamaService).ask(history, null, true, false);
    }
}
