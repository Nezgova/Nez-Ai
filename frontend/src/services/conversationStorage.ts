import type { Conversation } from '../types/Conversation';
import type { Message } from '../components/Message/Message';

const STORAGE_KEY = 'nezai.conversations';

const isValidConversation = (value: unknown): value is Conversation => {
  if (!value || typeof value !== 'object') return false;
  const conversation = value as Conversation;
  return typeof conversation.id === 'string'
    && typeof conversation.title === 'string'
    && typeof conversation.createdAt === 'string'
    && typeof conversation.updatedAt === 'string'
    && Array.isArray(conversation.messages);
};

export const createConversation = (): Conversation => {
  const now = new Date().toISOString();
  return { id: crypto.randomUUID(), title: 'New chat', createdAt: now, updatedAt: now, messages: [] };
};

export const loadConversations = (): Conversation[] => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const conversations = JSON.parse(stored) as unknown[];
    return conversations.filter(isValidConversation).map((conversation) => ({
      ...conversation,
      messages: conversation.messages.filter((message) => !message.isTyping),
    }));
  } catch {
    return [];
  }
};

export const saveConversations = (conversations: Conversation[]) => {
  const persistentConversations = conversations.map((conversation) => ({
    ...conversation,
    messages: conversation.messages
      .filter((message) => !message.isTyping)
      .map(({ attachment, ...message }) => ({
        ...message,
        attachment: attachment ? {
          type: attachment.type,
          previewUrl: attachment.dataUrl ?? attachment.previewUrl,
          dataUrl: attachment.dataUrl,
          fileName: attachment.fileName,
          size: attachment.size,
        } : undefined,
      })),
  }));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistentConversations));
};

export const titleFromMessage = (content: string) => {
  const normalized = content.trim().replace(/\s+/g, ' ');
  return normalized.length > 40 ? `${normalized.slice(0, 39)}…` : normalized || 'Image attached';
};

export const fileToDataUrl = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(file);
});

export const dataUrlToFile = (dataUrl: string, name: string, type = 'image/png') => {
  const [metadata, encoded] = dataUrl.split(',');
  const mimeType = metadata.match(/data:(.*?)(;|$)/)?.[1] || type;
  const binary = atob(encoded || '');
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new File([bytes], name, { type: mimeType });
};

export const restoreMessageFiles = (messages: Message[]): Message[] => messages.map((message) => {
  if (!message.attachment?.dataUrl || message.attachment.file) return message;
  try {
    return {
      ...message,
      attachment: {
        ...message.attachment,
        previewUrl: message.attachment.dataUrl,
        file: dataUrlToFile(message.attachment.dataUrl, message.attachment.fileName),
      },
    };
  } catch {
    return message;
  }
});
