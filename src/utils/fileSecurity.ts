const DANGEROUS_EXTENSIONS = new Set([
  "exe",
  "dll",
  "bat",
  "cmd",
  "ps1",
  "sh",
  "php",
  "jsp",
  "asp",
  "aspx",
  "js",
  "msi",
  "com",
  "scr",
  "jar",
]);

export function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  if (parts.length < 2) return "";
  return parts[parts.length - 1].toLowerCase();
}

export function validateSafeFilename(filename: string): boolean {
  return !filename.includes("..") && !/[\\/]/.test(filename);
}

export function validateFileSecurity(
  file: File,
  options: {
    maxSizeBytes: number;
    allowedMimeTypes: string[];
    allowedExtensions: string[];
  },
): { valid: boolean; error?: string } {
  if (!file) return { valid: false, error: "Arquivo inválido" };
  if (!validateSafeFilename(file.name)) {
    return { valid: false, error: "Nome de arquivo inválido" };
  }

  const extension = getFileExtension(file.name);
  if (DANGEROUS_EXTENSIONS.has(extension)) {
    return { valid: false, error: "Tipo de arquivo bloqueado por segurança" };
  }

  if (!options.allowedExtensions.includes(extension)) {
    return { valid: false, error: "Extensão de arquivo não permitida" };
  }

  if (!options.allowedMimeTypes.includes(file.type)) {
    return { valid: false, error: "MIME type não permitido" };
  }

  if (file.size <= 0 || file.size > options.maxSizeBytes) {
    return { valid: false, error: "Tamanho de arquivo inválido" };
  }

  return { valid: true };
}
