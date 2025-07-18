# Compras+

This is a side project to practice my software chops. I want to create a fullstack web app and practice with various technologies.

Compras+ is a web app to track your shopping lists with a twist:

-   For each product prices are looked up at local grocery stores: Albert Heijn, Jumbo, Dirk vd Broek, etc.
-   This will provide an overview of where certain items will be the cheapest so you can plan your shopping trips better.

If your on a budget or just want some extra change at the end of the month, Compras+ will provide you that overview.

## Tech stack

The project is still in development, so exact tools are subject to change.

**Frontend**

-   Frontend library/ framework
    -   `React`.
        -   `react-router` for routing.
-   `Typescript`.

**Backend**

-   Backend framework
    -   `FastAPI` (`Python`).
    -   `Pydantic` for data validation (`FastAPI` makes heavy usage of `Pydantic`).
-   Database
    -   `PostgreSQL`.
    -   `SQLAlchemy` as a database engine/ connector.
    -   `Alembic` for database migrations.
    -   Writing raw `SQL` for DDL, DML and database functions and triggers to practice.
-   Authentication
    -   Simple username + password authentication.
    -   JWTs.
    -   Implemented using FastAPI's built-in authentication components.
-   Retrieving product information
    -   `supermarktconnector` package provides a means to retrieve product information from Albert Heijn and Jumbo.

## Progress

-   FastAPI and React projects have been created.
-   Backend
    -   Database tables have been created.
    -   `PostgreSQL` functions and triggers have been implemented to automatically update the `updated_at` column in each table with the current timestamp at time of updating.
    -   Endpoints and logic for `/users` and `/items` resources have been created.
    -   Simple username + password authentication is implemented. Relevant endpoints have been protected by authentication checks.
-   Frontend
    -   Doing mobile-first, so the website doesn't look great on anything larger than mobile.
    -   Landing page has been created, albeit a simple one.
    -   Signup/ login page has been created, including form validation.
    -   Creating a user from the frontend works.
    -   Need to work on logging in next.
    -   Logging in works.
    -   Working on Home page which is where the Shopping list will be.
    -   Working on adding new items to the shopping list.
    -   Found a Python package which allows me to search current product data from Albert Heijn and Jumbo.
    -   Can create new items which searches for AH products. Still need to implement product search for Jumbo.
    -   Can logout.
    -   Can create new items.
    -   Can mark items as completed.
    -   Can delete items.
    -   Working on item detail page where all the found products for an item is displayed and where the item title can be edited.
    -   All pages except item detail page are responsive up until now.
    -   All pages are responsive.
    -   Can edit item name on item detail page.
    -   Products on item detail page are sorted by price ascending.

-   Would love to include more supermarkets, but they don't have public API's :(
    -   Albert Heijn and Jumbo don't either, but I lucked out by finding a Python package which provides a means to search for products.
