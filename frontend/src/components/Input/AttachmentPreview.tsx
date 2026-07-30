import React from 'react';
import { motion } from 'framer-motion';
import { FileText, X } from 'lucide-react';
import type { Attachment } from '../../types/Attachment';
import './AttachmentPreview.css';

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemove: () => void;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;

  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;

  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachment,
  onRemove,
}) => {
  return (
    <motion.div
      className="attachment-preview"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
    >
      <div className="attachment-preview-content">
        {attachment.type === 'image' ? (
          <img
            src={attachment.previewUrl}
            alt="Preview"
            className="attachment-preview-image"
          />
        ) : (
          <div className="attachment-preview-pdf">
            <FileText size={34} />
          </div>
        )}

        <div className="attachment-preview-info">
          <span className="attachment-preview-name">
            {attachment.file.name}
          </span>

          <span className="attachment-preview-size">
            {formatFileSize(attachment.file.size)}
          </span>
        </div>

        <button
          type="button"
          className="attachment-preview-remove"
          onClick={onRemove}
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default AttachmentPreview;