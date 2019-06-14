FROM alpine:3.6

RUN apk update && \
    apk add --update mongodb && \
    apk add --update mongodb-tools

RUN mkdir -p \
    /home/data/db \
    /home/data/backup \
    /home/data/restore

VOLUME ["/home/data"]

COPY . /home/project-name/

# add execute permissions to the entrypoint file
RUN chmod +x /home/project-name/entrypoint.sh

EXPOSE 27017
ENTRYPOINT ["/home/project-name/entrypoint.sh"]
