export type MessageRole = 'user' | 'assistant';

export interface MessageAttachmentData {
  type: 'image';
  previewUrl: string;
  fileName: string;
  size: number;
  file?: File;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp?: string;
  attachment?: MessageAttachmentData;
  isTyping?: boolean;
}
