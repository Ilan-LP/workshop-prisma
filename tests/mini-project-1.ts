import { prisma } from '../lib/prisma';

let createGame: any,
    getAllGames: any,
    getGameById: any,
    updateGameTitle: any,
    deleteGame: any;

try {
    const gameFunctions = await import('../mini-project-1/index');
    ({ createGame, getAllGames, getGameById, updateGameTitle, deleteGame } =
        gameFunctions as any);
} catch (_) {}

async function resetDB() {
    try {
        await (prisma as any).game.deleteMany();
    } catch (_) {}
}

async function createGameSQL(title: string, studio: string) {
    return await prisma.$executeRaw`
        INSERT INTO "Game" (title, studio) VALUES (${title}, ${studio})
    `;
}

async function getGameByTitleSQL(title: string): Promise<any> {
    const rows = await prisma.$queryRaw<any[]>`
        SELECT * FROM "Game" WHERE title = ${title} LIMIT 1
    `;
    return rows[0] ?? null;
}

async function countGamesSQL(): Promise<number> {
    const rows = await prisma.$queryRaw<
        any[]
    >`SELECT COUNT(*) as count FROM "Game"`;
    return parseInt(rows[0].count, 10);
}

async function checkCreateGames(): Promise<boolean> {
    try {
        const game1 = { title: 'Hollow Knight', studio: 'Team Cherry' };
        const game2 = { title: 'Celeste', studio: 'Maddy Makes Games' };

        await createGame(game1.title, game1.studio);
        await createGame(game2.title, game2.studio);

        const dbGame1 = await getGameByTitleSQL(game1.title);
        const dbGame2 = await getGameByTitleSQL(game2.title);

        if (!dbGame1 || !dbGame2) return false;
        if (dbGame1.title !== game1.title || dbGame1.studio !== game1.studio)
            return false;
        if (dbGame2.title !== game2.title || dbGame2.studio !== game2.studio)
            return false;

        if (dbGame1.id === dbGame2.id) return false;

        let threw = false;
        try {
            await createGame(game1.title, 'Another Studio');
        } catch (_) {
            threw = true;
        }
        if (!threw) return false;

        const count = await countGamesSQL();
        if (count !== 2) return false;

        return true;
    } catch (_) {
        return false;
    }
}

async function checkGetAllGames(): Promise<boolean> {
    try {
        const games = [
            { title: 'Hollow Knight', studio: 'Team Cherry' },
            { title: 'Celeste', studio: 'Maddy Makes Games' },
            { title: 'Hades', studio: 'Supergiant Games' },
        ];

        for (const game of games) {
            await createGameSQL(game.title, game.studio);
        }

        const dbGames = await getAllGames();

        if (!dbGames || !Array.isArray(dbGames)) return false;
        if (dbGames.length !== games.length) return false;

        for (const game of games) {
            const dbGame = dbGames.find((g: any) => g?.title === game.title);
            if (!dbGame) return false;
            if (dbGame.title !== game.title || dbGame.studio !== game.studio)
                return false;
        }

        const titles = dbGames.map((g: any) => g.title);
        if (new Set(titles).size !== titles.length) return false;

        return true;
    } catch (_) {
        return false;
    }
}

async function checkGetGameById(): Promise<boolean> {
    try {
        const games = [
            { title: 'Hollow Knight', studio: 'Team Cherry' },
            { title: 'Celeste', studio: 'Maddy Makes Games' },
            { title: 'Hades', studio: 'Supergiant Games' },
        ];

        for (const game of games) {
            await createGameSQL(game.title, game.studio);
        }

        const game1 = await getGameByTitleSQL(games[0].title);
        if (!game1?.id) return false;

        const dbGame1 = await getGameById(game1.id);

        if (!dbGame1 || typeof dbGame1 !== 'object') return false;
        if (dbGame1.title !== game1.title || dbGame1.studio !== game1.studio)
            return false;

        const nonExistent = await getGameById(-1);
        if (nonExistent !== null && nonExistent !== undefined) return false;

        const game2 = await getGameByTitleSQL(games[1].title);
        const dbGame2 = await getGameById(game2.id);
        if (dbGame2.id === dbGame1.id) return false;

        return true;
    } catch (_) {
        return false;
    }
}

async function checkUpdateGameTitle(): Promise<boolean> {
    try {
        const games = [
            { title: 'Hollow Knight', studio: 'Team Cherry' },
            { title: 'Celeste', studio: 'Maddy Makes Games' },
            { title: 'Hades', studio: 'Supergiant Games' },
        ];

        for (const game of games) {
            await createGameSQL(game.title, game.studio);
        }

        const game1 = await getGameByTitleSQL(games[0].title);
        if (!game1?.id) return false;

        const newTitle = 'Hollow Knight: Silksong';
        await updateGameTitle(game1.id, newTitle);

        const updatedGame = await getGameByTitleSQL(newTitle);

        if (!updatedGame || typeof updatedGame !== 'object') return false;
        if (updatedGame.title !== newTitle) return false;
        if (updatedGame.studio !== game1.studio) return false;
        if (updatedGame.id !== game1.id) return false;

        const oldGame = await getGameByTitleSQL(games[0].title);
        if (oldGame) return false;

        const count = await countGamesSQL();
        if (count !== games.length) return false;

        let threw = false;
        try {
            await updateGameTitle(game1.id, games[1].title);
        } catch (_) {
            threw = true;
        }
        if (!threw) return false;

        return true;
    } catch (_) {
        return false;
    }
}

async function checkDeleteGame(): Promise<boolean> {
    try {
        const games = [
            { title: 'Hollow Knight', studio: 'Team Cherry' },
            { title: 'Celeste', studio: 'Maddy Makes Games' },
            { title: 'Hades', studio: 'Supergiant Games' },
        ];

        for (const game of games) {
            await createGameSQL(game.title, game.studio);
        }

        const game1 = await getGameByTitleSQL(games[0].title);
        if (!game1?.id) return false;

        await deleteGame(game1.id);

        const deletedGame = await getGameByTitleSQL(games[0].title);
        if (deletedGame) return false;

        const count = await countGamesSQL();
        if (count !== games.length - 1) return false;

        const remaining2 = await getGameByTitleSQL(games[1].title);
        const remaining3 = await getGameByTitleSQL(games[2].title);
        if (!remaining2 || !remaining3) return false;

        try {
            await deleteGame(-1);
        } catch (_) {}
        const countAfter = await countGamesSQL();
        if (countAfter !== games.length - 1) return false;

        return true;
    } catch (_) {
        return false;
    }
}

async function main() {
    const tests: { name: string; fn: () => Promise<boolean> }[] = [
        { name: 'createGame', fn: checkCreateGames },
        { name: 'getAllGames', fn: checkGetAllGames },
        { name: 'getGameById', fn: checkGetGameById },
        { name: 'updateGameTitle', fn: checkUpdateGameTitle },
        { name: 'deleteGame', fn: checkDeleteGame },
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
