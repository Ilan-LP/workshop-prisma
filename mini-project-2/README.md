# Mini-Project 2 - 1-N Relations

In this second mini-project, you will extend the schema with a `Player` model and implement a **one-to-many (1-N) relationship** between `Game` and `Player`.

---

## Objective

Fill in `mini-project-2/index.ts` with the following functions:

| Function                                | Description                                       | Returns                    |
| --------------------------------------- | ------------------------------------------------- | -------------------------- |
| `createPlayer(username, level, gameId)` | Creates a new player linked to a game             | -                          |
| `getPlayersByGame(gameId)`              | Returns all players registered in a specific game | Array of `Player` object   |
| `getPlayerWithGame(playerId)`           | Returns a player with their game included         | `Player` object with game  |
| `getGameWithPlayers(gameId)`            | Returns a game with all its players included      | `Game` object with players |
| `deletePlayer(playerId)`                | Deletes a player                                  | -                          |

---

## Schema

Extend `prisma/schema.prisma` with the `Player` model and update `Game`:

```text
Game {
  id        ... (auto increment)
  title     ... (must be unique)
  studio    ...

  players   ... (relation to Player)
}

Player {
  id        ... (auto increment)
  username  ... (must be unique)
  level     ... (integer)
  gameId    ... (foreign key)

  game      ... (relation to Game)
}
```

Then run:

```bash
npx prisma migrate dev
npx prisma generate
```

---

## Testing

```bash
npm run test2
```

---

## Resources

- [Prisma Docs - Relations](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations)
- [Prisma Docs - Relation queries](https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries)
