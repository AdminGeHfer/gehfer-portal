export const MAX_MESSAGES = {
  'gpt-4o-mini': 8,
  'gpt-4o': 12,
  'groq-mixtral': 10,
  'groq-llama2': 10,
};

export const truncateMessages = (messages: any[], model: string) => {
  const limit = MAX_MESSAGES[model as keyof typeof MAX_MESSAGES] || 8;
  return messages.slice(-limit);
};