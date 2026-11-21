import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createHello } from './index.js';

test('helloWorld は、WebAssembly が持つ文字列を JavaScript に渡す', async () => {
  const printed = [];
  const { helloWorld } = await createHello((text) => printed.push(text));

  helloWorld();

  assert.deepEqual(printed, ['hello world!']);
});

test('helloWorld は、呼ぶたびに文字列を渡す', async () => {
  const printed = [];
  const { helloWorld } = await createHello((text) => printed.push(text));

  helloWorld();
  helloWorld();

  assert.deepEqual(printed, ['hello world!', 'hello world!']);
});
