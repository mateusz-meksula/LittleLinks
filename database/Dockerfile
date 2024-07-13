FROM mysql:8.4

ENV MYSQL_DATABASE=littlelinks
ENV MYSQL_ROOT_PASSWORD=root

COPY ./scripts /docker-entrypoint-initdb.d/

EXPOSE 3306