FROM node as builder
WORKDIR /app
COPY package*.json ./
RUN npm set-script postinstall ""
RUN npm set-script prepare ""
RUN npm ci --silent
COPY . .
RUN npm run build:ts

FROM node
WORKDIR /app
COPY package*.json ./
RUN npm set-script postinstall ""
RUN npm set-script prepare ""
RUN npm ci --production

COPY --from=builder /app/dist ./dist
COPY prisma ./prisma/
COPY .env .

EXPOSE 8000
CMD ["npm", "run", "start:prod"]