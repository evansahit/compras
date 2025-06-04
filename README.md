# Compras+
This is a side project to practice my software chops. I want to create a fullstack web app and practice with various technologies.

Compras+ is a web app to track your shopping lists with a twist:

-   For each product prices are looked up at local grocery stores: Albert Heijn, Jumbo, Dirk vd Broek, etc.
-   This will provide an overview of where certain items will be the cheapest so you can plan your shopping trips better.

If your on a budget or just want some extra change at the end of the month, Compras+ will provide you that overview.

## Tech stack

The project is still in development, so exact tools are subject to change.

**Frontend**
- Frontend library/ framework
  - `React`.
    - `react-router` for routing.

**Backend**
- Backend framework
  - `FastAPI` (`Python`).
- Database 
  - `PostgreSQL`.
  - `SQLAlchemy` as a database engine/ connector.
  - `Alembic` for database migrations.
  - `Pydantic` for data validation (`FastAPI` makes heavy usage of `Pydantic`).
  - Writing raw `SQL` for DDL, DML and database functions and triggers to practice.
