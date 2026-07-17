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
  } catch (error) {
    return { connected: false };
  }
}

export async function sendMessageToAssistant(content: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error('Failed to reach Nez AI backend.');
  }

  const data = await response.json();
  return data.reply as string;
}