package org.example.nezai.dto.ollama;

import java.util.List;

public class OllamaRequest {

    private String model;
    private boolean think;
    private boolean stream;
    private List<Message> messages;

    public OllamaRequest() {
    }

    public OllamaRequest(String model, boolean think, boolean stream, List<Message> messages) {
        this.model = model;
        this.think = think;
        this.stream = stream;
        this.messages = messages;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public boolean isThink() {
        return think;
    }

    public void setThink(boolean think) {
        this.think = think;
    }

    public boolean isStream() {
        return stream;
    }

    public void setStream(boolean stream) {
        this.stream = stream;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }
}