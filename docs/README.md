# Nez AI documentation

- [Getting started](getting-started.md) — install and run the full project.
- [Offline voice input](offline-voice-input.md) — configure local whisper.cpp transcription.
- [Troubleshooting](troubleshooting.md) — solve common startup, model, and microphone issues.

## Runtime flow

```text
React / Vite (localhost:5173)
        |
        v
Spring Boot (localhost:8081)
   |                    |
   v                    v
Ollama             whisper.cpp
qwen3.5:4b         base.en
```

All services run on the same computer. Ollama and whisper.cpp must be installed locally before their respective features can work.
