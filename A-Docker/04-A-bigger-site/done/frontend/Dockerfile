FROM node:alpine

WORKDIR /app

COPY package.json /app
RUN npm install

COPY . .

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

ENV BACKEND=http://backend:5000

CMD ["npm", "start"]
