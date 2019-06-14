FROM node:lastest

RUN mkdir -p /home/project-name
COPY package.json /home/project-name/package.json
COPY package-lock.json /home/project-name/package-lock.json

WORKDIR /home/project-name
RUN npm install
COPY . /home/project-name/

RUN npm run eslint
RUN npm run test

ENV PORT 3000
ENV NODE_ENV production

CMD ["npm", "run", "start_production"]
EXPOSE 3000
