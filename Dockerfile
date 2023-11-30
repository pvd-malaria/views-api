FROM ubuntu:mantic

RUN apt-get update
RUN apt-get install -y ca-certificates curl gnupg
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update
RUN apt-get install nodejs -y

RUN npm i -g npm@latest

COPY dist /app
COPY package.json /app/.
COPY package-lock.json /app/.
COPY .env /app/.
WORKDIR /app

RUN npm ci --omit=dev

CMD ["npx", "dotenv", "-e", ".env", "--", "npm", "run", "start:deployed"]
