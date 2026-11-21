.PHONY: setup build down run wasm/build js/test js/check js/fix js/install js/add js/outdated node/login node/repl

## コンテナ操作系
# セットアップ
setup:
	docker compose build
	docker compose run --rm app pnpm install --frozen-lockfile
	docker compose run --rm app pnpm build
# コンテナのビルド
build:
	docker compose build
# コンテナの削除（ボリューム含む）
down:
	docker compose down -v --remove-orphans


## 実行系
# プログラムの実行（WebAssembly への変換を含む）
run: wasm/build
	docker compose run --rm app pnpm start
# WebAssembly への変換（.wat から .wasm を作る）
wasm/build:
	docker compose run --rm app pnpm build


## JavaScript 操作系
# テスト（WebAssembly への変換を含む）
js/test: wasm/build
	docker compose run --rm app pnpm test
# コードチェック
js/check:
	docker compose run --rm app pnpm check
# コード修正
js/fix:
	docker compose run --rm app pnpm fix
# パッケージのインストール
js/install:
	docker compose run --rm app pnpm install
# パッケージの追加（開発用）
js/add:
	docker compose run --rm app pnpm add --save-dev --save-exact $(TARGET)
# 新しいバージョンがあるパッケージの確認
js/outdated:
	docker compose run --rm app pnpm outdated


## コンソール系
# コンテナのシェル
node/login:
	docker compose run --rm app bash
# コンテナのnodeのrepl
node/repl:
	docker compose run --rm app node
