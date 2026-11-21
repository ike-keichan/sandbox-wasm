# sandbox-wasm

WebAssembly（WAT、JavaScript）の技術検証と、プロジェクトのひな形を兼ねたリポジトリ。

WebAssembly をテキスト形式（WAT）で書き、JavaScript（Node.js）から呼び出すときの土台を、すぐ動く状態でまとめています。新しいプロジェクトを始めるときのひな形として使うほか、WebAssembly の書き方を試す場所としても使います。

## Description

- [Branch](#branch)
- [Tool Versions](#tool-versions)
- [Getting Started](#getting-started)
- [Command](#command)
- [Documents](#documents)

---

## Branch

目的の違う内容を、ブランチで分けています。

| ブランチ | 内容 | 使いみち |
| --- | --- | --- |
| [`main`](https://github.com/ike-keichan/sandbox-wasm) | 最小の形。WebAssembly が持つ文字列を、JavaScript で表示する `hello` だけ | 新しいプロジェクトの出発点にします |
| [`example/add`](https://github.com/ike-keichan/sandbox-wasm/tree/example/add) | `main` に、2つの数を足す `add` を足した見本 | 引数と戻り値のある関数の、足し方の手本にします |

`README.md` と、`readme/` の番号つきの文書は、どのブランチでも同じ内容です。`example/` で始まるブランチには、そのブランチの説明（`readme/EXAMPLE_*.md`）が入っています。

---

## Tool Versions

| 役割 | 使っているもの | バージョン |
| --- | --- | --- |
| 実行環境 | Node.js | 26（LTS） |
| パッケージ管理 | pnpm | 12.21 |
| WebAssembly への変換 | WABT（`wabt`） | 1.0.39 |
| コードの検査 | ESLint | 10.15 |
| コードの整形 | Prettier | 3.10 |
| テスト | Node.js の標準の機能（`node:test`） | |

Node.js は、Docker のコンテナの中で動きます。手元に必要なのは、Docker Desktop、make、Git だけです。

正確なバージョンは、[package.json](./package.json)、`pnpm-lock.yaml`、[Dockerfile](./Dockerfile) に記録しています。

---

## Getting Started

環境構築の手順は、[こちら](./readme/01_GETTING_STARTED.md)。

手順を終えると、`make run` で、WebAssembly を呼び出すプログラムを実行できるようになります。

---

## Command

主要なコマンドは、以下のとおりです。それ以外のコマンドの詳細は、[こちら](./readme/02_COMMAND.md)。

| コマンド | 内容 |
| --- | --- |
| `make setup` | 環境を作ります（初回だけ） |
| `make run` | WebAssembly への変換を行ってから、プログラムを実行します |
| `make wasm/build` | `.wat` を `.wasm` に変換します |
| `make js/test` | テストを実行します |
| `make js/check` | コードを検査します |
| `make js/fix` | 検査の指摘のうち、自動で直せるものを直します |

---

## Documents

| 文書 | 内容 |
| --- | --- |
| [Getting Started](./readme/01_GETTING_STARTED.md) | 環境構築の手順。必要なソフトウェアの用意から、動作の確認、うまくいかないときの対処まで |
| [Command](./readme/02_COMMAND.md) | すべてのコマンドの説明 |
| [Architecture](./readme/03_ARCHITECTURE.md) | 全体の流れ、JavaScript と WebAssembly のやりとり、プログラムの分け方、ディレクトリ構成、テストの仕組み |
| [Template](./readme/04_TEMPLATE.md) | ひな形として使う手順。自分のリポジトリの作り方、名前の変え方、機能の足し方 |
| [Development](./readme/05_DEVELOPMENT.md) | このリポジトリ自体を更新するときの決まり。ブランチ、作業の流れ、依存の更新、見本のブランチの保ち方 |
| [CLAUDE.md](./CLAUDE.md) | コードと文書の書き方の細かい決まり。Claude Code に作業を頼むときにも読み込まれます |
