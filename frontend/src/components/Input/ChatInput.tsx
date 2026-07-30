import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Send } from 'lucide-react';
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

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, attachment, setAttachment, }) => {
  const [focused, setFocused] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

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
            ? '0 0 0 1px rgba(212,175,55,0.5), 0 8px 30px rgba(212,175,55,0.12)'
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
      </motion.div>
      <p className="chat-input-hint">Paste an image or drag it here to attach. Send when ready.</p>
    </div>
  );
};

export default ChatInput;