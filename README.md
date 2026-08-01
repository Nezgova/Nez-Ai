# Nez AI

Nez AI is a privacy-first local AI chat application. It pairs a React frontend with a Spring Boot backend, uses Ollama for local LLM inference, and supports optional offline push-to-talk transcription through whisper.cpp.

No chat prompt, image, recording, or transcription is sent to a cloud AI provider by Nez AI.

## Features

- Local chat through Ollama and `qwen3.5:4b`
- Persistent conversation history with a sidebar for opening, renaming, and deleting past chats
- Optional chat settings for Thinking mode and Streaming mode
- PDF attachments (alongside images) for multimodal prompts
- Offline push-to-talk transcription with whisper.cpp and `base.en`
- Editable transcriptions — voice input never sends a message automatically
- Dark red Nez AI interface

## Requirements

| Requirement | Used for |
| --- | --- |
| Java 21 | Spring Boot backend |
| Node.js 20+ and npm | React/Vite frontend |
| Ollama | Local chat model runtime |
| `qwen3.5:4b` | Default local chat model (~3.4 GB) |
| whisper.cpp + `base.en` | Optional offline voice input |

## Quick start

### 1. Clone and install frontend packages

```powershell
git clone <your-repository-url> Nez-Ai
cd Nez-Ai\frontend
npm.cmd install
```

### 2. Install Ollama and download the local model

Install Ollama for your platform from [ollama.com](https://ollama.com/download). On Windows, the installer runs Ollama in the background and provides the `ollama` command.

```powershell
ollama pull qwen3.5:4b
ollama list
```

If Ollama is not already running, start it in a separate terminal:

```powershell
ollama serve
```

The backend expects Ollama at `http://localhost:11434` and the model name `qwen3.5:4b`. Change either value in `backend/nezai/src/main/resources/application.properties` if needed.

### 3. Start the backend

From the repository root:

```powershell
cd backend\nezai
.\mvnw.cmd spring-boot:run
```

Or open `NezaiApplication.java` in IntelliJ IDEA and run it. The backend starts at `http://localhost:8081`.

### 4. Start the frontend

In another terminal:

```powershell
cd frontend
npm.cmd run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

## Enable offline voice input (optional)

Voice input is local push-to-talk, not a voice assistant. The browser records only after the microphone is pressed, and Nez AI inserts the local transcription into the composer for editing.

1. Download the official 64-bit Windows whisper.cpp binary.
2. Extract it to `backend/nezai/tools/whisper/` so `Release/whisper-cli.exe` exists.
3. Download `ggml-base.en.bin` and place it in `backend/nezai/models/`.
4. Restart the backend.

The exact setup, model changes, and configuration options are in [Offline voice input](docs/offline-voice-input.md).

## Configuration

All local runtime settings are in [application.properties](backend/nezai/src/main/resources/application.properties).

```properties
ollama.url=http://localhost:11434
ollama.model=qwen3.5:4b

speech.whisper.executable=tools/whisper/Release/whisper-cli.exe
speech.whisper.model=models/ggml-base.en.bin
speech.whisper.language=en
speech.whisper.threads=4
```

The whisper paths are relative to `backend/nezai`, so start the backend from that folder. Environment variables such as `SPEECH_WHISPER_MODEL` can override the voice settings.

## Documentation

- [Getting started](docs/getting-started.md)
- [Offline voice input](docs/offline-voice-input.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Documentation index](docs/README.md)

## Development checks

```powershell
cd frontend
npm.cmd run build
```

```powershell
cd backend\nezai
.\mvnw.cmd test
```

## Project structure

```text
frontend/       React + Vite + TypeScript UI
backend/nezai/  Spring Boot API and local integrations
docs/           Setup and feature documentation
```
