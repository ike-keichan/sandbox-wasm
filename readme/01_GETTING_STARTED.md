# Getting Started（環境構築）

手元のパソコンで、このプログラムを動かせるようにするまでの手順です。上から順に進めてください。

- [0. この手順でできること](#0-この手順でできること)
- [1. 必要なソフトウェアを用意する](#1-必要なソフトウェアを用意する)
- [2. リポジトリを手元に持ってくる](#2-リポジトリを手元に持ってくる)
- [3. 環境を作る](#3-環境を作る)
- [4. プログラムを実行する](#4-プログラムを実行する)
- [5. テストとコードの検査を実行する](#5-テストとコードの検査を実行する)
- [6. 2回目からの使い方](#6-2回目からの使い方)
- [7. 環境を作り直す](#7-環境を作り直す)
- [8. うまくいかないとき](#8-うまくいかないとき)

※ 特に指示がない場合、コマンドは、このリポジトリのフォルダの直下で実行してください。

※ コマンドの例の先頭にある `$` は、入力する行であることを表す記号です。`$` 自体は入力しません。`$` のない行は、表示される結果の例です。

---

## 0. この手順でできること

手順を終えると、次の状態になります。

- WebAssembly のテキスト形式（`.wat`）のファイルを、バイナリ（`.wasm`）に変換できる。
- 変換した WebAssembly を、JavaScript（Node.js）から呼び出して、実行できる。

Node.js は、Docker のコンテナの中で動きます。**手元のパソコンに、Node.js をインストールする必要はありません。**

所要時間は、初回で5分ほどです（ほとんどが、ダウンロードの待ち時間です）。

---

## 1. 必要なソフトウェアを用意する

必要なものは、次の3つです。

| ソフトウェア | 用途 | 確認したバージョン |
| --- | --- | --- |
| Docker Desktop | コンテナを動かす | Docker 29.9.3、Docker Compose v5.7.0 |
| make | 長いコマンドを、短い名前で実行する | GNU Make 3.81 |
| Git | リポジトリを手元に持ってくる | 2.54.0 |

バージョンは、上の表より新しければ問題ありません。動作は macOS で確認しています。

### 1-1. Docker Desktop

1. [Docker Desktop の公式サイト](https://www.docker.com/products/docker-desktop/)から、自分のパソコンに合ったものをダウンロードして、インストールします。
   - Mac の場合は、チップの種類（Apple シリコンか、Intel か）を選びます。種類は、画面の左上のアップルメニューの「この Mac について」で確認できます。
2. インストールした Docker Desktop を起動します。
3. メニューバー（Windows の場合はタスクトレイ）にクジラのアイコンが出て、動きが止まれば、起動は完了です。

**Docker Desktop は、この先の手順のあいだ、起動したままにしてください。** 起動していないと、コマンドがエラーになります。

インストールできたかを、ターミナルで確認します。

```zsh
$ docker --version
Docker version 29.9.3, build 5457199

$ docker compose version
Docker Compose version v5.7.0
```

バージョンが表示されれば、準備できています。

### 1-2. make

macOS と Linux には、最初から入っています。次のコマンドで確認できます。

```zsh
$ make --version
GNU Make 3.81
```

macOS で「コマンドライン・デベロッパツールが必要です」という画面が出た場合は、「インストール」を押して、終わるまで待ってください。make と Git が、一緒に入ります。

Windows の場合は、WSL2（Windows の中で Linux を動かす仕組み）の中で作業してください。WSL2 の Ubuntu では、`sudo apt install make` で入ります。

### 1-3. Git

```zsh
$ git --version
git version 2.54.0 (Apple Git-157)
```

バージョンが表示されれば、準備できています。

---

## 2. リポジトリを手元に持ってくる

作業用のフォルダに移動して、リポジトリを複製します。

```zsh
$ git clone git@github.com:ike-keichan/sandbox-wasm.git
$ cd sandbox-wasm
```

このリポジトリをひな形にして、自分のリポジトリを作った場合は、URL を自分のリポジトリのものに読み替えてください（作り方は、[Template](./04_TEMPLATE.md) を参照）。

以降のコマンドは、すべてこの `sandbox-wasm` フォルダの直下で実行します。

---

## 3. 環境を作る

次のコマンドを実行します。**初回だけ**行う手順です。

```zsh
$ make setup
```

このコマンドは、次の3つを順番に行います。

| 順番 | 行うこと | 補足 |
| --- | --- | --- |
| 1 | コンテナのビルド | Node.js のイメージをダウンロードして、コンテナを作ります |
| 2 | パッケージのインストール | 変換や検査に使うパッケージを入れます |
| 3 | WebAssembly への変換 | `src/` の中の `.wat` から、`.wasm` を作ります |

初回は、イメージのダウンロードがあるので、数分かかります。

最後が次のような表示になれば、成功です。

```zsh
Done in 993ms using pnpm v12.21.0
docker compose run --rm app pnpm build
$ node scripts/build.js
built src/hello/hello.wasm
1 file(s) built
```

`built src/hello/hello.wasm` が、変換ができた合図です。

`Error` や `failed` という言葉が出て止まった場合は、「[8. うまくいかないとき](#8-うまくいかないとき)」を見てください。

---

## 4. プログラムを実行する

```zsh
$ make run
```

次のように表示されれば、正常です。

```zsh
docker compose run --rm app pnpm start
$ node scripts/build.js && node src/main.js
built src/hello/hello.wasm
1 file(s) built
hello world!
```

最後の `hello world!` は、WebAssembly が持っている文字列を、JavaScript が受け取って表示したものです。

`make run` と `make js/test` は、実行の前に、毎回 WebAssembly への変換を行います。`.wat` を書き換えたあとに、変換を忘れることがありません。

このリポジトリは、サーバーのように動き続けるものではありません。コマンドを実行するたびに、コンテナが起動して、終わると止まります。止める操作は要りません。

---

## 5. テストとコードの検査を実行する

開発を始める前に、テストと検査が通ることも確かめておきます。

```zsh
$ make js/test
built src/hello/hello.wasm
1 file(s) built
✔ helloWorld は、WebAssembly が持つ文字列を JavaScript に渡す (2.895916ms)
✔ helloWorld は、呼ぶたびに文字列を渡す (0.903375ms)
ℹ tests 2
ℹ pass 2
ℹ fail 0

$ make js/check
$ eslint . && prettier --check .
Checking formatting...
All matched files use Prettier code style!
```

`fail 0` と `All matched files use Prettier code style!` が出れば、正常です（表示は、見やすいように一部を省いています）。

以上で、環境構築は完了です。

---

## 6. 2回目からの使い方

`make setup` は、初回だけで足ります。2回目からは、次の流れになります。

1. Docker Desktop を起動する。
2. `src/` の中のファイルを書き換える。
3. `make run` で実行する。または、`make js/test` でテストを実行する。

`package.json` や `Dockerfile` が変わったとき（`git pull` で更新を取り込んだあとなど）は、次を実行します。

```zsh
$ make build
$ make js/install
```

そのほかのコマンドは、[Command](./02_COMMAND.md) にまとめています。

---

## 7. 環境を作り直す

動きがおかしくなったときや、最初の状態に戻したいときは、コンテナとパッケージを消して、作り直せます。

```zsh
$ make down
$ make setup
```

---

## 8. うまくいかないとき

### `Cannot connect to the Docker daemon` と表示される

Docker Desktop が起動していません。Docker Desktop を起動して、クジラのアイコンの動きが止まってから、もう一度コマンドを実行してください。

### `make setup` の途中で止まった

ダウンロードの途中で、通信が切れた可能性があります。もう一度 `make setup` を実行してください。

### `parseWat failed` と表示される

`.wat` の書き方（かっこの対応、命令の名前など）の誤りです。直後に、ファイル名、行番号、桁の番号、理由が表示されます。

```zsh
parseWat failed:
src/hello/hello.wat:18:4: error: unexpected token "data", expected an instr.
  (data (global.get $start_string_index) "hello world!")
   ^^^^
```

この例では、`src/hello/hello.wat` の18行目の4桁目で、問題が見つかっています。原因は、表示された行より前にあることがあります（この例は、1つ前の定義で、閉じるかっこが足りていませんでした）。

### `validate failed` と表示される

書き方は正しいものの、型や数が合っていない誤りです。

```zsh
validate failed:
src/hello/hello.wat:24:6: error: type mismatch in call, expected [i32, i32] but got [i32]
    (call $print_string (global.get $string_length))
     ^^^^
```

この例では、引数を2つ受け取る関数に、1つしか渡していません。

### `ENOENT: no such file or directory` と、`.wasm` の名前が表示される

`.wasm` が作られていません。`.wasm` は、Git の管理の対象から外しているので、`git clone` の直後にはありません。次のコマンドで作ってください。

```zsh
$ make wasm/build
```

### `Cannot find package` と表示される

パッケージが入っていません。次のコマンドで入れてください。

```zsh
$ make js/install
```

### `LinkError` や `TypeError: WebAssembly.instantiate()` と表示される

WebAssembly が求めているもの（`import`）と、JavaScript が渡しているものが、合っていません。`.wat` の `import` の名前と型を、JavaScript の側のオブジェクトと見比べてください。

### それでも直らない

「[7. 環境を作り直す](#7-環境を作り直す)」の手順で、最初から作り直してください。
