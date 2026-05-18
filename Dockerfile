# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS build

WORKDIR /app

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock .babelrc ./

COPY .yarn/releases .yarn/releases

# node-modules linker in CI avoids syncing repo .pnp.cjs with yarn.lock edits.
RUN echo "nodeLinker: node-modules" > .yarnrc.yml

COPY src ./src
COPY config ./config

# Fly.io / CI use public CAs. For laptops behind TLS-inspecting proxies only:
# docker build --build-arg DOCKER_TLS_INSECURE=1 .
ARG DOCKER_TLS_INSECURE=0
RUN TLS_OPTS= ; [ "$DOCKER_TLS_INSECURE" = "1" ] && TLS_OPTS="env NODE_TLS_REJECT_UNAUTHORIZED=0" ; \
    $TLS_OPTS node .yarn/releases/yarn-4.6.0.cjs install --no-immutable \
  && node .yarn/releases/yarn-4.6.0.cjs compile

FROM node:22-bookworm-slim AS production

WORKDIR /app

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/build ./
COPY --from=build /app/.yarn/releases ./.yarn/releases

RUN printf '%s\n' '#!/bin/sh' 'exec node /app/.yarn/releases/yarn-4.6.0.cjs "$@"' > /usr/local/bin/yarn \
  && chmod +x /usr/local/bin/yarn

ARG DOCKER_TLS_INSECURE=0
RUN TLS_OPTS= ; [ "$DOCKER_TLS_INSECURE" = "1" ] && TLS_OPTS="env NODE_TLS_REJECT_UNAUTHORIZED=0" ; \
    echo "nodeLinker: node-modules" > .yarnrc.yml \
  && $TLS_OPTS node .yarn/releases/yarn-4.6.0.cjs install --no-immutable \
  && npm prune --omit=dev \
  && node .yarn/releases/yarn-4.6.0.cjs cache clean --all \
  && rm -rf /root/.yarn /root/.cache

RUN chown -R node:node /app

USER node

EXPOSE 8080

CMD ["node", "server.js"]
