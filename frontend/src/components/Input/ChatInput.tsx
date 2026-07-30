import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Paperclip, Mic, Image as ImageIcon, Send } from 'lucide-react';
import AttachmentPreview from './AttachmentPreview';
import './ChatInput.css';
import type { Attachment } from '../../types/Attachment';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  attachment: Attachment | null;
  setAttachment: React.Dispatch<React.SetStateAction<Attachment | null>>;
}

const ChatInput: React.FC<ChatInputProps> = ({value,onChange,onSend,attachment,setAttachment,}) => {
  const [focused, setFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (attachment?.type === 'image' && attachment.previewUrl) {
        URL.revokeObjectURL(attachment.previewUrl);
      }
    };
  }, [attachment]);

  const handleSend = () => {
    if (value.trim().length === 0) return;
    onSend();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const openFilePicker = () => fileInputRef.current?.click();
  const openImagePicker = () => imageInputRef.current?.click();

  const handleAttachmentSelect = (file: File | null, type: Attachment['type']) => {
    if (!file) return;

    const attachmentData: Attachment = {
      type,
      file,
      previewUrl: type === 'image' ? URL.createObjectURL(file) : undefined,
    };

    setAttachment(attachmentData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleAttachmentSelect(file, 'pdf');
    e.target.value = '';
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleAttachmentSelect(file, 'image');
    e.target.value = '';
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
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
        ref={fileInputRef}
        className="chat-input-file-input"
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
      />

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
            ? '0 0 0 1px rgba(212,175,55,0.5), 0 8px 30px rgba(212,175,55,0.12)'
            : '0 2px 10px rgba(0,0,0,0.3)',
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.button
          className="chat-input-icon-btn"
          type="button"
          title="Attach file"
          whileHover={{ scale: 1.08, rotate: -4 }}
          whileTap={{ scale: 0.94 }}
          onClick={openFilePicker}
        >
          <Paperclip size={17} />
        </motion.button>

        <motion.button
          className="chat-input-icon-btn"
          type="button"
          title="Attach image"
          whileHover={{ scale: 1.08, rotate: 4 }}
          whileTap={{ scale: 0.94 }}
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
          className="chat-input-icon-btn"
          type="button"
          title="Voice input"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
        >
          <Mic size={17} />
        </motion.button>

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
      </motion.div>
      <p className="chat-input-hint">Nez AI runs fully local. Nothing leaves your device.</p>
    </div>
  );
};

export default ChatInput;