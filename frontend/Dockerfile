FROM alpine:latest

RUN apk update && \
    apk add --update nodejs nodejs-npm && \
    apk add --update nginx

RUN adduser -D -u 1000 -g 'www' www

COPY package.json /home/project-name/package.json
COPY package-lock.json /home/project-name/package-lock.json
WORKDIR /home/project-name

RUN npm cache clean -f

# set default value for loglevel to be error
ARG NPM_LOGLEVEL=error
RUN npm install --loglevel=${NPM_LOGLEVEL} --unsafe-perm
COPY . /home/project-name/

RUN npm run sass-lint
RUN npm run eslint
RUN npm run test

RUN npm run build

RUN chown -R www:www /var/lib/nginx && \
    chown -R www:www /home/project-name/dist

RUN mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.orig
COPY nginx.conf /etc/nginx/

ENV NODE_ENV production

ENTRYPOINT ["nginx", "-g", "daemon off;"]
EXPOSE 80

