# Template（ひな形として使う）

このリポジトリをもとに、新しいプロジェクトを始める手順です。

- [1. 自分のリポジトリを作る](#1-自分のリポジトリを作る)
- [2. 手元に持ってきて、動くことを確かめる](#2-手元に持ってきて動くことを確かめる)
- [3. 名前を変える](#3-名前を変える)
- [4. 機能を足す](#4-機能を足す)
- [5. 不要なものを消す](#5-不要なものを消す)

---

## 1. 自分のリポジトリを作る

1. GitHub で、[このリポジトリのページ](https://github.com/ike-keichan/sandbox-wasm)を開きます。
2. 右上の「Use this template」を押し、「Create a new repository」を選びます。
3. リポジトリの名前と、公開範囲（Public か Private）を決めます。
4. どのブランチから始めるかで、次のどちらかを選びます。

   | 始めたい内容 | 「Include all branches」 | 作ったあとに使うブランチ |
   | --- | --- | --- |
   | 最小の形（`hello` だけ） | チェックしない | `main` |
   | 引数と戻り値のある関数の見本つき | チェックする | `example/add` |

   迷ったら、最小の形で始めてください。見本は、このリポジトリの `example/add` ブランチを、あとからいつでも見られます。

5. 「Create repository」を押します。

「Use this template」で作ったリポジトリは、このリポジトリの履歴を引き継ぎません。最初のコミットが1つだけある状態から始まります。

---

## 2. 手元に持ってきて、動くことを確かめる

名前を変える前に、まず、そのままで動くことを確かめます。

[Getting Started](./01_GETTING_STARTED.md) の手順を、「2. リポジトリを手元に持ってくる」から進めてください。`git clone` の URL は、いま作った自分のリポジトリのものを使います。

`make run` で `hello world!` と表示されたら、次へ進みます。

---

## 3. 名前を変える

`sandbox-wasm` という名前を、自分のプロジェクトの名前に変えます。

| ファイル | 変える場所 | いまの値 |
| --- | --- | --- |
| `package.json` | `name` | `sandbox-wasm` |
| `package.json` | `description` | `JavaScript から WebAssembly を呼び出すプロジェクトのひな形` |
| `README.md`、`readme/` | 題名、説明、URL | |

コンテナの名前は、フォルダの名前から自動で付きます。手で変える必要はありません。

---

## 4. 機能を足す

`add`（足し算）という機能を足す場合を例に、書く順番を説明します。完成した形は、[`example/add` ブランチ](https://github.com/ike-keichan/sandbox-wasm/tree/example/add)にあります。各ファイルの役割は、[Architecture](./03_ARCHITECTURE.md) を参照してください。

| 順番 | 書くファイル | 書くこと |
| --- | --- | --- |
| 1 | `src/add/add.wat` | WebAssembly のモジュール |
| 2 | `src/add/index.js` | モジュールを読み込み、JavaScript から呼べる関数にして公開する |
| 3 | `src/add/index.test.js` | テスト |
| 4 | `src/main.js` | 2 で作った関数を呼び出す |

書き終えたら、確かめます。

```zsh
$ make js/fix
$ make js/check
$ make js/test
$ make run
```

`.wat` から `.wasm` への変換は、`make js/test` と `make run` が自動で行います。`src/` の中の `.wat` は、すべて変換されるので、足したファイルを登録する必要はありません。

---

## 5. 不要なものを消す

自分の機能ができたら、見本の `hello` は消してかまいません。

| 消すもの | 場所 |
| --- | --- |
| `hello` のプログラムとテスト | `src/hello/` |
| `hello` の呼び出し | `src/main.js` |

`src/shared/wasm.js` の `readString`（メモリから文字列を取り出す関数）は、`hello` だけが使っています。文字列を扱わないなら、消してかまいません。

`readme/` の文書も、自分のプロジェクトに合わせて書き換えてください。
