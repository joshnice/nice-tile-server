import { readFile as readFileNode } from 'node:fs/promises';

export async function readFile(path: string, throwErrorIfNotFound = true) {
    try {
        const data = await readFileNode(path, { encoding: 'utf8' });
        return data;
    } catch (err) {
        if (throwErrorIfNotFound) {
            console.error(err);
        }
    }
}
