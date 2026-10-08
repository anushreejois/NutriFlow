import assert from 'node:assert/strict';
import { test } from 'node:test';
import { GROQ_CHAT_MODELS, withModelFallback } from '../src/services/modelFallback';

test('configures Qwen as primary and ALLaM as fallback', () => {
  assert.deepEqual(GROQ_CHAT_MODELS, ['qwen/qwen3.8-27b', 'allam-2-7b']);
});

test('returns the primary model result without calling the fallback', async () => {
  const attemptedModels: string[] = [];

  const result = await withModelFallback(GROQ_CHAT_MODELS, async (model) => {
    attemptedModels.push(model);
    return 'plan response';
  });

  assert.equal(result, 'plan response');
  assert.deepEqual(attemptedModels, ['qwen/qwen3.8-27b']);
});

test('uses the fallback when the primary model request fails', async () => {
  const attemptedModels: string[] = [];
  const errors: Array<{ model: string; error: unknown }> = [];

  const result = await withModelFallback(
    GROQ_CHAT_MODELS,
    async (model) => {
      attemptedModels.push(model);
      if (model === GROQ_CHAT_MODELS[0]) {
        throw new Error('primary unavailable');
      }
      return 'fallback response';
    },
    (model, error) => errors.push({ model, error }),
  );

  assert.equal(result, 'fallback response');
  assert.deepEqual(attemptedModels, [...GROQ_CHAT_MODELS]);
  assert.equal(errors.length, 1);
  assert.equal(errors[0].model, GROQ_CHAT_MODELS[0]);
});

test('tries the fallback when a model returns an empty response', async () => {
  const attemptedModels: string[] = [];

  const result = await withModelFallback(GROQ_CHAT_MODELS, async (model) => {
    attemptedModels.push(model);
    return model === GROQ_CHAT_MODELS[0] ? undefined : 'fallback response';
  });

  assert.equal(result, 'fallback response');
  assert.deepEqual(attemptedModels, [...GROQ_CHAT_MODELS]);
});

test('throws the final request error when every model fails', async () => {
  const lastError = new Error('fallback unavailable');

  await assert.rejects(
    withModelFallback(GROQ_CHAT_MODELS, async (model) => {
      throw model === GROQ_CHAT_MODELS[0]
        ? new Error('primary unavailable')
        : lastError;
    }),
    (error) => error === lastError,
  );
});

test('rejects an empty model list', async () => {
  await assert.rejects(
    withModelFallback([], async () => 'unused'),
    /At least one model must be configured/,
  );
});
