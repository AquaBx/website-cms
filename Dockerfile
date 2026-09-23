FROM oven/bun:alpine AS build

WORKDIR /build

COPY . .

ENV WEBSITE_SECRET=factice
ENV DATABASE_URL=factice

WORKDIR /build/config
RUN bun install --frozen-lockfile

WORKDIR /build/cms
RUN bun install --frozen-lockfile

WORKDIR /build/cms/node_modules/adapter-bun
RUN bun install
RUN bun run build

WORKDIR /build/cms
RUN bun run build

WORKDIR /build/website
RUN bun install --frozen-lockfile
RUN bun run build

FROM oven/bun:alpine AS cms

WORKDIR /app

COPY ./cms/package.json .
COPY --from=build /build/cms/bun-dist ./dist
COPY --from=build /build/cms/.next ./.next

RUN bun i -p

CMD ["bun","dist/server.js"]

FROM oven/bun:alpine AS website

WORKDIR /app

COPY ./website/package.json .
COPY --from=build /build/website/build ./dist

RUN bun i -p

CMD ["bun","dist/index.js"]