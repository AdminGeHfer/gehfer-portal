export function validateContent(content: string): { isValid: boolean; error?: string } {
  if (!content) {
    return { isValid: false, error: 'Content is empty' };
  }

  if (content.includes('\u0000')) {
    return { isValid: false, error: 'Content contains null characters' };
  }

  // Validate UTF-8
  try {
    new TextEncoder().encode(content);
  } catch (e) {
    return { isValid: false, error: 'Invalid UTF-8 encoding' };
  }

  return { isValid: true };
}