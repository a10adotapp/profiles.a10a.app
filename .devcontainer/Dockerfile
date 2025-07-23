FROM mcr.microsoft.com/devcontainers/base:noble

RUN apt-get update && apt-get upgrade -y

RUN apt-get install -y postgresql-client

RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash \
  && apt-get install -y nodejs

RUN npm i -g vercel

USER vscode
