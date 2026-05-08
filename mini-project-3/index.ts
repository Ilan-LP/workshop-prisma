import { $Enums } from '../generated/prisma/browser';
import { prisma } from '../lib/prisma';

export async function createTag(name: string) {
    // TODO
}

export async function addTagToGame(gameId: number, tagId: number) {
    // TODO
}

export async function removeTagFromGame(gameId: number, tagId: number) {
    // TODO
}

export async function getGamesWithTag(gameId: number) {
    // TODO
}

export async function getGamesByTag(tagId: number) {
    // TODO
}

export async function deleteTag(tagId: number) {
    // TODO
}
