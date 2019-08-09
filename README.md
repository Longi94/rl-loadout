# Rocket Loadout (https://rocket-loadout.com) [<img src="https://img.shields.io/discord/609050910731010048.svg?colorB=7581dc&logo=discord&logoColor=white">](https://discord.gg/c8cArY9)

| master | develop |
| --- | --- |
| [![CircleCI](https://circleci.com/gh/Longi94/rl-loadout/tree/master.svg?style=svg&circle-token=d3d0f0f0eabe4e72d5fcd7ffdc9843ad815edd80)](https://circleci.com/gh/Longi94/rl-loadout/tree/master) | [![CircleCI](https://circleci.com/gh/Longi94/rl-loadout/tree/develop.svg?style=svg&circle-token=d3d0f0f0eabe4e72d5fcd7ffdc9843ad815edd80)](https://circleci.com/gh/Longi94/rl-loadout/tree/develop) |

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
CREATE DATABASE asda
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

The frontend will query the default body and wheels, you'll need at least these records in the db for everything to work.

```sql
INSERT INTO public.body (name, quality, icon, paintable, model, blank_skin, base_skin) VALUES ('Octane', 0, 'icons/Body_Octane_Thumbnail.jpg', true, 'models/Body_Octane_SF.glb', 'textures/Pepe_Body_BlankSkin_RGB.tga', 'textures/Pepe_Body_D.tga');
INSERT INTO public.wheel (name, quality, icon, paintable, model, rim_base, rim_rgb_map) VALUES ('OEM', 0, 'icons/Wheel_Star_Thumbnail.jpg', true, 'models/WHEEL_Star_SM.glb', 'textures/OEM_D.tga', 'textures/OEM_RGB.tga');
```

### Frontend

Serve the angular frontend.

```bash
cd frontend
ng serve
```

### Assets

Some models, textures and icons files are available in the Google Cloud Storage bucket called `rl-loadout-dev` (https://storage.googleapis.com/rl-loadout-dev). The bucket is public readable but not writable. If you want to upload some files you may ask for priviliges to the bucket or provide your own file hosting and overwrite the `assetHost` property of the angular environment file.

## Contribution

Pull requests should be made against the `develop` branch, unless it's a hotfix. The `master` branch is for releases only as there is a CD.
