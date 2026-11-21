import { readFile } from 'node:fs/promises';

/**
 * WebAssembly のモジュールを読み込み、インスタンスを応答する関数
 * @param {URL} url - .wasm ファイルの場所
 * @param {WebAssembly.Imports} [imports] - WebAssembly に渡す関数や変数
 * @returns {Promise<WebAssembly.Instance>} - WebAssembly のインスタンス
 */
export const instantiate = async (url, imports = {}) => {
  const bytes = await readFile(url);
  const { instance } = await WebAssembly.instantiate(bytes, imports);

  return instance;
};

/**
 * 線形メモリから、文字列を取り出す関数
 * @param {WebAssembly.Memory} memory - 線形メモリ
 * @param {number} offset - 文字列の開始位置
 * @param {number} length - 文字列の長さ（バイト数）
 * @returns {string} - 取り出した文字列
 */
export const readString = (memory, offset, length) => {
  const bytes = new Uint8Array(memory.buffer, offset, length);

  return new TextDecoder('utf-8').decode(bytes);
};
