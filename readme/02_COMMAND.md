# Command（コマンド）

よく使うコマンドは、[Makefile](../Makefile) にまとめています。`make <名前>` の形で実行します。

- [1. 環境の操作](#1-環境の操作)
- [2. 変換と実行](#2-変換と実行)
- [3. テストとコードの検査](#3-テストとコードの検査)
- [4. パッケージの操作](#4-パッケージの操作)
- [5. コンテナの中に入る](#5-コンテナの中に入る)

※ コマンドは、このリポジトリのフォルダの直下で実行してください。

※ どのコマンドも、実行のたびにコンテナを起動して、終わると止めます。あらかじめ起動しておく操作は、要りません。

---

## 1. 環境の操作

| コマンド | 内容 |
| --- | --- |
| `make setup` | 環境を作ります（ビルド、パッケージのインストール、WebAssembly への変換）。初回だけ使います |
| `make build` | コンテナをビルドし直します。`Dockerfile` を変えたときに使います |
| `make down` | コンテナと、インストールしたパッケージを削除します |

---

## 2. 変換と実行

| コマンド | 内容 |
| --- | --- |
| `make run` | WebAssembly への変換を行ってから、プログラム（`src/main.js`）を実行します |
| `make wasm/build` | `src/` の中の `.wat` を、すべて `.wasm` に変換します。変換元の `.wat` がなくなった `.wasm` は、消します |

`.wasm` は、変換元の `.wat` と同じ場所に、同じ名前で作られます（`src/hello/hello.wat` から `src/hello/hello.wasm`）。

`.wat` に書き間違いがあると、変換の時点で、ファイル名と行番号つきのエラーになります（読み方は、[Getting Started](./01_GETTING_STARTED.md) の「うまくいかないとき」を参照）。

---

## 3. テストとコードの検査

| コマンド | 内容 |
| --- | --- |
| `make js/test` | WebAssembly への変換を行ってから、テストを実行します |
| `make js/check` | コードを検査します。規則（ESLint）と書式（Prettier）の両方を見ます |
| `make js/fix` | 検査の指摘のうち、自動で直せるものを直します |

プルリクエストを作る前に、`make js/fix`、`make js/check`、`make js/test` の順に実行してください。

検査の対象は、JavaScript、JSON、YAML です。`.wat` と Markdown は、対象から外しています。

---

## 4. パッケージの操作

| コマンド | 内容 |
| --- | --- |
| `make js/add TARGET=<パッケージ名>` | 開発用のパッケージを追加します |
| `make js/install` | `pnpm-lock.yaml` の記録のとおりに、パッケージをインストールします |
| `make js/outdated` | 新しいバージョンが出ているパッケージを表示します。何も表示されなければ、すべて最新です |

例：`typescript` を追加する場合

```zsh
$ make js/add TARGET=typescript
```

バージョンは、追加した時点のものに固定されます（`^` や `~` は付きません）。

`git pull` で `package.json` や `pnpm-lock.yaml` が変わったときは、`make js/install` を実行してください。

---

## 5. コンテナの中に入る

| コマンド | 内容 |
| --- | --- |
| `make node/login` | コンテナのシェルに入ります。`exit` で抜けます |
| `make node/repl` | Node.js の対話環境を開きます。`.exit` で抜けます |

コンテナの中では、`pnpm` のコマンドを直接使えます（`pnpm build`、`pnpm start`、`pnpm test` など）。`pnpm start` と `pnpm test` も、最初に変換を行います。続けて何度も実行するときは、中に入ったほうが、コンテナの起動を待たずに済みます。
