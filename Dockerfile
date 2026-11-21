FROM node:26.13.1-slim

WORKDIR /app

RUN npm install --global pnpm@12.21.0

CMD ["pnpm", "start"]
