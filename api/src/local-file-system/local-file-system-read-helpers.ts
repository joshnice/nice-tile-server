import { readFile as readFileNode } from 'node:fs/promises';

export async function readFile(path: string, throwErrorIfNotFound = true) {
    try {
        const data = await readFileNode(path, { encoding: "hex" });
        return Uint8Array.from(Buffer.from(data, 'hex'));
    } catch (err) {
        if (throwErrorIfNotFound) {
            console.error(err);
        }
    }
}
