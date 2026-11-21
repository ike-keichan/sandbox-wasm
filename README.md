# sandbox-wasm

JavaScript から WebAssembly を呼び出す練習用のプロジェクト。

> 学習の記録として残しているリポジトリです。プログラムは書いた当時のままで、リファクタリングや修正は行っていません。

## 概要

| 項目 | 内容 |
| --- | --- |
| 題材 | WebAssembly のテキスト形式（WAT）と、JavaScript からの呼び出し |
| 時期 | 2024年4月 |
| 言語 | WebAssembly（テキスト形式）、JavaScript |

WebAssembly のモジュールをテキスト形式（`.wat`）で書き、バイナリ（`.wasm`）に変換して、Node.js の JavaScript から読み込む練習である。JavaScript の関数、変数、メモリを WebAssembly に渡す方法と、WebAssembly の関数を JavaScript から呼ぶ方法を試している。

## ディレクトリ構成

| ディレクトリ・ファイル | 内容 |
| --- | --- |
| `src/HelloWorld/index.wat` | JavaScript から受け取ったメモリに `hello world!` を書き込み、JavaScript の関数を呼んで表示させるモジュール |
| `src/HelloWorld/index.wasm` | `index.wat` を変換したバイナリ |
| `src/HelloWorld/index.js` | メモリと表示用の関数を渡して、モジュールを読み込む |
| `src/Add/index.wat` | 2つの整数を足して返す関数 `add` を持つモジュール |
| `src/Add/index.js` | モジュールを読み込み、`add` を呼ぶ |
| `package.json`、`pnpm-lock.yaml` | 依存するパッケージと、そのバージョンの記録 |

`src/Add/` の `index.wasm` は、リポジトリに入れていない。「実行方法」の変換の手順で作る。

## 実行環境

当時使っていた環境のうち、実行に必要なソフトウェアを挙げる。バージョンは、リポジトリに記録が残っている値である。

| ソフトウェア | バージョン | 用途 | 補足 |
| --- | --- | --- | --- |
| macOS | 14 Sonoma | OS | |
| Node.js | 20.11.1 | JavaScript の実行 | `package.json` に記録 |
| pnpm | 8.15.5 | パッケージのインストールとスクリプトの実行 | `package.json` に記録 |
| wat-wasm | 1.0.43 | テキスト形式からバイナリへの変換（`wat2wasm` コマンド） | `pnpm-lock.yaml` に記録 |

## セットアップ

次の手順で、実行に必要なソフトウェアを用意する。当時より新しいバージョンでの動作は確認していないので、動かない場合は「実行環境」の表に近いバージョンを使う。

1. [Node.js](https://nodejs.org/) をインストールする。`node --version` でバージョンが表示されれば使える。
2. [pnpm](https://pnpm.io/ja/installation) をインストールする。`pnpm --version` でバージョンが表示されれば使える。
3. 依存するパッケージをインストールする。`node_modules` はリポジトリに入れていないので、この手順が必要である。

   ```sh
   pnpm install
   ```

## 実行方法

テキスト形式（`.wat`）を、バイナリ（`.wasm`）に変換する。

```sh
pnpm compile
```

JavaScript から読み込んで実行する。

```sh
node src/HelloWorld/index.js
node src/Add/index.js
```

## 備考

JavaScript の側は書きかけで、そのままでは実行できない。モジュールの読み込みが終わるのを待たずに関数を呼んでいること、WebAssembly が公開している関数の名前（`hello_world`）と、JavaScript が呼んでいる名前（`helloWorld`）が違うことが理由である。WebAssembly のテキスト形式の書き方の記録として残している。
