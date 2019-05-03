FROM node:8.10.0

WORKDIR /app/frontend

COPY package*.json /app/frontend/

RUN npm install 

COPY . /app/frontend/

CMD ["npm", "start"]