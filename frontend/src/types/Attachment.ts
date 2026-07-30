export interface Attachment {
  type: "image" | "pdf";
  file: File;
  previewUrl?: string;
}