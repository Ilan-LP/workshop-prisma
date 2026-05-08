# Mini-Project 3 - M-N Relations

In this third mini-project, you will extend the schema with a `Tag` model and implement a **many-to-many (M-N) relationship** between `Game` and `Tag` through an **explicit join table** (`GameTag`).

---

## Objective

Fill in `mini-project-3/index.ts` with the following functions:

| Function                           | Description                                         |
| ---------------------------------- | --------------------------------------------------- |
| `createTag(name)`                  | Creates a new tag                                   |
| `addTagToGame(gameId, tagId)`      | Links an existing tag to an existing game           |
| `removeTagFromGame(gameId, tagId)` | Removes a tag from a game (without deleting either) |
| `getGameWithTags(gameId)`          | Returns a game with all its tags included           |
| `getGamesByTag(tagId)`             | Returns all games linked to a specific tag          |
| `deleteTag(tagId)`                 | Deletes a tag and all its related GameTag entries   |

---

## Schema

Extend `prisma/schema.prisma` with the `Tag` and `GameTag` models, and update `Game`:

```text
Game {
  id        ... (auto increment)
  title     ... (must be unique)
  studio    ...

  players   ... (relation to Player)
  tags      ... (relation to GameTag)
}

Tag {
  id        ... (auto increment)
  name      ... (must be unique)

  games     ... (relation to GameTag)
}

GameTag {
  gameId    ... (foreign key to Game)
  tagId     ... (foreign key to Tag)

  game      ... (relation to Game)
  tag       ... (relation to Tag)

  @@id([gameId, tagId])   <- composite primary key
}
```

Then run:

```bash
npx prisma migrate dev
```

---

## Testing

```bash
npm run test3
```

---

## Resources

- [Prisma Docs - Explicit many-to-many relations](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/many-to-many-relations#explicit-many-to-many-relations)
- [Prisma Docs - Relation queries](https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries)
