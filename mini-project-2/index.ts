import { prisma } from '../lib/prisma';

export async function createPlayer(
    username: string,
    level: number,
    gameId: number,
) {
    // TODO
}

export async function getPlayersByGame(gameId: number) {
    // TODO
}

export async function getPlayerWithGame(playerId: number) {
    // TODO
}

export async function getGameWithPlayers(gameId: number) {
    // TODO
}

export async function deletePlayer(playerId: number) {
    // TODO
}
