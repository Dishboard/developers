FROM postgres:16

ENV PGDATA=/var/lib/postgresql/data

# Install pg_cron extension
RUN apt-get update && apt-get install -y postgresql-16-cron

RUN echo "shared_preload_libraries = 'pg_cron'" >> /usr/share/postgresql/postgresql.conf.sample
RUN echo "cron.database_name = 'dev'" >> /usr/share/postgresql/postgresql.conf.sample
RUN echo "cron.host = ''" >> /usr/share/postgresql/postgresql.conf.sample
