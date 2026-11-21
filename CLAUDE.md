# CLAUDE.md

このリポジトリで作業するときの決まり。Claude Code が読み込むほか、人が書くときの基準にもする。

README と `readme/` には、使う人に向けた説明を書く。ここには、書く人に向けた細かい決まりを書く。

## このリポジトリの目的

WebAssembly をテキスト形式（WAT）で書き、JavaScript（Node.js）から呼び出す方法の技術検証と、プロジェクトのひな形を兼ねている。

- `main` は、最小の形のひな形である。**いつ複製されても動く状態**を保つ。
- `example/<内容>` は、`main` に何かを足した見本である。`main` にはマージしない。
- ひな形なので、**足すより、足さない**を選ぶ。特定の用途にしか使わない機能、設定、パッケージは、`main` に入れない。入れたい場合は、`example/` のブランチにする。

## 文書の置き場所

| 文書 | 内容 |
| --- | --- |
| `README.md` | 入口。概要、ブランチ、バージョン、主なコマンド、文書の一覧だけを書く |
| `readme/01_GETTING_STARTED.md` | 環境構築の手順 |
| `readme/02_COMMAND.md` | すべてのコマンド |
| `readme/03_ARCHITECTURE.md` | 構成 |
| `readme/04_TEMPLATE.md` | ひな形として使う手順 |
| `readme/05_DEVELOPMENT.md` | ブランチと作業の流れ |
| `readme/EXAMPLE_<内容>.md` | `example/` のブランチだけに置く、そのブランチの説明 |
| `CLAUDE.md` | このファイル |

作業を始める前に、`readme/03_ARCHITECTURE.md` と `readme/05_DEVELOPMENT.md` を読む。

## 作業の進め方

### ブランチとコミット

- `main` に直接コミットしない。`feature/`、`fix/`、`docs/` のどれかのブランチを作る。
- `example/` のブランチだけにある内容を直すときは、そのブランチに直接コミットしてよい。
- 1つのコミットには、1つの変更だけを入れる。
- コミットメッセージは、`add:`、`update:`、`fix:`、`docs:` のどれかで始め、日本語で1行に書き、「。」で終える（例：`add: 足し算のモジュールを追加。`）。
- コミットメッセージとプルリクエストに、ツールが生成したことを示す行（`Co-Authored-By` など）を入れない。
- push、プルリクエストのマージ、ブランチの削除は、人が行う。Claude は、コミットまで行い、実行するコマンドを伝える。

### 変更したら、必ず確かめる

次の4つを実行する。どれかが失敗している状態で、作業を終えたことにしない。

```sh
make js/fix
make js/check
make js/test
make run
```

`make js/test` と `make run` は、`.wat` から `.wasm` への変換を先に行う。`.wat` の書き間違いは、ここで見つかる。

次のものを変えたときは、追加で確かめる。

| 変えたもの | 確かめること |
| --- | --- |
| `Dockerfile`、`docker-compose.yml`、`package.json`、`Makefile` | `make down` のあとに `make setup` と `make run` が通る |
| `scripts/build.js` | 日本語のコメントを含む `.wat` が、変換できる |
| `.github/workflows/` | プルリクエストを作って、GitHub Actions が緑になる |

確かめられなかったことは、確かめられなかったと伝える。

### `main` を変えたあと

`main` に入った変更は、`example/` のブランチに取り込む（`git merge main`）。取り込んだあと、そのブランチでも検査とテストを実行する。手順は、`readme/05_DEVELOPMENT.md` の「3-6」にある。

## コードの書き方

### ファイルの分け方

機能ごとに、`src/<機能名>/` のディレクトリを作り、次の3つのファイルを置く。

- **`<機能名>.wat`**：WebAssembly のモジュール。
- **`index.js`**：モジュールを読み込み、JavaScript から使いやすい関数にして公開する。メモリや、WebAssembly に渡す関数の用意も、ここで行う。
- **`index.test.js`**：テスト。

どの機能でも使う処理は、`src/shared/` に置く。1つの機能しか使わないものは、その機能のディレクトリに置く。

機能を足したら、`src/main.js` で呼び出す。`.wat` は、`src/` の中にあれば自動で変換されるので、登録は要らない。

### WebAssembly（`.wat`）

- 新しい書き方を使う。

  | 使う書き方 | 使わない書き方 |
  | --- | --- |
  | `local.get`、`local.set` | `get_local`、`set_local` |
  | `global.get`、`global.set` | `get_global`、`set_global` |

- 引数、変数、グローバル、モジュールの中から呼ぶ関数には、`$` で始まる名前を付ける。番号（`local.get 0`）で参照しない。公開するだけで、モジュールの中から呼ばない関数は、`export` の名前だけでよい。
- 名前は、小文字とアンダースコアで書く（`$start_string_index`、`"hello_world"`）。
- 公開する関数は、定義と同じ場所で `export` する（`(func (export "add") ...)`）。
- JavaScript から受け取るものは、`"env"` という名前でまとめる（`(import "env" "memory" ...)`）。
- ファイルの先頭に、モジュールが何をするかを、コメントで書く。
- `import`、`global`、`data`、`func` のそれぞれの直前に、何のためのものかを、日本語のコメントで書く。WebAssembly に慣れていない人が読む前提で、省かずに書く。
- 文字列の長さのような、数え間違えやすい値には、何を数えたものかをコメントで書く（例：`"hello world!" は12バイト`）。日本語の文字は、1文字が3バイトになることに注意する。

### JavaScript

- ES モジュールで書く（`import`、`export`）。`require` は使わない。
- Node.js の標準のモジュールは、`node:` を付けて読み込む（`node:fs/promises`）。
- 読み込みの順番は、Node.js の標準のモジュール、パッケージ、自分のファイルの順にし、あいだを1行空ける。
- 関数は、アロー関数を `const` に入れて定義する。
- `index.js` が公開する関数の名前は、JavaScript の書き方にそろえる（`helloWorld`）。WebAssembly の側の名前（`hello_world`）や、メモリの位置を、外に見せない。
- モジュールを読み込む関数の名前は、`create<機能名>` にする（`createHello`）。非同期の関数にして、呼ぶ側は `await` する。
- 文字列のように、メモリを通して渡すものは、WebAssembly の側から、位置と長さの両方を渡す。JavaScript の側で、位置を別に覚えておかない。
- `.wasm` の読み込みは、`src/shared/wasm.js` の `instantiate` を使う。`.wasm` の場所は、`new URL('./<名前>.wasm', import.meta.url)` で、そのファイルからの相対で指定する。
- 画面への表示（`console.log`）は、`src/main.js` と `scripts/` にだけ書く。機能の `index.js` では、表示する代わりに、呼ぶ側から関数を受け取る。こうすると、テストで確かめられる。
- 意味のある数値には、名前を付ける（`START_STRING_INDEX`）。
- 公開する関数には、JSDoc を書く。1行目に何をするか、続けて `@param` と `@returns` を、型つきで書く。

  ```javascript
  /**
   * WebAssembly のモジュールを読み込み、インスタンスを応答する関数
   * @param {URL} url - .wasm ファイルの場所
   * @param {WebAssembly.Imports} [imports] - WebAssembly に渡す関数や変数
   * @returns {Promise<WebAssembly.Instance>} - WebAssembly のインスタンス
   */
  ```

### コメント

- コメントと JSDoc は、日本語で書く。
- コードを読めば分かることは、コメントにしない。なぜそうしているかを書く。

### 書式と検査

- 書式は Prettier、規則は ESLint に従う。手で整えず、`make js/fix` を使う。
- 規則を無効にする場合（`eslint-disable`）は、理由が分かるコメントを添える。
- Prettier の対象は、JavaScript、JSON、YAML である。Markdown は、`.prettierignore` で外している。`.wat` は、Prettier が扱えない。

## テストの書き方

- テストは、機能のディレクトリに、`index.test.js` という名前で置く。
- Node.js の標準の機能（`node:test`、`node:assert/strict`）を使う。テスト用のパッケージを足さない。
- `index.js` が公開している関数を呼んで、確かめる。`.wasm` を実際に読み込み、WebAssembly の動きを、作り物に置き換えない。
- テストの名前は、日本語で、「何が、どうなるか」を書く（例：`add は、2つの数を足した結果を返す`）。
- ふつうの値だけでなく、境目の値（0、負の数、型の上限）も確かめる。WebAssembly の数値は、型ごとに範囲が決まっていて、超えると結果が変わる。
- 機能を足したら、テストも足す。
- 件数だけでなく、中身を確かめる（`assert.equal(printed.length, 2)` ではなく、`assert.deepEqual(printed, [...])`）。

## 設定ファイルを変えるとき

### パッケージ

- パッケージの追加は、`make js/add` で行う。`package.json` を、手で書き換えない。
- バージョンは、固定する（`^` や `~` を付けない）。更新は、Dependabot に任せる。
- `pnpm-lock.yaml` は、コミットする。
- パッケージを足す前に、Node.js の標準の機能で足りないかを確かめる。このリポジトリは、実行時に必要なパッケージを、1つも使っていない（すべて開発用）。

### バージョン

- Node.js は、長期サポート版を使う。バージョンは、`Dockerfile`、`.node-version`、`package.json` の `engines` の3か所に書いてある。変えるときは、3か所をそろえる。
- pnpm のバージョンは、`Dockerfile` と、`package.json` の `packageManager` の2か所に書いてある。変えるときは、2か所をそろえる。
- バージョンを変えたら、`README.md` の「Tool Versions」の表も直す。

### Makefile

- コマンドを足したら、`.PHONY` の行にも足し、`readme/02_COMMAND.md` に説明を書く。主なコマンドなら、`README.md` の表にも足す。
- コマンドの名前は、対象を先に書く（`js/test`、`wasm/build`）。
- コマンドの直前に、何をするかを日本語のコメントで書く。

### 生成物

- `.wasm` は、コミットしない。`.wat` から作れるので、`.gitignore` で外している。
- `node_modules/` も、コミットしない。

## 文書の書き方

- `README.md` と `readme/` は、です・ます調で書く。`CLAUDE.md` は、である調で書く。
- `README.md` には、細かい説明を書かない。入口として、`readme/` の文書に案内する。
- `README.md` と、`readme/` の番号つきの文書は、**どのブランチでも同じ内容にする**。ブランチごとの説明は、`readme/EXAMPLE_<内容>.md` に書く。こうしないと、`main` を取り込むたびに衝突する。
- 手順には、実行するコマンドだけでなく、**成功したときに何が表示されるか**を書く。表示の例は、実際に実行したものを使う。想像で書かない。
- コマンドの例は、`zsh` のコードブロックに書き、入力する行の先頭に `$` を付ける。
- 読む人が知らないかもしれない言葉（線形メモリ、インスタンスなど）は、最初に出たところで説明する。
- コードを変えたら、関係する文書も同じコミットか、同じプルリクエストで直す。とくに、次の対応に注意する。

  | 変えたもの | 直す文書 |
  | --- | --- |
  | コマンド（`Makefile`、`package.json` の `scripts`） | `readme/02_COMMAND.md`、`README.md` の「Command」 |
  | ディレクトリやファイルの構成 | `readme/03_ARCHITECTURE.md` |
  | 環境構築の手順、表示される内容 | `readme/01_GETTING_STARTED.md` |
  | 名前（`sandbox-wasm` など） | `readme/04_TEMPLATE.md` の「名前を変える」 |
  | バージョン | `README.md` の「Tool Versions」 |
  | ブランチの追加 | `README.md` の「Branch」 |

## やらないこと

- `main` に、見本の機能（`add` など）を入れない。
- 動作を確かめていない変更を、確かめたことにしない。
- 頼まれていない機能の追加や、大きな書き換えをしない。気づいた問題は、直す前に伝える。
- `.wasm`、`node_modules/` などの生成物を、コミットしない。
