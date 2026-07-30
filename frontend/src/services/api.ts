import type { Attachment } from '../types/Attachment';

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

export async function sendMessageToAssistant(message: string, attachment: Attachment | null): Promise<string> {
  const formData = new FormData();
  formData.append('message', message);

  if (attachment) {
    if (attachment.type === 'image') {
      formData.append('image', attachment.file);
    }
    if (attachment.type === 'pdf') {
      formData.append('pdf', attachment.file);
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