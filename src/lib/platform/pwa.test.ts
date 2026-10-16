import { describe, expect, it } from 'vitest';
import { formatBytes } from './pwa';

describe('formatBytes', () => {
  it('formats common sizes', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(250 * 1024 * 1024)).toBe('250 MB');
    expect(formatBytes(3.25 * 1024 ** 3)).toBe('3.3 GB');
  });
});
