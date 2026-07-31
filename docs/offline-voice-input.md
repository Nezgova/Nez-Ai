# Offline voice input

Nez AI records in the browser, converts the recording to a 16 kHz mono WAV locally, and sends it only to the local Spring Boot server. The server runs the local `whisper.cpp` executable and returns text. No cloud speech service, API key, or automatic message sending is used.

## One-time whisper.cpp setup (Windows)

1. Download the `whisper-bin-x64.zip` asset from the [official whisper.cpp releases](https://github.com/ggml-org/whisper.cpp/releases/latest).
2. Extract it into this project so this executable exists:

   ```text
   backend\nezai\tools\whisper\Release\whisper-cli.exe
   ```

3. Download `ggml-base.en.bin` from the [official whisper.cpp model repository](https://huggingface.co/ggerganov/whisper.cpp) while online once, then copy it to:

   ```text
   backend\nezai\models\ggml-base.en.bin
   ```

   The running feature is offline; the download is only required to obtain the model file.

4. The default configuration already uses these project-relative paths:

   ```properties
   speech.whisper.executable=tools/whisper/Release/whisper-cli.exe
   speech.whisper.model=models/ggml-base.en.bin
   speech.whisper.language=en
   speech.whisper.threads=4
   ```

   You can use absolute paths instead if you keep whisper.cpp or models outside this project.

5. Restart the Spring Boot backend. The microphone button can then record, transcribe locally, and insert editable text into the composer.

## Switching models

Download another local whisper.cpp-compatible model, place it under `backend/nezai/models/`, then change only `speech.whisper.model`. For example:

```properties
speech.whisper.model=models/ggml-small.en.bin
```

Use an `.en` model with `speech.whisper.language=en`; use a multilingual model and change `speech.whisper.language` for other languages. You can also override every setting at runtime with `SPEECH_WHISPER_EXECUTABLE`, `SPEECH_WHISPER_MODEL`, `SPEECH_WHISPER_LANGUAGE`, and `SPEECH_WHISPER_THREADS` environment variables.
