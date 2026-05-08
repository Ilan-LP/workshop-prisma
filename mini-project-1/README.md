# Mini-Project 1 - CRUD

In this first mini-project, you will implement a basic **CRUD** (Create, Read, Update, Delete) on a `Game` model using **Prisma ORM** with a **PostgreSQL** database.

---

## Objective

Fill in `mini-project-1/index.ts` with the following 5 functions:

| Function                        | Description                 |
| ------------------------------- | --------------------------- |
| `createGame(title, studio)`     | Creates a new game          |
| `getAllGames()`                 | Returns all games           |
| `getGameById(id)`               | Returns a game by their ID  |
| `updateGameTitle(id, newTitle)` | Updates the title of a game |
| `deleteGame(id)`                | Deletes a game              |

---

## Schema

Add the `Game` model to `prisma/schema.prisma`:

```text
Game {
  id        ... (auto increment)
  title     ... (must be unique)
  author    ...
}
```

Then run:

```bash
npx prisma migrate dev
```

---

## Testing

```bash
npm run test1
```

---

## Resources

- [Prisma Docs - CRUD](https://www.prisma.io/docs/orm/prisma-client/queries/crud)
- [Prisma Docs - Getting Started](https://www.prisma.io/docs/prisma-orm/quickstart/prisma-postgres)
