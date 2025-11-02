import { describe, expect, it } from 'vitest';
import packageJson from '../package.json' assert { type: 'json' };

import { VERSION } from './index';

describe('design tokens package version export', () => {
  it('matches package.json version', () => {
    expect(VERSION).toBe(packageJson.version);
  });
});
