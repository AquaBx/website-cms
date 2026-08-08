FROM oven/bun:alpine AS build

WORKDIR /build

COPY . .

RUN bun install --frozen-lockfile

WORKDIR /build/node_modules/adapter-bun
RUN bun run build

WORKDIR /build

RUN bun run build

FROM oven/bun:alpine AS prod

WORKDIR /app

COPY ./package.json .
COPY --from=build /build/bun-dist ./dist
COPY --from=build /build/.next ./.next

RUN bun i -p

CMD ["bun","dist/server.js"]