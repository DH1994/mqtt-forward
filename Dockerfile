FROM node:trixie-slim

COPY app /app

USER 1001

WORKDIR /app

CMD ["node", "main.js"]
