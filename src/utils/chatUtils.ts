export const MAX_MESSAGES = {
  'gpt-4o-mini': 8,
  'gpt-4o': 12,
};

export const truncateMessages = (messages: [], model: string) => {
  const limit = MAX_MESSAGES[model as keyof typeof MAX_MESSAGES] || 8;
  return messages.slice(-limit);
};