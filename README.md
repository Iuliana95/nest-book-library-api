# nest-book-library-api

This project is a backend API for managing a book library, implemented in **TypeScript** using **NestJS**.

--------
# Features

* CRUD operations for **Books** (Add/Edit/Delete/List/View)

* CRUD operations for **Categories** (Add/Edit/Delete/List/View)

* Unique name validation for both Books and Categories

* Nested Categories (expandable to infinite depth)

* Breadcrumb generation for Books

* Automatic deletion of Books when their Category is removed

* Migrated to Prisma for database interaction

* Unit tests for core functionality (not updated after Prisma integration)

------------

# Installation

## Prerequisites

*   **Node.js** (v20+ recommended)

*   **PostgreSQL** (configurable via environment variables)


## Steps

```bash
# Clone the repository
git clone https://github.com/Iuliana95/nest-book-library-api.git
cd nest-book-library-api

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Update database credentials in .env
DATABASE_URL

# Initiate Database
npx prisma migrate deploy

# Populate Database with Test Data

# Option 1: Run SQL setup file via command line
Run the setup.sql file to populate the database
psql -U $DATABASE_USER -d $DATABASE_NAME -h $DATABASE_HOST -p $DATABASE_PORT -a -f setup.sql

# Option 2: Manually run the SQL in pgAdmin4
1. Open pgAdmin4 and connect to your database.
2. Open a query window.
3. Copy the contents of setup.sql file.
4. Paste and execute the queries in the query window.

# Build Project ( generates Prisma Client and dist Folder )
npm run build

# Start the server
npm start       # Start the application normally  
npm start:dev   # Start in development mode with watch mode  
npm start:prod  # Start in production mode  
```

## Run tests  (not updated after Prisma integration)

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

---------------------
# Swagger Documentation

Swagger UI is available at:

```bash
http://localhost:3000/api
```

-------
# License

This project is licensed under the MIT License.