// src/ の中の .wat（WebAssembly のテキスト形式）を、.wasm（バイナリ）に変換するスクリプト。
// .wasm は、変換元の .wat と同じ場所に、同じ名前で作る。
import { readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import wabt from 'wabt';

const sourceDirectory = fileURLToPath(new URL('../src', import.meta.url));

/**
 * ディレクトリの中から、指定した拡張子のファイルを、下の階層も含めてすべて探す関数
 * @param {string} directory - 探すディレクトリ
 * @param {string} extension - 拡張子（例: '.wat'）
 * @returns {Promise<string[]>} - 見つかったファイルのパス
 */
const findFiles = async (directory, extension) => {
  const entries = await readdir(directory, { recursive: true, withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => join(entry.parentPath, entry.name))
    .sort();
};

/**
 * 表示用に、いまのディレクトリからの相対パスに変える関数
 * @param {string} file - ファイルのパス
 * @returns {string} - 相対パス
 */
const toDisplayPath = (file) => relative(process.cwd(), file);

const watFiles = await findFiles(sourceDirectory, '.wat');
const wasmFiles = await findFiles(sourceDirectory, '.wasm');

// 変換元の .wat がなくなった .wasm を消す。
// 残しておくと、.wat を消したり名前を変えたりしたあとも、古い .wasm で動いてしまう。
for (const wasmFile of wasmFiles) {
  if (!watFiles.includes(wasmFile.replace(/\.wasm$/, '.wat'))) {
    await rm(wasmFile);
    console.log(`removed ${toDisplayPath(wasmFile)}`);
  }
}

const { parseWat } = await wabt();

for (const watFile of watFiles) {
  const wasmFile = watFile.replace(/\.wat$/, '.wasm');

  // 文字列ではなく、バイト列のまま渡す。文字列で渡すと、日本語のコメントがある .wat を正しく読めない。
  // 1つ目の引数は、エラーの表示に使われる名前。
  let module;

  try {
    module = parseWat(toDisplayPath(watFile), await readFile(watFile));
    // 変換の前に、モジュールが正しいかを検査する。正しくなければ、ここでエラーになる。
    module.validate();
    await writeFile(wasmFile, module.toBinary({}).buffer);
  } catch (error) {
    // .wat の書き間違いは、ここに来る。エラーの内容（ファイル名、行番号、理由）だけを表示して、失敗で終わる。
    // そのまま投げると、変換のライブラリの内部のコードが大量に表示されて、内容が読めない。
    console.error(error.message);
    process.exit(1);
  } finally {
    module?.destroy();
  }

  console.log(`built ${toDisplayPath(wasmFile)}`);
}

console.log(`${watFiles.length} file(s) built`);
