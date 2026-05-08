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
│   └── migrations/
├── lib/
│   └── prisma.ts
├── test/
│   ├── mini-project-1.ts
│   ├── mini-project-2.ts
│   └── mini-project-3.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## Mini-Projects

| #   | Subject           | New model(s) | Description                              |
| --- | ----------------- | ------------ | ---------------------------------------- |
| 1   | **CRUD**          | `User`       | Create, read, update and delete games    |
| 2   | **1-N Relations** | `Post`       | Link player to their game                |
| 3   | **M-N Relations** | `Tag`        | Link games and tags through a join table |

Each mini-project builds on the previous one, don't delete your models when moving forward.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your database

Create a free PostgreSQL database using `npx create-db` and copy the connection URL.

### 3. Configure your environment

Create a `.env` file at the root:

```env
DATABASE_URL="your-connection-url-here"
```

### 4. Run the first migration

```bash
npx prisma migrate dev
```

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

> ⚠️ **WARNING:** Test your function will reset your DB

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

- Node.js >= 18
