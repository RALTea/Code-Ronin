FROM judge0/judge0:1.13.1 as base
WORKDIR /usr/local/bin/ts-5.6.3
WORKDIR /usr/local/.nvm
WORKDIR /api

RUN mkdir -p /usr/local/.nvm && chmod -R 755 /usr/local/.nvm

# Install nvm
ENV NVM_DIR /usr/local/.nvm
ENV NODE_VERSION 20.10.0
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# Add node and npm to path so the commands are available
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Install latest TypeScript and tsx in a specific directory
RUN mkdir -p /usr/local/bin/ts-5.6.3/typescript && \
    cd /usr/local/bin/ts-5.6.3/typescript && \
    npm init -y && \
    npm install typescript@5.6.3 tsx vitest

# Set up the new language
COPY ./scripts/*.sh /usr/local/bin/.

# Add TypeScript configuration
COPY ./scripts/tsconfig.json /usr/local/bin/ts-5.6.3/typescript/tsconfig.json

COPY ./scripts/example.ts /api/example.ts
