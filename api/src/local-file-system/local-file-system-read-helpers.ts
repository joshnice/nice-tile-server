import { readFile as readFileNode, mkdir, rmdir } from "node:fs/promises";
import { existsSync } from "node:fs";

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

export function findDirectory(path: string): boolean {
    return existsSync(path);
}

export async function deleteDirectory(path: string, throwErrorIfNotFound = true): Promise<void> {
    try {
        await rmdir(path);
    } catch (err) {
        if (throwErrorIfNotFound) {
            console.error(err);
        }
    }
}

export async function createDirectory(path: string, folderName: string) {
    try {
        const fullPath = `${path}/${folderName}`;
        await mkdir(fullPath);
    } catch (err) {
        console.error(err);
    }
}
