# Getting started

## Prerequisites

Install Java 21, Node.js 20 or later, Git, and Ollama. The frontend uses npm; the backend includes a Maven wrapper.

## Install dependencies

```powershell
git clone <your-repository-url> Nez-Ai
cd Nez-Ai\frontend
npm.cmd install
```

Install Ollama from [ollama.com/download](https://ollama.com/download), then download the default model:

```powershell
ollama pull qwen3.5:4b
ollama list
```

The first model pull needs internet access. After it has completed, Ollama serves the model locally.

## Run Nez AI

Open two terminals from the repository root.

**Terminal 1 — backend**

```powershell
cd backend\nezai
.\mvnw.cmd spring-boot:run
```

**Terminal 2 — frontend**

```powershell
cd frontend
npm.cmd run dev
```

Open `http://localhost:5173`. A healthy backend is available at `http://localhost:8081`.

## Verify the local model

```powershell
ollama list
```

The output must include `qwen3.5:4b`. If it does not, run `ollama pull qwen3.5:4b` again.

## Optional voice setup

Follow [Offline voice input](offline-voice-input.md) to add whisper.cpp and the `base.en` speech model. Voice input is optional; regular chat works with only Ollama and Qwen installed.
