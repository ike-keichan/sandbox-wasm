import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createAdd } from './index.js';

test('add は、2つの数を足した結果を返す', async () => {
  const { add } = await createAdd();

  assert.equal(add(3, 4), 7);
});

test('add は、0 と負の数も足せる', async () => {
  const { add } = await createAdd();

  assert.equal(add(0, 0), 0);
  assert.equal(add(-3, 1), -2);
  assert.equal(add(-3, -4), -7);
});

test('add は、32ビットの整数の上限を超えると、下限に戻る', async () => {
  const { add } = await createAdd();

  // i32 型で表せるのは、-2147483648 から 2147483647 まで。
  assert.equal(add(2147483647, 1), -2147483648);
});

test('add は、小数を渡すと、小数点以下を切り捨ててから足す', async () => {
  const { add } = await createAdd();

  assert.equal(add(1.9, 2.9), 3);
});
