FROM node:8.10.0

### Frontned Configuration ###
WORKDIR /app/frontend/

COPY frontend/package*.json /app/frontend/

RUN npm install

COPY frontend/ /app/frontend

RUN npm run build

### Backend Configuration ###

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app/

CMD ["npm", "run", "dev"]

EXPOSE 8000