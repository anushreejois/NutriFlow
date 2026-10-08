export const GROQ_CHAT_MODELS = ['qwen/qwen3.8-27b', 'allam-2-7b'] as const;

export const withModelFallback = async <T>(
  models: readonly string[],
  request: (model: string) => Promise<T | null | undefined>,
  onError?: (model: string, error: unknown) => void,
): Promise<T | undefined> => {
  if (models.length === 0) {
    throw new Error('At least one model must be configured.');
  }

  let lastError: unknown;
  let requestFailed = false;

  for (const model of models) {
    try {
      const result = await request(model);
      if (result !== undefined && result !== null && result !== '') {
        return result;
      }
    } catch (error) {
      lastError = error;
      requestFailed = true;
      onError?.(model, error);
    }
  }

  if (requestFailed) {
    throw lastError;
  }
};
