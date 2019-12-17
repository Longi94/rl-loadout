# Rocket Loadout (https://rocket-loadout.com)

[![CircleCI][circleci]][circleci-url]
[![Release][release]][release-url]
[![Language Grade][lgtm]][lgtm-url]
[![Discord][discord]][discord-url]

[circleci]: https://circleci.com/gh/Longi94/rl-loadout/tree/master.svg?style=svg
[circleci-url]: https://circleci.com/gh/Longi94/rl-loadout/tree/master
[release]: https://img.shields.io/github/v/tag/Longi94/rl-loadout?label=release
[release-url]: https://github.com/Longi94/rl-loadout/releases
[lgtm]: https://img.shields.io/lgtm/grade/javascript/github/Longi94/rl-loadout.svg?label=code%20quality
[lgtm-url]: https://lgtm.com/projects/g/Longi94/rl-loadout/
[discord]: https://img.shields.io/discord/609050910731010048.svg?colorB=7581dc&logo=discord&logoColor=white
[discord-url]: https://discord.gg/c8cArY9

Create Rocket League car designs on the web. Powered by [three.js](https://threejs.org/). Angular 8 frontend, Python flask backend and PostgreSQL database.

## Setup

This applies to setting up the local development environment.

### Requirements

* Python 3.6 or later https://www.python.org/downloads/
* PostgreSQL 11 https://www.postgresql.org/download/
* Node (LTS should be fine) https://nodejs.org/

### Database

* Create a PostgreSQL user called `rl_loadout` with the password `dev`. For example:
```sql
CREATE ROLE rl_loadout WITH
  LOGIN
  NOSUPERUSER
  NOCREATEDB
  NOCREATEROLE
  INHERIT
  NOREPLICATION
  CONNECTION LIMIT -1
  PASSWORD 'dev';
```
* Create a PostgreSQL database called `rl_loadout`. For development purposes it's you can make the new role the owner of the database. Otherwise you'll need to grant priviliges to connect, create database and the general dml operation priviliges.
```sql
CREATE DATABASE rl_loadout
  WITH 
  OWNER = rl_loadout
  ENCODING = 'UTF8'
  CONNECTION LIMIT = -1;
```

### Backend

Simply run the `server.py` script. This will create all the tables needed in the database.

```bash
cd backend
python server.py
```

### Frontend

Serve the angular frontend.

```bash
cd frontend
ng serve
```

### Assets

Some models, textures and icons files are available in the Google Cloud Storage bucket called `rl-loadout-dev` (https://storage.googleapis.com/rl-loadout-dev). The bucket is public readable but not writable. If you want to upload some files you may ask for priviliges to the bucket or provide your own file hosting and overwrite the `assetHost` property of the angular environment file.
