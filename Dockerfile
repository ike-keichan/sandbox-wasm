FROM node:26.13.1-slim

# pnpm を入れる。
# コンテナは、手元のパソコンと同じユーザーで動かす（docker-compose.yml の user を参照）。
# どのユーザーでもパッケージを入れられるように、node_modules を置く場所を、誰でも書き込めるようにしておく。
RUN npm install --global pnpm@12.21.0 \
    && mkdir -p /app/node_modules \
    && chmod 777 /app /app/node_modules

# ホームディレクトリを、どのユーザーでも書き込める場所にする。pnpm が、設定やキャッシュを置くのに使う。
ENV HOME=/tmp

WORKDIR /app

CMD ["pnpm", "start"]
