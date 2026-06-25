const RESUME_MIME_LABELS: Record<string, string> = {
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
};

const RESUME_EXTENSION_LABELS: Record<string, string> = {
  pdf: "PDF",
  doc: "DOC",
  docx: "DOCX",
};

export const ALLOWED_RESUME_MIME_TYPES = new Set(Object.keys(RESUME_MIME_LABELS));

export function getResumeFileTypeLabel(file: File): string {
  if (file.type && RESUME_MIME_LABELS[file.type]) return RESUME_MIME_LABELS[file.type];
  return getResumeFileTypeFromName(file.name);
}

export function getResumeFileTypeFromName(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return RESUME_EXTENSION_LABELS[ext] ?? (ext.toUpperCase() || "File");
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
