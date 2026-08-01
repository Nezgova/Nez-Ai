package org.example.nezai.service.ollama;

import org.example.nezai.dto.ChatMessage;
import org.example.nezai.dto.ollama.OllamaRequest;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class OllamaServiceTest {

    @Test
    void shouldBuildOllamaPayloadWithTheEntireConversationInOrder() throws Exception {
        OllamaService service = new OllamaService(null, new ObjectMapper());
        List<ChatMessage> history = List.of(
                new ChatMessage("user", "The secret word is pineapple.", false),
                new ChatMessage("assistant", "Got it.", false),
                new ChatMessage("user", "What is the secret word?", true)
        );
        MockMultipartFile image = new MockMultipartFile("images", "secret.png", "image/png", new byte[]{1, 2, 3});

        OllamaRequest payload = service.buildRequest(history, List.of(image), true);

        assertEquals(List.of("user", "assistant", "user"), payload.getMessages().stream().map(message -> message.getRole()).toList());
        assertEquals(List.of("The secret word is pineapple.", "Got it.", "What is the secret word?"), payload.getMessages().stream().map(message -> message.getContent()).toList());
        assertTrue(payload.getMessages().get(2).getImages().getFirst().length() > 0);
        assertTrue(payload.isThink());
    }
}
