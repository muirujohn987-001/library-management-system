# Library Management System

A Library Management System built with NestJS, Prisma ORM and PostgreSQL.

## Technologies Used

- **Backend:** NestJS
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma 7
- **Language:** TypeScript
- **Package Manager:** npm

## Database Schema

The database consists of three main models:

- **User:** Stores user information, including name, email, password hash and role.
- **Genre:** Stores book categories and their descriptions.
- **Book:** Stores book information and references its genre through a foreign key.

The `Role` enum defines two user roles: `PATRON` and `LIBRARIAN`.

## Schema Decisions

The `Genre` model is maintained separately from the `Book` model rather than embedding genre information directly into each book.

This design establishes a one-to-many relationship between genres and books. One genre can contain multiple books, while each book belongs to one genre.

Using a separate `Genre` model avoids repeating genre names and descriptions across multiple book records. It also makes it easier to update genre information consistently and maintain referential integrity through the `genreId` foreign key.

This relational approach improves data organisation, consistency and maintainability.

## Database Setup

1. Clone the repository.
2. Navigate into the API directory:

   ```bash
   cd api
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file using `.env.example` as a template.

5. Configure `DATABASE_URL` with your PostgreSQL pooled connection string and `DIRECT_URL` with your direct connection string.

6. Apply database migrations:

   ```bash
   npx prisma migrate dev
   ```

7. Generate Prisma Client:

   ```bash
   npx prisma generate
   ```

8. Seed the database:

   ```bash
   npx prisma db seed
   ```

## Running the Application

Start the development server:

```bash
npm run start:dev
```

Build the application:

```bash
npm run build
```

## Database Seeding

The seed script is located at `api/prisma/seed.ts`.

It populates the database with four genres and sixteen books distributed across those genres.

The script uses upsert operations to avoid creating duplicate records when executed repeatedly.

## Environment Variables

See `api/.env.example` for the required environment variable structure.

Never commit actual database credentials or secrets.
