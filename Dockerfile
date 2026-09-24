FROM node:alpine AS build

WORKDIR /build

COPY . .

RUN npm install -g yarn

RUN yarn install --frozen-lockfile
RUN yarn workspaces run build

FROM oven/bun:alpine AS cms

WORKDIR /app

COPY --from=build /build/cms/.next/standalone ./
COPY --from=build /build/cms/.next/static ./cms/.next/static

CMD ["bun","cms/server.js"]

FROM oven/bun:alpine AS website

WORKDIR /app

COPY --from=build /build/website/build ./dist

RUN bun i payload

CMD ["bun","dist/index.js"]