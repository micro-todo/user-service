FROM node:24-alpine AS build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY . .
RUN npm run prisma:generate
RUN npm run build

# stage to install only production deps
FROM node:24-alpine AS deps
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
COPY package-lock.json ./
COPY prisma ./prisma/
RUN npm ci --only=production
RUN npm run prisma:generate

## this is stage two, where the app actually runs
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
COPY package-lock.json ./
COPY prisma ./prisma/
COPY --from=build /app/dist ./dist/
COPY --from=deps /app/node_modules ./node_modules/
RUN ls -a
CMD [ "npm", "run", "start:prod"]
