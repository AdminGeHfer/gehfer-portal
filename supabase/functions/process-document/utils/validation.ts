export function validateContent(content: string): { isValid: boolean; error?: string } {
  if (!content) {
    return { isValid: false, error: 'Content is empty' };
  }

  if (content.length > 1000000) {
    return { isValid: false, error: 'Content exceeds maximum length of 1MB' };
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

  // Check for minimum content length
  if (content.trim().length < 10) {
    return { isValid: false, error: 'Content is too short (minimum 10 characters)' };
  }

  return { isValid: true };
}