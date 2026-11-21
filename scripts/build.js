// src/ の中の .wat（WebAssembly のテキスト形式）を、.wasm（バイナリ）に変換するスクリプト。
// .wasm は、変換元の .wat と同じ場所に、同じ名前で作る。
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import wabt from 'wabt';

const sourceDirectory = fileURLToPath(new URL('../src/', import.meta.url));

/**
 * ディレクトリの中の .wat ファイルを、下の階層も含めてすべて探す関数
 * @param {string} directory - 探すディレクトリ
 * @returns {Promise<string[]>} - 見つかった .wat ファイルのパス
 */
const findWatFiles = async (directory) => {
  const entries = await readdir(directory, { recursive: true, withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.wat'))
    .map((entry) => `${entry.parentPath}/${entry.name}`)
    .sort();
};

const { parseWat } = await wabt();
const watFiles = await findWatFiles(sourceDirectory);

for (const watFile of watFiles) {
  const wasmFile = watFile.replace(/\.wat$/, '.wasm');
  // 文字列ではなく、バイト列のまま渡す。文字列で渡すと、日本語のコメントがある .wat を正しく読めない。
  const module = parseWat(watFile, await readFile(watFile));

  // 変換の前に、モジュールが正しいかを検査する。正しくなければ、ここでエラーになる。
  module.validate();
  await writeFile(wasmFile, module.toBinary({}).buffer);
  module.destroy();

  console.log(`built ${relative(process.cwd(), wasmFile)}`);
}

console.log(`${watFiles.length} file(s) built`);
