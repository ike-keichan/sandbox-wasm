FROM node:26.13.1-slim

# pnpm を入れ、作業用のディレクトリを、一般ユーザー（node）のものにする。
RUN npm install --global pnpm@12.21.0 \
    && mkdir -p /app/node_modules \
    && chown -R node:node /app

WORKDIR /app

# root ではなく、一般ユーザーで動かす。
# root で動かすと、Linux では、変換で作った .wasm などが root の持ち物になり、手元で消せなくなる。
USER node

CMD ["pnpm", "start"]
