# Compras+

This is a side project to practice my software chops. I want to create a fullstack web app and practice with various technologies.

Compras+ is a web app to track your shopping lists with a twist:

-   For each product prices are looked up at local grocery stores: Albert Heijn, Jumbo, Dirk vd Broek, etc.
-   This will provide an overview of where certain items will be the cheapest so you can plan your shopping trips better.

If your on a budget or just want some extra change at the end of the month, Compras+ will provide you that overview.

## Tech stack

The project is still in development, so exact tools are subject to change.

### Frontend

-   Frontend library/ framework
    -   `React`.
        -   `react-router` for routing.
-   `Typescript`.

### Backend

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

### Get it running locally

0. Clone the project from GitHub.

    - `$ git clone git@github.com:evansahit/compras.git`

#### Frontend

1.  Make sure you have Node.js installed.
2.  Navigate to the frontend project's folder:
    -   (from root) `$ cd frontend/`
3.  Install dependencies
    -   `$ npm i`
4.  Run the project
    -   `$ npm run dev`

#### Backend

##### **PostgreSQL**

6. Create the database locally:
    - On Linux
        - Make sure to have `psql` installed:
            - `$ sudo apt update`
            - `$ sudo apt install postgresql postgresql-contrib`
        - Create a new PostgreSQL user and database and assign privileges to this user:
            - `$ sudo -u postgres psql`
            - `$ CREATE USER compras_user WITH PASSWORD 'your_password';`
            - `$ CREATE DATABASE compras_db OWNER compras_user;`
            - `$ GRANT ALL PRIVILEGES ON DATABASE compras_database TO compras_user;`
            - `$ \q`
        - Test the connection
            - `$ psql -U compras_user -d compras_db`

##### **FastAPI**

7.  The project is running on Python 3.13, so follow the necessary steps to install that
8.  Navigate tot the backend project's folder:
    -   (from root) `$ cd backend/`
9.  Create a virtual environment named `venv` to silo dependencies to this project using the `venv` package:
    -   `$ python -m venv venv`
10. Activate the `venv` virtual environment:

    -   On MacOS/ Linux: `$ source venv/bin/activate`
    -   On Windows: `$ venv\Scripts\activate.bat`
    -   After activitation, you should see `(venv)` at the start of your terminal's line, e.g., `$ (venv) evan@Evan-PC:~/dev/compras/backend$`
    -   You can also double check which Python interpreter is being used by running `$ which python` on MacOS and Linux or `$ where python on Windows`. This should output the path to the Python interpreter used to create the virtual environment, e.g. `/home/evan/dev/compras/backend/venv/bin/python`

11. Install the dependencies:

    -   `$ pip install -r requirements.txt`

12. Run FastAPI:
    -   `$ fastapi dev app/main.py`

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
