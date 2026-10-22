# Workshop - "Prisma : la puissance du SQL sans la complexité des requêtes"

This workshop introduces **Prisma ORM** through 3 progressive mini-projects built in a **single project**.
The schema evolves at each step, just like in a real codebase.

---

## Goal of this Workshop

This workshop is **not a race**. You're not expected to finish all 3 mini-projects.

The goal is to go as far as you can **on your own**, understand what you're doing, and leave with a real grasp of how Prisma works in practice. A mini-project half-done but fully understood beats a completed one copy-pasted.

Ask questions, read the docs, experiment. That's the point.

---

## Repository Structure

```
workshop-prisma/
├── mini-project-1/
│   ├── index.ts        <- your functions go here
│   └── README.md
├── mini-project-2/
│   ├── index.ts
│   └── README.md
├── mini-project-3/
│   ├── index.ts
│   └── README.md
├── prisma/
│   ├── schema.prisma   <- evolves across mini-projects
│   └── migrations/     <- created by `prisma migrate dev`
├── lib/
│   └── prisma.ts
├── tests/
│   ├── mini-project-1.ts
│   ├── mini-project-2.ts
│   └── mini-project-3.ts
├── .env.example
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── README.md
```

---

## Mini-Projects

| #   | Subject           | New model(s)     | Description                              |
| --- | ----------------- | ---------------- | ---------------------------------------- |
| 1   | **CRUD**          | `Game`           | Create, read, update and delete games    |
| 2   | **1-N Relations** | `Player`         | Link player to their game                |
| 3   | **M-N Relations** | `Tag`, `GameTag` | Link games and tags through a join table |

Each mini-project builds on the previous one, don't delete your models when moving forward.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your database

Create a free PostgreSQL database and copy the connection URL.

```bash
npx create-db
```

### 3. Configure your environment

Create a `.env` file at the root (you can copy `.env.example`):

```env
DATABASE_URL="your-connection-url-here"
```

> Inside generated `DATABASE_URL`, replace `sslmode=require` by `sslmode=verify-full`.

### 4. Generate the Prisma client

```bash
npx prisma generate
```

> In Prisma 7, `prisma migrate dev` does **not** regenerate the client, so run `npx prisma generate` after every schema change.

You're ready to start **mini-project-1**.

---

## Workflow per mini-project

Each mini-project has its own README that tells you:

- What to add to `schema.prisma`
- What functions to implement in `index.ts`

---

## Testing your functions

As you implement your functions, you can run the tests to check your progress:

```bash
# All mini-projects
npm test
```

```bash
# Test only 1 mini-project (ex.1)
npm run test1
```

> ⚠️ **WARNING:** The tests run `deleteMany` on the tables (`Game`, `Player`, `Tag`, `GameTag`) before and after each test, which wipes all their data. Never run them on a database that matters.

---

## Useful Commands

```bash
# Generate the Prisma client after any schema change
npx prisma generate

# Apply migrations to the database
npx prisma migrate dev

# Visualize your data in the browser
npx prisma studio

# Run a specific file
npx tsx mini-project-X/index.ts
```

---

## Prerequisites

- Node.js ^20.19, ^22.12 or >= 24 (required by Prisma 7)
