FROM mysql:9.0.0

ENV MYSQL_DATABASE=littlelinks
ENV MYSQL_ROOT_PASSWORD=root

COPY ./scripts /docker-entrypoint-initdb.d/

EXPOSE 3306