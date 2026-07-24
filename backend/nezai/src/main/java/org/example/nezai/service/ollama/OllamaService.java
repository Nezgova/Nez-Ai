package org.example.nezai.service.ollama;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.List;

import org.example.nezai.dto.ollama.Message;
import org.example.nezai.dto.ollama.OllamaRequest;
import org.example.nezai.dto.ollama.OllamaResponse;

@Service
public class OllamaService {

    private final RestClient restClient;

    @Value("${ollama.url}")
    private String ollamaUrl;

    @Value("${ollama.model}")
    private String model;

    @Value("${ollama.think}")
    private boolean think;

    public OllamaService(RestClient restClient) {
        this.restClient = restClient;
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

}