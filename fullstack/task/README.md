# Fullstack Developer Project

Exchange rates project includes two parts - Frontend and Backend

## Backend

The more specific features are as follows:

-   It gets the latest exchange rates from the website of the Czech National Bank.
-   The exchange rates are cached **in the Postgres database**. Once it gets them from the bank - they stored in the database. The cache have a lifetime of 5 minutes, after which it will be invalidated and all future requests would once again get the data from the bank (and cache them again). During the cache lifetime, the rates are read from the database.
-   The choice of technologies is NestJS, GraphQL, TypeORM, and TypeScript.

The `fullstack/task/packages/server/README.md` file will help you set up the dev environment.

## Frontend

The web page have the following:

-   A table that displays a list of exchange rates (country, currency, amount, code, rate)
-   A section that would display how long ago the rates were fetched (because of the cache)

## Dev environment

The workspaces and packages are managed by [nx](https://nx.dev/). You can find all the commands in the `project.json` files. To start the apps, run the following from the root workspace directory:

```
yarn install
yarn client start
yarn server start
```
