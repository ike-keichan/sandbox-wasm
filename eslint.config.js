import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  js.configs.recommended,
  { languageOptions: { globals: globals.node } },
  // 書式は Prettier に任せるので、書式に関する ESLint の規則を無効にする。
  prettier,
]);
