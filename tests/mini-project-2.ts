import { prisma } from '../lib/prisma';
let createPlayer: any,
    getPlayersByGame: any,
    getPlayerWithGame: any,
    getGameWithPlayers: any,
    deletePlayer: any;

try {
    const playerFunctions = await import('../mini-project-2/index');
    ({
        createPlayer,
        getPlayersByGame,
        getPlayerWithGame,
        getGameWithPlayers,
        deletePlayer,
    } = playerFunctions as any);
} catch (_) {}

async function resetDB() {
    try {
        await (prisma as any).player.deleteMany();
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

async function createPlayerSQL(
    username: string,
    level: number,
    gameId: number,
): Promise<any> {
    await prisma.$executeRaw`
        INSERT INTO "Player" (username, level, "gameId") VALUES (${username}, ${level}, ${gameId})
    `;
    const rows = await prisma.$queryRaw<any[]>`
        SELECT * FROM "Player" WHERE username = ${username} LIMIT 1
    `;
    return rows[0] ?? null;
}

async function getPlayerByUsernameSQL(username: string): Promise<any> {
    const rows = await prisma.$queryRaw<any[]>`
        SELECT * FROM "Player" WHERE username = ${username} LIMIT 1
    `;
    return rows[0] ?? null;
}

async function countPlayersSQL(): Promise<number> {
    const rows = await prisma.$queryRaw<
        any[]
    >`SELECT COUNT(*) as count FROM "Player"`;
    return parseInt(rows[0].count, 10);
}

async function checkCreatePlayer(): Promise<boolean> {
    try {
        const game = await createGameSQL('Hollow Knight', 'Team Cherry');
        if (!game?.id) return false;

        await createPlayer('Kazuya', 42, game.id);
        await createPlayer('Rindou', 17, game.id);

        const dbPlayer1 = await getPlayerByUsernameSQL('Kazuya');
        const dbPlayer2 = await getPlayerByUsernameSQL('Rindou');

        if (!dbPlayer1 || !dbPlayer2) return false;
        if (dbPlayer1.username !== 'Kazuya' || dbPlayer1.level !== 42)
            return false;
        if (dbPlayer2.username !== 'Rindou' || dbPlayer2.level !== 17)
            return false;
        if (dbPlayer1.gameId !== game.id || dbPlayer2.gameId !== game.id)
            return false;
        if (dbPlayer1.id === dbPlayer2.id) return false;

        let threw = false;
        try {
            await createPlayer('Kazuya', 99, game.id);
        } catch (_) {
            threw = true;
        }
        if (!threw) return false;

        let threwInvalid = false;
        try {
            await createPlayer('Ghost', 1, -1);
        } catch (_) {
            threwInvalid = true;
        }
        if (!threwInvalid) return false;

        const count = await countPlayersSQL();
        if (count !== 2) return false;

        return true;
    } catch (_) {
        return false;
    }
}

async function checkGetPlayersByGame(): Promise<boolean> {
    try {
        const game1 = await createGameSQL('Celeste', 'Maddy Makes Games');
        const game2 = await createGameSQL('Hades', 'Supergiant Games');
        if (!game1?.id || !game2?.id) return false;

        await createPlayerSQL('Alice', 10, game1.id);
        await createPlayerSQL('Bob', 20, game1.id);
        await createPlayerSQL('Charlie', 5, game2.id);

        const players1 = await getPlayersByGame(game1.id);
        if (!players1 || !Array.isArray(players1)) return false;
        if (players1.length !== 2) return false;

        const usernames1 = players1.map((p: any) => p.username);
        if (!usernames1.includes('Alice') || !usernames1.includes('Bob'))
            return false;
        if (usernames1.includes('Charlie')) return false;

        for (const p of players1) {
            if (p.gameId !== game1.id) return false;
        }

        const players2 = await getPlayersByGame(game2.id);
        if (!players2 || players2.length !== 1) return false;
        if (players2[0].username !== 'Charlie') return false;

        const playersNone = await getPlayersByGame(-1);
        if (!Array.isArray(playersNone) || playersNone.length !== 0)
            return false;

        return true;
    } catch (_) {
        return false;
    }
}

async function checkGetPlayerWithGame(): Promise<boolean> {
    try {
        const game = await createGameSQL('Hollow Knight', 'Team Cherry');
        if (!game?.id) return false;

        const player = await createPlayerSQL('Kazuya', 42, game.id);
        if (!player?.id) return false;

        const result = await getPlayerWithGame(player.id);

        if (!result || typeof result !== 'object') return false;
        if (result.username !== 'Kazuya' || result.level !== 42) return false;
        if (!result.game || typeof result.game !== 'object') return false;
        if (
            result.game.title !== 'Hollow Knight' ||
            result.game.studio !== 'Team Cherry'
        )
            return false;
        if (result.game.id !== game.id) return false;

        const nonExistent = await getPlayerWithGame(-1);
        if (nonExistent !== null && nonExistent !== undefined) return false;

        return true;
    } catch (_) {
        return false;
    }
}

async function checkGetGameWithPlayers(): Promise<boolean> {
    try {
        const game = await createGameSQL('Celeste', 'Maddy Makes Games');
        if (!game?.id) return false;

        await createPlayerSQL('Alice', 10, game.id);
        await createPlayerSQL('Bob', 20, game.id);

        const result = await getGameWithPlayers(game.id);

        if (!result || typeof result !== 'object') return false;
        if (result.title !== 'Celeste' || result.studio !== 'Maddy Makes Games')
            return false;
        if (!result.players || !Array.isArray(result.players)) return false;
        if (result.players.length !== 2) return false;

        const usernames = result.players.map((p: any) => p.username);
        if (!usernames.includes('Alice') || !usernames.includes('Bob'))
            return false;

        const gameEmpty = await createGameSQL('Hades', 'Supergiant Games');
        const resultEmpty = await getGameWithPlayers(gameEmpty.id);
        if (!resultEmpty || !Array.isArray(resultEmpty.players)) return false;
        if (resultEmpty.players.length !== 0) return false;

        const nonExistent = await getGameWithPlayers(-1);
        if (nonExistent !== null && nonExistent !== undefined) return false;

        return true;
    } catch (_) {
        return false;
    }
}

async function checkDeletePlayer(): Promise<boolean> {
    try {
        const game = await createGameSQL('Hollow Knight', 'Team Cherry');
        if (!game?.id) return false;

        await createPlayerSQL('Alice', 10, game.id);
        await createPlayerSQL('Bob', 20, game.id);
        await createPlayerSQL('Charlie', 5, game.id);

        const alice = await getPlayerByUsernameSQL('Alice');
        if (!alice?.id) return false;

        await deletePlayer(alice.id);

        const deletedPlayer = await getPlayerByUsernameSQL('Alice');
        if (deletedPlayer) return false;

        const count = await countPlayersSQL();
        if (count !== 2) return false;

        const bob = await getPlayerByUsernameSQL('Bob');
        const charlie = await getPlayerByUsernameSQL('Charlie');
        if (!bob || !charlie) return false;

        try {
            await deletePlayer(-1);
        } catch (_) {}
        const countAfter = await countPlayersSQL();
        if (countAfter !== 2) return false;

        return true;
    } catch (_) {
        return false;
    }
}

async function main() {
    const tests: { name: string; fn: () => Promise<boolean> }[] = [
        { name: 'createPlayer', fn: checkCreatePlayer },
        { name: 'getPlayersByGame', fn: checkGetPlayersByGame },
        { name: 'getPlayerWithGame', fn: checkGetPlayerWithGame },
        { name: 'getGameWithPlayers', fn: checkGetGameWithPlayers },
        { name: 'deletePlayer', fn: checkDeletePlayer },
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
