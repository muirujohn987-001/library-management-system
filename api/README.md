# Library Management System API

A RESTful backend API for managing a library's books, genres and users.

Built with NestJS, TypeScript, Prisma ORM and PostgreSQL.

## 1. Technology Stack

- NestJS 12
- TypeScript
- PostgreSQL (Neon)
- Prisma ORM 7
- JWT authentication
- Passport.js
- bcryptjs for password hashing
- class-validator for request validation

## 2. Features

### User Authentication
- User registration
- User login
- Password hashing with bcrypt
- JWT-based authentication
- User roles: PATRON and LIBRARIAN

### Genre Management
- Create a genre
- Retrieve all genres
- Retrieve a genre by ID
- Update a genre
- Delete a genre

### Book Management
- Create a book
- Retrieve all books
- Retrieve a book by ID
- Update a book
- Delete a book
- Filter books by genre
- Search books by title or author
- Paginate book results
- Track total and available copies

### Authorization
- Public book retrieval
- Librarian-only book creation, updating and deletion
- JWT authentication for protected book operations

## 3. Project Structure

```text
api/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts
│   │   ├── jwt-auth.guard.ts
│   │   ├── roles.decorator.ts
│   │   └── roles.guard.ts
│   ├── books/
│   │   ├── dto/
│   │   ├── books.controller.ts
│   │   └── books.service.ts
│   ├── genres/
│   │   ├── dto/
│   │   ├── genres.controller.ts
│   │   └── genres.service.ts
│   ├── prisma/
│   ├── app.module.ts
│   └── main.ts
├── .env.example
├── package.json
└── prisma7.config.ts
