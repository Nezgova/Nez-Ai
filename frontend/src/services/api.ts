import type { ChatSettings } from '../types/ChatSettings';
import type { Message } from '../components/Message/Message';

const API_BASE_URL = 'http://localhost:8081';

export interface HealthStatus {
  connected: boolean;
}

export async function checkBackendHealth(): Promise<HealthStatus> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) {
      return { connected: false };
    }
    return { connected: true };
  } catch {
    return { connected: false };
  }
}

export async function sendMessageToAssistant(history: Message[], settings: ChatSettings): Promise<string> {
  const formData = new FormData();
  const conversation = history
    .filter((message) => !message.isTyping)
    .map((message) => ({
      role: message.role,
      content: message.content,
      hasImage: message.role === 'user' && message.attachment?.type === 'image' && message.attachment.file instanceof File,
    }));

  formData.append('history', new Blob([JSON.stringify(conversation)], { type: 'application/json' }));
  formData.append('think', String(settings.think));
  formData.append('stream', String(settings.stream));

  for (const message of history) {
    if (message.role === 'user' && !message.isTyping && message.attachment?.type === 'image' && message.attachment.file instanceof File) {
      formData.append('images', message.attachment.file);
    }
  }

  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to reach Nez AI backend.');
  }

  const data = await response.json();
  return data.reply as string;
}

export async function transcribeAudio(audio: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('audio', audio, 'recording.wav');

  const response = await fetch(`${API_BASE_URL}/api/speech/transcribe`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || data.message || 'Unable to transcribe the recording locally.');
  }

  return data.text as string;
}
