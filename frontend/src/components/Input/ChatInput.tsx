import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Mic, Send } from 'lucide-react';
import AttachmentPreview from './AttachmentPreview';
import './ChatInput.css';
import type { Attachment } from '../../types/Attachment';
import { transcribeAudio } from '../../services/api';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  attachment: Attachment | null;
  setAttachment: React.Dispatch<React.SetStateAction<Attachment | null>>;
}

type VoiceState = 'idle' | 'recording' | 'transcribing';

const formatRecordingTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remainder = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
};

const audioBufferToWav = (audioBuffer: AudioBuffer) => {
  const targetSampleRate = 16_000;
  const source = audioBuffer.getChannelData(0);
  const sampleCount = Math.ceil(source.length * targetSampleRate / audioBuffer.sampleRate);
  const samples = new Float32Array(sampleCount);

  for (let index = 0; index < sampleCount; index += 1) {
    const sourceIndex = index * audioBuffer.sampleRate / targetSampleRate;
    const before = Math.floor(sourceIndex);
    const after = Math.min(before + 1, source.length - 1);
    const fraction = sourceIndex - before;
    samples[index] = source[before] * (1 - fraction) + source[after] * fraction;
  }

  const wav = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(wav);
  const writeText = (offset: number, text: string) => {
    for (let index = 0; index < text.length; index += 1) {
      view.setUint8(offset + index, text.charCodeAt(index));
    }
  };

  writeText(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeText(8, 'WAVE');
  writeText(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, targetSampleRate, true);
  view.setUint32(28, targetSampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeText(36, 'data');
  view.setUint32(40, samples.length * 2, true);

  samples.forEach((sample, index) => {
    const clamped = Math.max(-1, Math.min(1, sample));
    view.setInt16(44 + index * 2, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
  });

  return new Blob([wav], { type: 'audio/wav' });
};

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, attachment, setAttachment, }) => {
  const [focused, setFocused] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingTimerRef = useRef<number | null>(null);

  const clearRecordingTimer = () => {
    if (recordingTimerRef.current !== null) {
      window.clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const releaseMicrophone = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  useEffect(() => () => {
    clearRecordingTimer();
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop();
    }
    releaseMicrophone();
  }, []);

  const handleSend = () => {
    if (value.trim().length === 0 && !attachment) return;
    onSend();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const openImagePicker = () => imageInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    setAttachment({
      type: 'image',
      file,
      previewUrl: URL.createObjectURL(file),
    });
    e.target.value = '';
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop();
    }
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setVoiceError('Microphone recording is not supported in this browser.');
      return;
    }

    setVoiceError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const chunks: BlobPart[] = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        clearRecordingTimer();
        releaseMicrophone();
        setVoiceState('transcribing');

        try {
          const recordedAudio = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
          const audioContext = new AudioContext();
          const decodedAudio = await audioContext.decodeAudioData(await recordedAudio.arrayBuffer());
          const wavAudio = audioBufferToWav(decodedAudio);
          await audioContext.close();

          const transcription = (await transcribeAudio(wavAudio)).trim();
          if (!transcription) {
            throw new Error('No speech was detected in that recording.');
          }
          onChange(value.trim() ? `${value.trimEnd()} ${transcription}` : transcription);
        } catch (error) {
          setVoiceError(error instanceof Error ? error.message : 'Unable to transcribe the recording locally.');
        } finally {
          setVoiceState('idle');
          recorderRef.current = null;
        }
      };

      recorder.start();
      setRecordingSeconds(0);
      setVoiceState('recording');
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((seconds) => seconds + 1);
      }, 1_000);
    } catch (error) {
      releaseMicrophone();
      setVoiceState('idle');
      setVoiceError(error instanceof Error && error.name === 'NotAllowedError'
        ? 'Microphone access was denied. Allow it in your browser settings and try again.'
        : 'Unable to access the microphone.');
    }
  };

  const handleMicrophoneClick = () => {
    if (voiceState === 'recording') {
      stopRecording();
      return;
    }
    if (voiceState === 'idle') {
      void startRecording();
    }
  };

  return (
    <div className="chat-input-wrapper">
      {attachment && (
        <AttachmentPreview
          attachment={attachment}
          onRemove={handleRemoveAttachment}
        />
      )}

      <input
        ref={imageInputRef}
        className="chat-input-file-input"
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleImageChange}
      />

      <motion.div
        className={`chat-input-bar ${focused ? 'chat-input-bar--focused' : ''}`}
        animate={{
          boxShadow: focused
            ? '0 0 0 1px rgba(196, 30, 58, 0.5), 0 8px 30px rgba(196, 30, 58, 0.12)'
            : '0 2px 10px rgba(0,0,0,0.3)',
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.button
          className="chat-input-icon-btn"
          type="button"

          onClick={openImagePicker}
        >
          <ImageIcon size={17} />
        </motion.button>

        <input
          className="chat-input-field"
          type="text"
          placeholder="Message Nez AI..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
        />

        <motion.button
          className="chat-input-send-btn"
          type="button"
          title="Send message"
          onClick={handleSend}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
        >
          <Send size={16} />
        </motion.button>

        <motion.button
          className={`chat-input-icon-btn chat-input-mic-btn ${voiceState === 'recording' ? 'chat-input-mic-btn--recording' : ''}`}
          type="button"
          title={voiceState === 'recording' ? 'Stop recording' : 'Start voice input'}
          aria-label={voiceState === 'recording' ? 'Stop recording' : 'Start voice input'}
          onClick={handleMicrophoneClick}
          disabled={voiceState === 'transcribing'}
          whileTap={voiceState === 'transcribing' ? undefined : { scale: 0.92 }}
        >
          <Mic size={17} />
        </motion.button>
      </motion.div>
      <p className={`chat-input-hint ${voiceState !== 'idle' ? 'chat-input-hint--voice' : ''}`} role={voiceError ? 'alert' : 'status'}>
        {voiceState === 'recording' && <>Listening... <span>{formatRecordingTime(recordingSeconds)}</span></>}
        {voiceState === 'transcribing' && 'Transcribing...'}
        {voiceState === 'idle' && (voiceError || 'Paste an image or drag it here to attach. Send when ready.')}
      </p>
    </div>
  );
};

export default ChatInput;
