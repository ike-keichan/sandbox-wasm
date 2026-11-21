# Example: add（引数と戻り値のある関数の見本）

`example/add` ブランチの説明です。このブランチは、`main`（最小の形）に、2つの数を足す `add` という機能を足したものです。機能を足すときの、書き方の手本として使います。

リポジトリ全体の説明は [README](../README.md)、各ファイルの役割は [Architecture](./03_ARCHITECTURE.md) を参照してください。

## `hello` との違い

`main` に入っている `hello` と、このブランチで足した `add` は、JavaScript と WebAssembly のやりとりの仕方が違います。

| | `hello` | `add` |
| --- | --- | --- |
| すること | WebAssembly が持つ文字列を、JavaScript で表示する | 2つの数を足して、結果を返す |
| JavaScript から渡すもの | メモリ、書き込む位置、表示用の関数 | 呼び出すときの引数だけ |
| 結果の受け取り方 | WebAssembly が JavaScript の関数を呼ぶ | 関数の戻り値 |
| メモリ | 使う | 使わない |

数値だけをやりとりする関数は、`add` のように、引数と戻り値で済みます。文字列のように、数値で表せないものを扱うときに、`hello` のようなメモリが必要になります。

## 試す

環境構築は、[Getting Started](./01_GETTING_STARTED.md) の手順で行います。`git clone` のあとに、このブランチに切り替えてください。

```zsh
$ git switch example/add
$ make setup
$ make run
```

次のように表示されれば、正常です。

```zsh
docker compose run --rm app pnpm start
$ node scripts/build.js && node src/main.js
built src/add/add.wasm
built src/hello/hello.wasm
2 file(s) built
hello world!
3 + 4 = 7
```

## `main` に足したファイル

| ファイル | 内容 |
| --- | --- |
| `src/add/add.wat` | 2つの整数を足した結果を返す、WebAssembly のモジュール |
| `src/add/index.js` | モジュールを読み込み、`add` という関数として公開します |
| `src/add/index.test.js` | テスト |

## `main` から書き換えたファイル

| ファイル | 書き換えた内容 |
| --- | --- |
| `src/main.js` | `add` を呼び出して、結果を表示するようにしました |

## 書き方の要点

### WebAssembly の側

```wat
(func (export "add") (param $left i32) (param $right i32) (result i32)
  local.get $left
  local.get $right
  i32.add
)
```

- **引数と戻り値の型を書く**：`(param $left i32)` は、`$left` という名前の、32ビットの整数の引数です。`(result i32)` は、32ビットの整数を1つ返す、という意味です。
- **値を積んでから、計算する**：WebAssembly は、値を「スタック」という場所に順に積み、命令がそこから値を取り出して計算します。`local.get` で2つの引数を積み、`i32.add` がその2つを取り出して、足した結果を積みます。
- **最後に積まれている値が、戻り値になる**：`return` のような命令は、要りません。

### JavaScript の側

```javascript
export const createAdd = async () => {
  const instance = await instantiate(new URL('./add.wasm', import.meta.url));

  return { add: (left, right) => instance.exports.add(left, right) };
};
```

- **渡すものがなければ、`instantiate` の2つ目の引数は要らない**：`add.wat` には `import` がないためです。
- **ふつうの関数として公開する**：使う側は、WebAssembly であることを意識せずに、`add(3, 4)` と呼べます。

## 数値の扱いで、気をつけること

WebAssembly の数値は、型ごとに、表せる範囲が決まっています。JavaScript の数値とは、動きが違います。テスト（`src/add/index.test.js`）で、実際の動きを確かめています。

| 呼び方 | 結果 | 理由 |
| --- | --- | --- |
| `add(3, 4)` | `7` | |
| `add(-3, -4)` | `-7` | 負の数も扱えます |
| `add(2147483647, 1)` | `-2147483648` | `i32` で表せる上限（2147483647）を超えると、下限に戻ります |
| `add(-2147483648, -1)` | `2147483647` | 下限（-2147483648）を超えると、上限に戻ります |
| `add(4294967296, 1)` | `1` | 32ビットに収まらない数は、下の32ビットだけが使われます（4294967296 は、0 になります） |
| `add(1.9, 2.9)` | `3` | `i32` は整数なので、渡すときに、小数点以下が切り捨てられます（1 + 2） |
| `add(NaN, 5)` | `5` | 数でないものは、0 として扱われます |

どの場合も、エラーにはなりません。黙って別の値になるので、範囲を超える数を渡す可能性があるときは、JavaScript の側（`index.js`）で、渡す前に確かめます。

大きな数や小数を扱いたい場合は、`i32` の代わりに、`i64`（64ビットの整数）、`f64`（64ビットの小数）を使います。`i64` は、JavaScript の側では、ふつうの数ではなく `BigInt` になります。`add(3n, 4n)` のように、`n` を付けて渡す必要があり、ふつうの数を渡すと `TypeError` になります。
