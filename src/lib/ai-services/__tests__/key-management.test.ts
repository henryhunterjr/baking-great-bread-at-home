import { checkAPIKeyStatus, configureAIKey, getOpenAIApiKey } from '../key-management';

jest.mock('@/utils/logger', () => ({ logInfo: jest.fn(), logError: jest.fn() }));

describe('shared API-key storage', () => {
  beforeEach(() => {
    const values = new Map<string, string>();
    Object.defineProperty(globalThis, 'window', { configurable: true, value: {} });
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
        removeItem: (key: string) => values.delete(key),
      },
    });
  });

  test('returns an awaited status when no key is saved', async () => {
    expect(await checkAPIKeyStatus()).toEqual({ configured: false });
  });

  test('clears the same key that was configured', async () => {
    const placeholder = `sk-${'test'.repeat(6)}`;
    configureAIKey(placeholder);
    expect(getOpenAIApiKey()).toBe(placeholder);
    expect((await checkAPIKeyStatus()).configured).toBe(true);
    configureAIKey('');
    expect(getOpenAIApiKey()).toBeNull();
    expect(await checkAPIKeyStatus()).toEqual({ configured: false });
  });
});