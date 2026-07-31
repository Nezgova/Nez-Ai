# Troubleshooting

## Chat says it cannot reach the backend

1. Confirm the backend is running on port `8081`.
2. Confirm the frontend is running on port `5173`.
3. Verify Ollama is running:

   ```powershell
   ollama list
   ```

4. If Ollama is not running, start it:

   ```powershell
   ollama serve
   ```

## Backend says Ollama is unavailable

Nez AI expects Ollama at `http://localhost:11434`. Confirm that `ollama list` works and that `qwen3.5:4b` appears in the list. Then restart the Spring Boot backend.

## Backend says the model is missing

Run:

```powershell
ollama pull qwen3.5:4b
```

If you chose a different model, set the same name in `ollama.model` inside `backend/nezai/src/main/resources/application.properties`.

## Voice input says the Whisper model is not found

Confirm this file exists:

```text
backend/nezai/models/ggml-base.en.bin
```

Also confirm this file exists:

```text
backend/nezai/tools/whisper/Release/whisper-cli.exe
```

Restart the backend after installing either file. See [Offline voice input](offline-voice-input.md) for setup and model switching.

## Microphone does not record

Use the Vite URL on `localhost`, allow microphone permission when prompted, and check the browser site permissions. The microphone button is push-to-talk: click once to start and once to stop.
