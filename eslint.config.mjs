import next from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const config = [
  ...next,
  ...nextTs,
  {
    ignores: ['out/**', '.next/**', 'public/vendor/**', 'public/sw.js', 'node_modules/**', 'test-results/**', 'playwright-report/**', 'next-env.d.ts'],
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@next/next/no-img-element': 'off',
      // Effects legitimately sync browser-only state (window, storage, GPU) into React.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];
export default config;
