const RESUME_MIME_LABELS: Record<string, string> = {
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/heic": "HEIC",
  "image/heif": "HEIF",
  "image/webp": "WEBP",
};

const RESUME_EXTENSION_LABELS: Record<string, string> = {
  pdf: "PDF",
  doc: "DOC",
  docx: "DOCX",
  jpg: "JPEG",
  jpeg: "JPEG",
  png: "PNG",
  heic: "HEIC",
  heif: "HEIF",
  webp: "WEBP",
};

const EXTENSION_TO_MIME: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  heic: "image/heic",
  heif: "image/heif",
  webp: "image/webp",
};

export const ALLOWED_RESUME_MIME_TYPES = new Set(Object.keys(RESUME_MIME_LABELS));

export const ALLOWED_RESUME_ACCEPT = [
  ...Object.keys(RESUME_EXTENSION_LABELS).map((ext) => `.${ext}`),
  ...Object.keys(RESUME_MIME_LABELS),
].join(",");

export const ALLOWED_RESUME_UPLOAD_MESSAGE = "Upload a PDF, Word document, or photo.";

export function getResumeFileTypeLabel(file: File): string {
  if (file.type && RESUME_MIME_LABELS[file.type]) return RESUME_MIME_LABELS[file.type];
  return getResumeFileTypeFromName(file.name);
}

export function getResumeFileTypeFromName(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return RESUME_EXTENSION_LABELS[ext] ?? (ext.toUpperCase() || "File");
}

export function getResumeContentType(file: File): string {
  if (file.type && ALLOWED_RESUME_MIME_TYPES.has(file.type)) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_TO_MIME[ext] ?? (file.type || "application/octet-stream");
}

export function isAllowedResumeFile(file: File): boolean {
  if (ALLOWED_RESUME_MIME_TYPES.has(file.type)) return true;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return ext in RESUME_EXTENSION_LABELS;
}

export function splitResumeDisplay(fileName: string, fileType: string | null): { name: string; type: string } {
  return {
    name: fileName,
    type: fileType ?? getResumeFileTypeFromName(fileName),
  };
}
