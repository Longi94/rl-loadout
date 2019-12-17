#!/bin/bash

echo "deb http://apt.postgresql.org/pub/repos/apt/ bionic-pgdg main" > /etc/apt/sources.list.d/pgdg.list
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

apt update
apt install -y python3-pip python3-dev build-essential libssl-dev libffi-dev python3-setuptools libpq-dev python-psycopg2 postgresql-11 postgresql-client-11

curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
apt install -y nodejs

pip3 install -r /vagrant/backend/requirements.txt
pip3 install uwsgi connexion[swagger-ui]

sudo -u postgres -H sh -c "psql -c \"CREATE ROLE rl_loadout WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE INHERIT NOREPLICATION CONNECTION LIMIT -1 PASSWORD 'dev'\""
sudo -u postgres -H sh -c "psql -c \"CREATE DATABASE rl_loadout WITH OWNER = rl_loadout ENCODING = 'UTF8' CONNECTION LIMIT = -1;\""
