package org.example.nezai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestClient;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OllamaConfig {

    @Bean
    public RestClient restClient() {
        return RestClient.create();
    }

}