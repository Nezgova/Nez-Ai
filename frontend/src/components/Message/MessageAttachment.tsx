import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './MessageAttachment.css';
import type { MessageAttachmentData } from './Message';

interface MessageAttachmentProps {
  attachment: MessageAttachmentData;
}

const MessageAttachment: React.FC<MessageAttachmentProps> = ({ attachment }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        className="message-attachment"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setIsOpen(true)}
      >
        <img
          src={attachment.previewUrl}
          alt={attachment.fileName}
          className="message-attachment-image"
          loading="lazy"
        />
        <div className="message-attachment-meta">
          <span className="message-attachment-name">{attachment.fileName}</span>
          <span className="message-attachment-size">{(attachment.size / 1024).toFixed(1)} KB</span>
        </div>
      </motion.div>

      {isOpen && (
        <div className="message-attachment-overlay" onClick={() => setIsOpen(false)}>
          <img
            className="message-attachment-full"
            src={attachment.previewUrl}
            alt={attachment.fileName}
          />
        </div>
      )}
    </>
  );
};

export default MessageAttachment;
