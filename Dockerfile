FROM node:24-alpine
WORKDIR /app
COPY . .
ENV NODE_ENV=production PORT=4000 HOST=0.0.0.0
EXPOSE 4000
CMD ["node", "server.js"]
