[![Shaka-JS.png](https://i.postimg.cc/VL24nyh2/Shaka-JS.png)](https://postimg.cc/Yhf1BPMx)
# Shaka JS Starter Pack, a free NodeJS Fullstack Starter Pack / Boilerplate for everyone

A NodeJS Fullstact Starter Pack project consists of :

- NodeJS with ExpressJS as backend
- NextJS React with ChakraUI as frontend


## Tech Stack

**Backend:** NodeJS, ExpressJS, Redis (for job queue), Sequelize, Handlebars (email templating)

**Frontend:** NextJS, React, ChakraUI


## Shaka Backend CLI Commands
| Command                                         | Remark                                     |
|-------------------------------------------------|--------------------------------------------|
| npm run shaka route:list                        | List all routes                            |
| npx sequelize db:migrate                        | Run pending migrations                     |
| npx sequelize db:migrate:schema:timestamps:add  | Update migration table to have timestamps  |
| npx sequelize db:migrate:status                 | List the status of all migrations          |
| npx sequelize db:migrate:undo                   | Reverts a migration                        |
| npx sequelize db:migrate:undo:all               | Revert all migrations ran                  |
| npx sequelize db:seed                           | Run specified seeder                       |
| npx sequelize db:seed:undo                      | Deletes data from the database             |
| npx sequelize db:seed:all                       | Run every seeder                           |
| npx sequelize db:seed:undo:all                  | Deletes data from the database             |
| npx sequelize db:create                         | Create database specified by configuration |
| npx sequelize db:drop                           | Drop database specified by configuration   |
| npx sequelize init                              | Initializes project                        |
| npx sequelize init:config                       | Initializes configuration                  |
| npx sequelize init:migrations                   | Initializes migrations                     |
| npx sequelize init:models                       | Initializes models                         |
| npx sequelize init:seeders                      | Initializes seeders                        |
| npx sequelize migration:generate                | Generates a new migration file             |
| npx sequelize migration:create                  | Generates a new migration file             |
| npx sequelize model:generate                    | Generates a model and its migration        |
| npx sequelize model:create                      | Generates a model and its migration        |
| npx sequelize seed:generate                     | Generates a new seed file                  |
| npx sequelize seed:create                       | Generates a new seed file                  |

## Features

- Light/dark mode toggle
- Login page
- Register page + verification email + verification page using 6 digits token
- Forget Password and reset it using 6 digits token
- Landing page
- Dashboard page
- Roles master data
- Permissions master data
- Permission matrix like [Laravel Entrust](https://github.com/shanmuga3/laravel-entrust) , trust me I am Senior Laravel Developer :p
- User management
- Profile management
- [TinyMCE Editor](https://github.com/tinymce/tinymce)
- Autoload Models in backend, just put your model class in `backend/models` and it can be called anywhere by call `modelnameModel` e.g `newsModel`
- Autoload Repositories in backend, just put your repository class in `backend/repositories` and it can be called anywhere by call `repositoynameRepository` e.g `newsRepository`
- Autoload routing in backend, just put your repository class in `backend/routes/*/*` and it can be called anywhere by call its path and name  e.g `backend/routes/api/v2/user` will generates new endpoints (using plural word) called `{URL}/api/v2/users/*`



## Author(s)

- [@auliawiguna](https://github.com/auliawiguna)


## Installation

- Fork this project
- This project is not Dockerise yet, it has been being developed in NodeJS version 16.15.1 and NPM version 8.11
- Make sure you have active MySQL server and Redis
- To run sequelize, you need NPX in your end, kindly follow this [tutorial to install sequelize-cli in your end](https://www.npmjs.com/package/sequelize-cli)

### Install and run backend


```bash
  cd your-project-path
  cd backend
  cp .env.example .env
  npm install
  npx sequelize db:migrate
  npx sequelize db:seed:all
  npm run dev
```
- Adjust the `.env` values to meet your local environment
- By default, backend will run in port 5000
- Default username is `aulia@aulia.com` and its password is `password123` , you may add new users by editing `backend/seeders/20220519093017-roles-permissions-admin-user.cjs`
    
### Install and run frontend


```bash
  cd your-project-path
  cd frontend
  cp .env.example .env
  npm install
  npm run dev
```
- Adjust the `.env` values to meet your local environment
- By default, frontend will run in port 3000
    
## Roadmap

- [Frontend] Add MFA page
- [Frontend & Backend] Add feature to sign in/up using Social Medias
- [Frontend & Backend] Dockerise them both, just to make sure that everything can runs well in your end
- [Backend] Enable Swagger UI to test API

## Screenshots

[![Screenshot-from-2022-07-05-22-18-53.png](https://i.postimg.cc/pdFK89Hb/Screenshot-from-2022-07-05-22-18-53.png)](https://postimg.cc/f3M3QRyB)

[![Screenshot-from-2022-07-05-22-05-24.png](https://i.postimg.cc/pL9jb9yh/Screenshot-from-2022-07-05-22-05-24.png)](https://postimg.cc/Wdvz01GT)
