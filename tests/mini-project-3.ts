import { prisma } from '../lib/prisma';
let createTag: any,
    addTagToGame: any,
    removeTagFromGame: any,
    getGameWithTags: any,
    getGamesByTag: any,
    deleteTag: any;

try {
    const tagFunctions = await import('../mini-project-3/index');
    ({
        createTag,
        addTagToGame,
        removeTagFromGame,
        getGameWithTags,
        getGamesByTag,
        deleteTag,
    } = tagFunctions as any);
} catch (_) {}

async function resetDB() {
    try {
        await (prisma as any).player.deleteMany();
        await (prisma as any).gameTag.deleteMany();
        await (prisma as any).tag.deleteMany();
        await (prisma as any).game.deleteMany();
    } catch (_) {}
}

async function createGameSQL(title: string, studio: string): Promise<any> {
    await prisma.$executeRaw`
        INSERT INTO "Game" (title, studio) VALUES (${title}, ${studio})
    `;
    const rows = await prisma.$queryRaw<any[]>`
        SELECT * FROM "Game" WHERE title = ${title} LIMIT 1
    `;
    return rows[0] ?? null;
}

async function createTagSQL(name: string): Promise<any> {
    await prisma.$executeRaw`
        INSERT INTO "Tag" (name) VALUES (${name})
    `;
    const rows = await prisma.$queryRaw<any[]>`
        SELECT * FROM "Tag" WHERE name = ${name} LIMIT 1
    `;
    return rows[0] ?? null;
}

async function addTagToGameSQL(gameId: number, tagId: number): Promise<void> {
    await prisma.$executeRaw`
        INSERT INTO "GameTag" ("gameId", "tagId") VALUES (${gameId}, ${tagId})
    `;
}

async function getTagByNameSQL(name: string): Promise<any> {
    const rows = await prisma.$queryRaw<any[]>`
        SELECT * FROM "Tag" WHERE name = ${name} LIMIT 1
    `;
    return rows[0] ?? null;
}

async function countGameTagsSQL(): Promise<number> {
    const rows = await prisma.$queryRaw<any[]>`
        SELECT COUNT(*) as count FROM "GameTag"
    `;
    return parseInt(rows[0].count, 10);
}

async function countTagsSQL(): Promise<number> {
    const rows = await prisma.$queryRaw<any[]>`
        SELECT COUNT(*) as count FROM "Tag"
    `;
    return parseInt(rows[0].count, 10);
}

async function checkCreateTag(): Promise<boolean> {
    try {
        await createTag('RPG');
        await createTag('Indie');

        const dbTag1 = await getTagByNameSQL('RPG');
        const dbTag2 = await getTagByNameSQL('Indie');

        if (!dbTag1 || !dbTag2) return false;
        if (dbTag1.name !== 'RPG' || dbTag2.name !== 'Indie') return false;
        if (dbTag1.id === dbTag2.id) return false;

        let threw = false;
        try {
            await createTag('RPG');
        } catch (_) {
            threw = true;
        }
        if (!threw) return false;

        const count = await countTagsSQL();
        if (count !== 2) return false;

        return true;
    } catch (_) {
        return false;
    }
}

async function checkAddTagToGame(): Promise<boolean> {
    try {
        const game = await createGameSQL('Hollow Knight', 'Team Cherry');
        const tag1 = await createTagSQL('RPG');
        const tag2 = await createTagSQL('Indie');
        if (!game?.id || !tag1?.id || !tag2?.id) return false;

        await addTagToGame(game.id, tag1.id);
        await addTagToGame(game.id, tag2.id);

        const count = await countGameTagsSQL();
        if (count !== 2) return false;

        let threw = false;
        try {
            await addTagToGame(game.id, tag1.id);
        } catch (_) {
            threw = true;
        }
        if (!threw) return false;

        let threwInvalid = false;
        try {
            await addTagToGame(-1, tag1.id);
        } catch (_) {
            threwInvalid = true;
        }
        if (!threwInvalid) return false;

        let threwInvalidTag = false;
        try {
            await addTagToGame(game.id, -1);
        } catch (_) {
            threwInvalidTag = true;
        }
        if (!threwInvalidTag) return false;

        return true;
    } catch (_) {
        return false;
    }
}

async function checkRemoveTagFromGame(): Promise<boolean> {
    try {
        const game = await createGameSQL('Celeste', 'Maddy Makes Games');
        const tag1 = await createTagSQL('Platformer');
        const tag2 = await createTagSQL('Indie');
        if (!game?.id || !tag1?.id || !tag2?.id) return false;

        await addTagToGameSQL(game.id, tag1.id);
        await addTagToGameSQL(game.id, tag2.id);

        await removeTagFromGame(game.id, tag1.id);

        const countAfter = await countGameTagsSQL();
        if (countAfter !== 1) return false;

        const rows = await prisma.$queryRaw<any[]>`
            SELECT * FROM "Game" WHERE id = ${game.id} LIMIT 1
        `;
        if (!rows[0]) return false;

        const tagStillExists = await getTagByNameSQL('Platformer');
        if (!tagStillExists) return false;

        const remaining = await prisma.$queryRaw<any[]>`
            SELECT * FROM "GameTag" WHERE "gameId" = ${game.id}
        `;
        if (remaining.length !== 1 || remaining[0].tagId !== tag2.id)
            return false;

        return true;
    } catch (_) {
        return false;
    }
}

async function checkgetGameWithTags(): Promise<boolean> {
    try {
        const game = await createGameSQL('Hades', 'Supergiant Games');
        const tag1 = await createTagSQL('RPG');
        const tag2 = await createTagSQL('Roguelike');
        if (!game?.id || !tag1?.id || !tag2?.id) return false;

        await addTagToGameSQL(game.id, tag1.id);
        await addTagToGameSQL(game.id, tag2.id);

        const result = await getGameWithTags(game.id);

        if (!result || typeof result !== 'object') return false;
        if (result.title !== 'Hades' || result.studio !== 'Supergiant Games')
            return false;
        if (!result.tags || !Array.isArray(result.tags)) return false;
        if (result.tags.length !== 2) return false;

        // flexible: GameTag peut exposer { tag: { name } } ou directement { name }
        const tagNames = result.tags.map((t: any) => t.tag?.name ?? t.name);
        if (!tagNames.includes('RPG') || !tagNames.includes('Roguelike'))
            return false;

        const gameEmpty = await createGameSQL('Celeste', 'Maddy Makes Games');
        const resultEmpty = await getGameWithTags(gameEmpty.id);
        if (!resultEmpty || !Array.isArray(resultEmpty.tags)) return false;
        if (resultEmpty.tags.length !== 0) return false;

        const nonExistent = await getGameWithTags(-1);
        if (nonExistent !== null && nonExistent !== undefined) return false;

        return true;
    } catch (_) {
        return false;
    }
}

async function checkGetGamesByTag(): Promise<boolean> {
    try {
        const game1 = await createGameSQL('Hollow Knight', 'Team Cherry');
        const game2 = await createGameSQL('Celeste', 'Maddy Makes Games');
        const game3 = await createGameSQL('Hades', 'Supergiant Games');
        const tag1 = await createTagSQL('Indie');
        const tag2 = await createTagSQL('Roguelike');
        if (!game1?.id || !game2?.id || !game3?.id || !tag1?.id || !tag2?.id)
            return false;

        await addTagToGameSQL(game1.id, tag1.id);
        await addTagToGameSQL(game2.id, tag1.id);
        await addTagToGameSQL(game3.id, tag2.id);

        const games = await getGamesByTag(tag1.id);
        if (!games || !Array.isArray(games)) return false;
        if (games.length !== 2) return false;

        if (
            !games.some((g: any) => g.title === 'Hollow Knight') ||
            !games.some((g: any) => g.title === 'Celeste')
        )
            return false;
        if (games.some((g: any) => g.title === 'Hades')) return false;

        const gamesTag2 = await getGamesByTag(tag2.id);
        if (!gamesTag2 || gamesTag2.length !== 1) return false;
        if (!gamesTag2.some((g: any) => g.title === 'Hades')) return false;

        const gamesNone = await getGamesByTag(-1);
        if (!Array.isArray(gamesNone) || gamesNone.length !== 0) return false;

        return true;
    } catch (_) {
        return false;
    }
}

async function checkDeleteTag(): Promise<boolean> {
    try {
        const game1 = await createGameSQL('Hollow Knight', 'Team Cherry');
        const game2 = await createGameSQL('Celeste', 'Maddy Makes Games');
        const tag1 = await createTagSQL('Indie');
        const tag2 = await createTagSQL('Platformer');
        if (!game1?.id || !game2?.id || !tag1?.id || !tag2?.id) return false;

        await addTagToGameSQL(game1.id, tag1.id);
        await addTagToGameSQL(game2.id, tag1.id);
        await addTagToGameSQL(game1.id, tag2.id);

        await deleteTag(tag1.id);

        const deletedTag = await getTagByNameSQL('Indie');
        if (deletedTag) return false;

        const remainingGameTags = await prisma.$queryRaw<any[]>`
            SELECT * FROM "GameTag" WHERE "tagId" = ${tag1.id}
        `;
        if (remainingGameTags.length !== 0) return false;

        const countAfter = await countGameTagsSQL();
        if (countAfter !== 1) return false;

        const rows = await prisma.$queryRaw<any[]>`
            SELECT * FROM "Game" WHERE id = ${game1.id} OR id = ${game2.id}
        `;
        if (rows.length !== 2) return false;

        try {
            await deleteTag(-1);
        } catch (_) {}
        const countFinal = await countTagsSQL();
        if (countFinal !== 1) return false;

        return true;
    } catch (_) {
        return false;
    }
}

async function main() {
    const tests: { name: string; fn: () => Promise<boolean> }[] = [
        { name: 'createTag', fn: checkCreateTag },
        { name: 'addTagToGame', fn: checkAddTagToGame },
        { name: 'removeTagFromGame', fn: checkRemoveTagFromGame },
        { name: 'getGameWithTags', fn: checkgetGameWithTags },
        { name: 'getGamesByTag', fn: checkGetGamesByTag },
        { name: 'deleteTag', fn: checkDeleteTag },
    ];

    for (const test of tests) {
        await resetDB();
        if (!test.fn) {
            console.log(`Test: ${test.name} failed`);
            continue;
        }
        const passed = await test.fn();
        if (!passed) {
            console.log(`Test: ${test.name} failed`);
        } else {
            console.log(`Test: ${test.name} passed`);
        }
    }
    await resetDB();
}

main().then(async () => {
    await prisma.$disconnect();
});
