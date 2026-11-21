import { instantiate, readString } from '../shared/wasm.js';

// 線形メモリの中で、文字列を書き込む位置
const START_STRING_INDEX = 100;

/**
 * hello のモジュールを読み込み、JavaScript から呼べる関数を応答する関数
 * @param {(text: string) => void} print - WebAssembly が渡した文字列を受け取る関数
 * @returns {Promise<{ helloWorld: () => void }>} - WebAssembly の関数
 */
export const createHello = async (print) => {
  // WebAssembly と共有する線形メモリ。大きさは1ページ（64KiB）。
  const memory = new WebAssembly.Memory({ initial: 1 });

  const instance = await instantiate(new URL('./hello.wasm', import.meta.url), {
    env: {
      memory,
      start_string_index: START_STRING_INDEX,
      // WebAssembly から呼ばれる関数。線形メモリの指定された位置から文字列を取り出して、print に渡す。
      print_string: (offset, length) => print(readString(memory, offset, length)),
    },
  });

  return { helloWorld: () => instance.exports.hello_world() };
};
