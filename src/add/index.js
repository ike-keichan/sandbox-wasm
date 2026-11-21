import { instantiate } from '../shared/wasm.js';

/**
 * add のモジュールを読み込み、JavaScript から呼べる関数を応答する関数
 * @returns {Promise<{ add: (left: number, right: number) => number }>} - WebAssembly の関数
 */
export const createAdd = async () => {
  const instance = await instantiate(new URL('./add.wasm', import.meta.url));

  return { add: (left, right) => instance.exports.add(left, right) };
};
