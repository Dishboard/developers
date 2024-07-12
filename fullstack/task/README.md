# Fullstack Developer Task

This task is designed to test the way you work in an (almost) real environment. You will be getting an existing codebase and you will need to implement a feature using the existing technologies and guidelines.

This task includes two parts - Frontend and Backend

## Backend

The repository provides a simple backend (`fullstack/task/packages/server`). It comes pre-configured with TypeScript, NestJS, GraphQL, TypeORM, and some example code on how to use these things.

Your overall goal is to implement a GraphQL query that would return a list of exchange rates for a number of currencies. The more specific requirements are as follows:

- You will be working mainly in the `fullstack/task/packages/server/src/services/exchange-rate` file - the TODO comments will guide you in the right direction
- You need to get the latest exchange rates from the website of the Czech National Bank. Finding where they are and how to get them is a part of the task
- The exchange rates need to be cached **in the Postgres database**. Once you get them from the bank - you need to store the rates in the database. The cache should have a lifetime of 5 minutes, after which it should be invalidated and all future requests would once again get the data from the bank (and cache them again). During the cache lifetime, the rates must be read from the database.
- The choice of technologies is mostly up to you, but you must use NestJS, GraphQL, TypeORM, and TypeScript.

The `fullstack/task/packages/server/README.md` file will help you set up the dev environment.

## Frontend

Once the Backend Query is done, you need to create a simple web page that will display this data. You will find a skeleton web project in `fullstack/task/packages/client`.

The web page needs to have the following:
- A table that displays a list of exchange rates (country, currency, amount, code, rate)
- A section that would display how long ago the rates were fetched (because of the cache)

You must use TypeScript and React, but all other technologies are up to you.

The design of the table and the website overall is not the main point of the task so it will not be judged. You'll get bonus points if it looks nice though 🙂

## Dev environment

The workspaces and packages are managed by [nx](https://nx.dev/). You can find all the commands in the `project.json` files. To start the apps, run the following from the root workspace directory:

```
yarn client start
yarn server start
```
